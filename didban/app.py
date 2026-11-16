"""Persian project review workbench. Flask + Waitress + SQLite; no remote AI calls."""
from __future__ import annotations
import argparse, csv, hashlib, hmac, io, json, os, secrets, socket, sqlite3, time, zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from flask import Flask, request, jsonify, g, send_file, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from content import ROLES, AGES, DIMENSIONS, RATINGS, DECISIONS, CASES, SOURCES, PARENT_QUESTIONS, REPORT_REVIEW
from phase_one import plan

ROOT=Path(__file__).resolve().parent
DATA=Path(os.environ.get('WORKBENCH_DATA',ROOT/'data'))
DATA.mkdir(parents=True,exist_ok=True)
DB=DATA/'workbench.sqlite3'
BANK=json.loads((ROOT/'bank.json').read_text(encoding='utf-8'))
ITEMS={x['id']:x for x in BANK['items']}
app=Flask(__name__,static_folder='static')
app.config['MAX_CONTENT_LENGTH']=1_000_000
app.config['PROPAGATE_EXCEPTIONS']=False
SCHEMA='''
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), csrf TEXT NOT NULL, expires REAL NOT NULL);
CREATE TABLE IF NOT EXISTS invites(id INTEGER PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, label TEXT NOT NULL, role TEXT NOT NULL, expires REAL NOT NULL, used_by INTEGER REFERENCES users(id), created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), kind TEXT NOT NULL, target TEXT NOT NULL, target_version TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, revision INTEGER NOT NULL, updated REAL NOT NULL, UNIQUE(user_id,kind,target,target_version));
CREATE TABLE IF NOT EXISTS review_history(id INTEGER PRIMARY KEY, review_id INTEGER NOT NULL REFERENCES reviews(id), revision INTEGER NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS resolutions(id INTEGER PRIMARY KEY, kind TEXT NOT NULL, target TEXT NOT NULL, target_version TEXT NOT NULL, decision TEXT NOT NULL, reason TEXT NOT NULL, reviewer_id INTEGER NOT NULL REFERENCES users(id), updated REAL NOT NULL, UNIQUE(kind,target,target_version));
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT NOT NULL, details TEXT NOT NULL, created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS analysis_log(id INTEGER PRIMARY KEY, hypothesis TEXT NOT NULL, evidence TEXT NOT NULL, outcome TEXT NOT NULL, next_action TEXT NOT NULL, reviewer_id INTEGER NOT NULL REFERENCES users(id), created REAL NOT NULL);
CREATE TABLE IF NOT EXISTS resolution_history(id INTEGER PRIMARY KEY, kind TEXT NOT NULL, target TEXT NOT NULL, target_version TEXT NOT NULL, decision TEXT NOT NULL, reason TEXT NOT NULL, reviewer_id INTEGER NOT NULL REFERENCES users(id), updated REAL NOT NULL);
'''

def db():
    if 'db' not in g:
        g.db=sqlite3.connect(DB,timeout=15)
        g.db.row_factory=sqlite3.Row
        g.db.execute('PRAGMA foreign_keys=ON')
    return g.db

@app.teardown_appcontext
def close_db(error=None):
    conn=g.pop('db',None)
    if conn: conn.close()

def digest(s): return hashlib.sha256(s.encode()).hexdigest()
def now(): return time.time()
def bridge_authorized(purpose):
    secret=os.environ.get('ADMIN_SECRET','')
    expected=hmac.new(secret.encode(),purpose.encode(),hashlib.sha256).hexdigest()
    return bool(secret) and request.remote_addr in ('127.0.0.1','::1') and secrets.compare_digest(request.headers.get('X-Didban-Bridge',''),expected)

def audit(uid,action,detail):
    db().execute('INSERT INTO audit(user_id,action,details,created) VALUES(?,?,?,?)',(uid,action,json.dumps(detail,ensure_ascii=False),now()))

def initialize():
    conn=sqlite3.connect(DB); conn.executescript(SCHEMA)
    if 'is_test' not in {r[1] for r in conn.execute('PRAGMA table_info(users)')}:
        conn.execute('ALTER TABLE users ADD COLUMN is_test INTEGER NOT NULL DEFAULT 0')
    conn.execute('INSERT INTO resolution_history(kind,target,target_version,decision,reason,reviewer_id,updated) SELECT kind,target,target_version,decision,reason,reviewer_id,updated FROM resolutions r WHERE NOT EXISTS (SELECT 1 FROM resolution_history h WHERE h.kind=r.kind AND h.target=r.target AND h.target_version=r.target_version AND h.updated=r.updated AND h.decision=r.decision AND h.reason=r.reason)')
    conn.execute("INSERT INTO meta VALUES('schema_version','2') ON CONFLICT(key) DO UPDATE SET value=excluded.value")
    if not conn.execute("SELECT id FROM users WHERE role='lead'").fetchone():
        password=secrets.token_urlsafe(12)
        conn.execute('INSERT INTO users(username,name,role,password_hash,created) VALUES(?,?,?,?,?)',('analyst','تحلیل‌گر پروژه','lead',generate_password_hash(password),now()))
        (DATA/'LOCAL_ACCESS.txt').write_text('Local analyst credentials (keep private)\nUsername: analyst\nPassword: '+password+'\n',encoding='utf-8')
    conn.commit(); conn.close()

def issue_session(user_id):
    token=secrets.token_urlsafe(32); csrf=secrets.token_urlsafe(24)
    db().execute('INSERT INTO sessions VALUES(?,?,?,?)',(digest(token),user_id,csrf,now()+86400*7))
    db().execute('DELETE FROM sessions WHERE expires < ?',(now(),)); db().commit()
    return token,csrf

def session_response(user_id):
    token,csrf=issue_session(user_id)
    resp=jsonify({'ok':True,'csrf':csrf})
    resp.set_cookie('workbench_session',token,httponly=True,samesite='Strict',max_age=86400*7,secure=request.is_secure)
    return resp

@app.before_request
def security():
    host=request.host.split(':')[0].lower()
    if host not in app.config.get('ALLOWED_HOSTS',{'localhost','127.0.0.1'}): return jsonify(error='نشانی میزبان مجاز نیست.'),400
    g.user=None; g.csrf=None
    token=request.cookies.get('workbench_session','')
    if token:
        row=db().execute('SELECT u.*,s.csrf FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>? AND u.active=1',(digest(token),now())).fetchone()
        if row: g.user=dict(row); g.csrf=row['csrf']
    if request.method in ('POST','PUT','DELETE','PATCH'):
        origin=request.headers.get('Origin')
        if origin and origin!=request.host_url.rstrip('/'): return jsonify(error='درخواست از مبدأ دیگری پذیرفته نمی‌شود.'),403
        if not request.is_json: return jsonify(error='قالب درخواست باید JSON باشد.'),415
        if request.path=='/api/internal/provision':
            if not bridge_authorized('didban-provision-v1'):return jsonify(error='دسترسی مجاز نیست.'),403
            return
        if request.path not in ('/api/login','/api/register','/api/local-login'):
            if not g.user: return jsonify(error='برای ادامه وارد حساب شوید.'),401
            if not secrets.compare_digest(request.headers.get('X-CSRF-Token',''),g.csrf or ''): return jsonify(error='نشست تغییر کرده است؛ صفحه را تازه کنید.'),403

@app.after_request
def headers(resp):
    resp.headers['X-Content-Type-Options']='nosniff'
    resp.headers['X-Frame-Options']='SAMEORIGIN'
    resp.headers['Referrer-Policy']='no-referrer'
    resp.headers['Content-Security-Policy']="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
    if request.path.startswith('/api/'): resp.headers['Cache-Control']='no-store'
    return resp

def auth(lead=False):
    def decorator(fn):
        @wraps(fn)
        def wrapped(*a,**kw):
            if not g.user:return jsonify(error='برای ادامه وارد حساب شوید.'),401
            if lead and g.user['role']!='lead':return jsonify(error='این بخش مخصوص تحلیل‌گر پروژه است.'),403
            return fn(*a,**kw)
        return wrapped
    return decorator

def fail(message,code=400):return jsonify(error=message),code
def text(value,maxlen=6000):
    if not isinstance(value,str):raise ValueError('متن نامعتبر است.')
    value=value.strip()
    if len(value)>maxlen:raise ValueError('متن بیش از حد طولانی است.')
    return value

@app.errorhandler(ValueError)
def bad_value(error):return fail(str(error))
@app.errorhandler(413)
def too_big(error):return fail('حجم داده بیش از حد مجاز است.',413)
@app.errorhandler(500)
def internal(error):return fail('ذخیره انجام نشد. دادهٔ فرم حفظ شده است؛ دوباره تلاش کنید.',500)

@app.get('/')
def index():
    prefix=os.environ.get('WORKBENCH_PREFIX','').rstrip('/')
    return (ROOT/'static'/'index.html').read_text(encoding='utf-8').replace('"/static/','"'+prefix+'/static/')

@app.get('/api/health')
def health():return jsonify(ok=True,bank_count=len(ITEMS),version=BANK['version'])

ATTEMPTS={}
@app.post('/api/login')
def login():
    p=request.get_json(); key=request.remote_addr
    recent=[t for t in ATTEMPTS.get(key,[]) if t>now()-300]
    if len(recent)>=20:return fail('تلاش‌های ناموفق زیاد است؛ پنج دقیقه بعد دوباره امتحان کنید.',429)
    row=db().execute('SELECT * FROM users WHERE username=? AND active=1',(text(p.get('username',''),80),)).fetchone()
    if not row or not check_password_hash(row['password_hash'],p.get('password','')):
        ATTEMPTS[key]=recent+[now()];return fail('نام کاربری یا رمز درست نیست.',401)
    ATTEMPTS.pop(key,None);audit(row['id'],'login',{});return session_response(row['id'])

@app.post('/api/local-login')
def local_login():
    if request.remote_addr not in ('127.0.0.1','::1'):return fail('ورود سریع فقط روی همین رایانه ممکن است.',403)
    supplied=request.get_json().get('token','')
    saved=db().execute("SELECT value FROM meta WHERE key='local_token'").fetchone()
    if not saved or not secrets.compare_digest(digest(supplied),saved['value']):return fail('لینک ورود سریع معتبر نیست. برنامه را از راه‌انداز باز کنید.',403)
    uid=db().execute("SELECT id FROM users WHERE role='lead' AND active=1 ORDER BY id LIMIT 1").fetchone()['id']
    audit(uid,'local_login',{});return session_response(uid)

@app.post('/api/logout')
@auth()
def logout():
    db().execute('DELETE FROM sessions WHERE token_hash=?',(digest(request.cookies.get('workbench_session','')),));db().commit()
    resp=jsonify(ok=True);resp.delete_cookie('workbench_session');return resp

@app.get('/api/invite/<token>')
def invite_info(token):
    row=db().execute('SELECT label,role FROM invites WHERE token_hash=? AND used_by IS NULL AND expires>?',(digest(token),now())).fetchone()
    return jsonify(dict(row)) if row else fail('دعوت‌نامه استفاده شده یا منقضی است. از تحلیل‌گر لینک تازه بگیرید.',404)

@app.post('/api/register')
def register():
    p=request.get_json(); name=text(p.get('name',''),80); username=text(p.get('username',''),60); password=p.get('password','')
    if len(name)<2 or len(username)<3 or not username.replace('-','').replace('_','').isalnum():return fail('نام را کامل و نام کاربری را حداقل سه حرف یا عدد وارد کنید.')
    if not isinstance(password,str) or not 8<=len(password)<=128:return fail('رمز باید بین ۸ تا ۱۲۸ نویسه باشد.')
    conn=db(); conn.execute('BEGIN IMMEDIATE')
    inv=conn.execute('SELECT * FROM invites WHERE token_hash=? AND used_by IS NULL AND expires>?',(digest(p.get('token','')),now())).fetchone()
    if not inv:conn.rollback();return fail('دعوت‌نامه معتبر نیست.',400)
    try:
        uid=conn.execute('INSERT INTO users(username,name,role,password_hash,created) VALUES(?,?,?,?,?)',(username,name,inv['role'],generate_password_hash(password),now())).lastrowid
        conn.execute('UPDATE invites SET used_by=? WHERE id=?',(uid,inv['id']));audit(uid,'register',{'invite_id':inv['id']});conn.commit()
    except sqlite3.IntegrityError:conn.rollback();return fail('این نام کاربری قبلاً انتخاب شده است.',409)
    return session_response(uid)

def user_public(u):return {k:u[k] for k in ('id','username','name','role','is_test')}

@app.get('/api/bootstrap')
def bootstrap():
    if not g.user:return jsonify(user=None)
    rows=db().execute('SELECT kind,target,target_version,payload,status,revision,updated FROM reviews WHERE user_id=?',(g.user['id'],)).fetchall()
    reviews=[{**dict(r),'payload':json.loads(r['payload'])} for r in rows]
    return jsonify(user=user_public(g.user),csrf=g.csrf,roles=ROLES,ages=AGES,dimensions=DIMENSIONS,ratings=RATINGS,decisions=DECISIONS,cases=CASES,parent_questions=PARENT_QUESTIONS,report_review=REPORT_REVIEW,sources=SOURCES,bank=BANK,reviews=reviews,phase_one=plan(BANK,DECISIONS,CASES))

def target_version(kind,target):
    if kind=='item' and target in ITEMS:return str(ITEMS[target]['version'])+':'+BANK['version']
    if kind=='decision' and target in {x['id'] for x in DECISIONS}:return '1'
    if kind=='case' and target in {x['id'] for x in CASES}:return '1'
    if kind=='parent_question' and target in {x['id'] for x in PARENT_QUESTIONS}:return '1'
    if kind=='report_review' and target==REPORT_REVIEW['id']:return '1'
    raise ValueError('موضوع بررسی پیدا نشد.')

def validate_review(kind,target,p,status):
    if not isinstance(p,dict):raise ValueError('پاسخ نامعتبر است.')
    clean={}
    if kind=='item':
        scores=p.get('ratings',{})
        if not isinstance(scores,dict):raise ValueError('امتیازهای داوری نامعتبرند.')
        clean['ratings']={}
        for r in RATINGS:
            n=scores.get(r['key'])
            if n is not None and (type(n) is not int or n not in (1,2,3,4)):raise ValueError('امتیاز داوری باید ۱ تا ۴ یا نامشخص باشد.')
            clean['ratings'][r['key']]=n
        enums={'key_verdict':['correct','ambiguous','wrong','unsure'],'action':['accept','minor','major','reject','outside'],'difficulty':['easy','medium','hard','unsure'],'confidence':['low','medium','high']}
        for field,allowed in enums.items():
            val=p.get(field,'')
            if val and val not in allowed:raise ValueError('گزینهٔ نامعتبر در فرم.')
            clean[field]=val
        for field in ('notes','rewrite','confound','transfer_notes'):clean[field]=text(p.get(field,''))
        if status=='submitted':
            if not clean['action']:raise ValueError('تصمیم نهایی خود را انتخاب کنید.')
            required=['clarity','age_fit'] if g.user['role']=='psychologist' else ['relevance','clarity','age_fit']
            if clean['action']!='outside' and (not clean['key_verdict'] or not clean['confidence'] or any(clean['ratings'][key] is None for key in required)):raise ValueError('برای ثبت نهایی، معیارهای فرم کوتاه، وضعیت کلید و میزان اطمینان را مشخص کنید؛ یا خارج از تخصص را انتخاب کنید.')
            if (clean['action'] in ('major','reject','outside') or clean['key_verdict'] in ('wrong','ambiguous')) and len(clean['notes'])<8:raise ValueError('دلیل تصمیم یا مشکل کلید را دست‌کم در یک جمله بنویسید.')
    else:
        clean={'verdict':text(p.get('verdict',''),30),'answer':text(p.get('answer','')),'evidence':text(p.get('evidence','')),'confidence':text(p.get('confidence',''),20)}
        if clean['verdict'] not in ('','agree','revise','disagree','outside'):raise ValueError('نظر انتخاب‌شده معتبر نیست.')
        if clean['confidence'] not in ('','low','medium','high'):raise ValueError('اطمینان نامعتبر است.')
        if status=='submitted' and (not clean['verdict'] or len(clean['answer'])<8):raise ValueError('نظر و توضیح کوتاه خود را وارد کنید؛ اگر خارج از تخصص است همان را توضیح دهید.')
        if kind=='parent_question' and g.user['role'] not in ('psychologist','psychometrician'):raise ValueError('این پرسش برای نظر روان‌شناس کودک یا روان‌سنج تعریف شده است.')
        if kind=='report_review':
            if g.user['role'] not in ('psychologist','psychometrician'):raise ValueError('داوری کارنامه برای روان‌شناس و روان‌سنج است.')
            scores=p.get('ratings',{})
            if not isinstance(scores,dict):raise ValueError('امتیازهای کارنامه معتبر نیستند.')
            clean['ratings']={}
            for key in ('clarity','interpretability','parent_usefulness','caution','context_balance'):
                value=scores.get(key)
                if value not in (None,'',1,2,3,4,5,'1','2','3','4','5'):raise ValueError('امتیاز هر معیار باید از ۱ تا ۵ باشد یا نامشخص بماند.')
                clean['ratings'][key]=int(value) if value not in (None,'') else None
            if status=='submitted' and clean['verdict']!='outside' and any(v is None for v in clean['ratings'].values()):raise ValueError('برای ثبت نهایی، هر پنج معیار را امتیاز دهید؛ اگر شواهد کافی نیست، امتیاز ۱ یا ۲ و دلیل را ثبت کنید.')
            if status=='submitted' and (not clean['verdict'] or len(clean['answer'])<8):raise ValueError('برای ثبت نهایی، نظر و توضیح کوتاه لازم است.')
            if status=='submitted' and clean['verdict'] in ('revise','disagree') and len(clean['evidence'])<8:raise ValueError('برای پیشنهاد اصلاح، دلیل یا نمونهٔ دقیق بنویسید.')
        if kind=='decision' and g.user['role']!='lead':
            d=next(d for d in DECISIONS if d['id']==target)
            if g.user['role'] not in d['role']:raise ValueError('این موضوع برای تخصص دیگری تعریف شده است.')
    return clean

@app.put('/api/reviews/<kind>/<target>')
@auth()
def save_review(kind,target):
    if g.user['role']=='lead':return fail('تحلیل‌گر از بخش جمع‌بندی تصمیم می‌گیرد؛ نظر متخصص را به نام خود ثبت نمی‌کند.',403)
    p=request.get_json(); version=target_version(kind,target)
    if p.get('target_version')!=version:return fail('نسخهٔ سؤال تغییر کرده؛ صفحه را تازه کنید.',409)
    status=p.get('status','draft')
    if status not in ('draft','submitted'):return fail('وضعیت نامعتبر است.')
    payload=validate_review(kind,target,p.get('payload',{}),status)
    rev=p.get('revision',0)
    if type(rev) is not int or rev<0:return fail('نسخهٔ فرم نامعتبر است.')
    conn=db(); conn.execute('BEGIN IMMEDIATE')
    row=conn.execute('SELECT * FROM reviews WHERE user_id=? AND kind=? AND target=? AND target_version=?',(g.user['id'],kind,target,version)).fetchone()
    if (row and row['revision']!=rev) or (not row and rev!=0):conn.rollback();return fail('این فرم در پنجرهٔ دیگری تغییر کرده است. صفحه را تازه کنید؛ متن فعلی را پیش از آن کپی کنید.',409)
    encoded=json.dumps(payload,ensure_ascii=False)
    if row:
        rid=row['id'];conn.execute('UPDATE reviews SET payload=?,status=?,revision=?,updated=? WHERE id=?',(encoded,status,rev+1,now(),rid))
    else:
        rid=conn.execute('INSERT INTO reviews(user_id,kind,target,target_version,payload,status,revision,updated) VALUES(?,?,?,?,?,?,?,?)',(g.user['id'],kind,target,version,encoded,status,rev+1,now())).lastrowid
    conn.execute('INSERT INTO review_history(review_id,revision,payload,status,created) VALUES(?,?,?,?,?)',(rid,rev+1,encoded,status,now()))
    audit(g.user['id'],'review_saved',{'kind':kind,'target':target,'status':status});conn.commit()
    return jsonify(ok=True,review={'kind':kind,'target':target,'target_version':version,'payload':payload,'status':status,'revision':rev+1,'updated':now()})

@app.get('/api/admin')
@auth(lead=True)
def admin():return jsonify(aggregate())

@app.get('/api/admin/selection-engine')
@auth(lead=True)
def admin_selection_engine():
    return send_file(ROOT/'adaptive_selection.py',as_attachment=True,download_name='didban-adaptive-selection.py',mimetype='text/x-python')

@app.get('/api/admin/question-bank')
@auth(lead=True)
def admin_question_bank():
    export=ROOT/'question_bank_phase2.json'
    if not export.is_file():return fail('فایل بانک نسخهٔ تحویل پیدا نشد؛ آن را از مشخصات فاز دوم بسازید.',404)
    return send_file(export,as_attachment=True,download_name='didban-question-bank-phase2.json',mimetype='application/json')

def aggregate():
    users=[dict(r) for r in db().execute("SELECT id,username,name,role,active,created,is_test FROM users WHERE role!='lead'")]
    all_rows=[{**dict(r),'payload':json.loads(r['payload'])} for r in db().execute('SELECT r.*,u.name,u.role,u.is_test FROM reviews r JOIN users u ON r.user_id=u.id ORDER BY r.updated DESC')]
    rows=[r for r in all_rows if not r['is_test']]
    by=defaultdict(list)
    for r in rows:
        if r['status']=='submitted' and r['target_version']==target_version(r['kind'],r['target']):by[(r['kind'],r['target'])].append(r)
    summaries=[]
    for item in BANK['items']:
        reviews=by[('item',item['id'])]
        in_scope=[r for r in reviews if r['payload'].get('action')!='outside']
        scores=[r['payload']['ratings'].get('relevance') for r in in_scope]
        scores=[s for s in scores if s is not None]
        actions=Counter(r['payload'].get('action') for r in in_scope)
        critical=any(r['payload'].get('key_verdict') in ('wrong','ambiguous') or r['payload'].get('action') in ('major','reject') for r in in_scope)
        disputed=len(actions)>1
        # These are workflow flags, never scientific acceptance or validated thresholds.
        priority='critical' if critical else 'disagreement' if disputed else 'reviewed' if in_scope else 'unreviewed'
        summaries.append({'id':item['id'],'n':len(in_scope),'outside_n':len(reviews)-len(in_scope),'priority':priority,'actions':dict(actions),'relevance_n':len(scores),'relevance_agree':sum(s>=3 for s in scores),'i_cvi':round(sum(s>=3 for s in scores)/len(scores),3) if scores else None})
    decisions=[]
    for kind,entries in [('decision',DECISIONS),('case',CASES),('parent_question',PARENT_QUESTIONS),('report_review',[REPORT_REVIEW])]:
        for x in entries:
            rs=by[(kind,x['id'])]; vals=Counter(r['payload'].get('verdict') for r in rs if r['payload'].get('verdict')!='outside')
            decisions.append({'kind':kind,'id':x['id'],'title':x['title'],'n':sum(vals.values()),'verdicts':dict(vals),'needs_attention':len(vals)>1 or bool(vals.get('disagree') or vals.get('revise'))})
    return {'users':users,'reviews':rows,'test_reviews':[r for r in all_rows if r['is_test']],'analysis_log':[dict(r) for r in db().execute('SELECT * FROM analysis_log ORDER BY id DESC')],'phase_one':plan(BANK,DECISIONS,CASES),'items':summaries,'decisions':decisions,'parent_questions':PARENT_QUESTIONS,'resolutions':[dict(r) for r in db().execute('SELECT * FROM resolutions')],'invites':[dict(r) for r in db().execute('SELECT id,label,role,expires,used_by,created FROM invites ORDER BY created DESC')], 'stats':{'submitted':sum(r['status']=='submitted' for r in rows),'draft':sum(r['status']=='draft' for r in rows),'reviewed_items':sum(i['n']>0 for i in summaries),'critical':sum(i['priority']=='critical' for i in summaries),'disagreements':sum(i['priority']=='disagreement' for i in summaries)},'network_urls':app.config.get('NETWORK_URLS',[])}

@app.post('/api/admin/analysis')
@auth(lead=True)
def save_analysis():
    p=request.get_json()
    values=[text(p.get(k,'')) for k in ('hypothesis','evidence','outcome','next_action')]
    if any(len(v)<8 for v in (values[0],values[3])):return fail('فرض اولیه و اقدام بعدی را در یک جمله بنویسید.')
    if values[2] not in ('supported','contradicted','inconclusive'):return fail('وضعیت بررسی فرض را انتخاب کنید.')
    if values[2]!='inconclusive' and len(values[1])<8:return fail('شاهد و شناسهٔ نظر پشتیبان را بنویسید.')
    db().execute('INSERT INTO analysis_log(hypothesis,evidence,outcome,next_action,reviewer_id,created) VALUES(?,?,?,?,?,?)',(*values,g.user['id'],now()))
    audit(g.user['id'],'analysis_recorded',{'outcome':values[2]});db().commit()
    return jsonify(ok=True)

@app.get('/api/internal/report')
def internal_report():
    if not bridge_authorized('didban-report-v1'):
        return fail('دسترسی مجاز نیست.',403)
    return jsonify(project_report())

@app.post('/api/internal/provision')
def internal_provision():
    passwords=request.get_json()
    if not isinstance(passwords,dict) or set(passwords)!={'admin','test','monir.sadat'}:
        return fail('نام سه حساب معتبر نیست.')
    if any(not isinstance(value,str) or not 8<=len(value)<=128 for value in passwords.values()):
        return fail('رمز هر حساب باید بین ۸ تا ۱۲۸ نویسه باشد.')
    from provision_users import provision
    created=provision(passwords['monir.sadat'],passwords)
    audit(None,'accounts_provisioned',{'created':created,'usernames':list(passwords)})
    db().commit()
    return jsonify(ok=True,created=created)

def project_report():
    data=aggregate()
    data.update(format='it-project-expert-review',format_version=1,exported_at=datetime.now(timezone.utc).isoformat(),not_child_data=True)
    data['bank_version']=BANK['version']
    data['bank']=BANK
    data['decisions_catalog']=DECISIONS+[REPORT_REVIEW];data['cases_catalog']=CASES
    data['history']=[{**dict(r),'payload':json.loads(r['payload'])} for r in db().execute('SELECT h.*,r.user_id,r.kind,r.target,r.target_version FROM review_history h JOIN reviews r ON r.id=h.review_id ORDER BY h.id')]
    data['activity']=[{**dict(r),'details':json.loads(r['details'])} for r in db().execute('SELECT * FROM audit ORDER BY id DESC')]
    data['resolution_history']=[dict(r) for r in db().execute('SELECT * FROM resolution_history ORDER BY id DESC')]
    data.pop('network_urls',None)
    return data

@app.post('/api/admin/invites')
@auth(lead=True)
def create_invite():
    p=request.get_json(); role=p.get('role'); label=text(p.get('label',''),100)
    if role not in ('psychometrician','psychologist','content'):return fail('نقش معتبر انتخاب کنید.')
    if not label:return fail('برای دعوت‌نامه یک نام بنویسید.')
    token=secrets.token_urlsafe(32)
    db().execute('INSERT INTO invites(token_hash,label,role,expires,created) VALUES(?,?,?,?,?)',(digest(token),label,role,now()+30*86400,now()))
    audit(g.user['id'],'invite_created',{'role':role,'label':label});db().commit()
    return jsonify(ok=True,path='/#invite='+token)

@app.post('/api/admin/resolution')
@auth(lead=True)
def resolution():
    p=request.get_json(); kind=p.get('kind'); target=p.get('target'); version=target_version(kind,target)
    decision=text(p.get('decision',''),40); reason=text(p.get('reason',''))
    if decision not in ('needs_revision','needs_evidence','ready_for_pilot_review','hold'):return fail('تصمیم معتبر انتخاب کنید.')
    if len(reason)<8:return fail('دلیل تصمیم را در یک جمله بنویسید.')
    db().execute('INSERT INTO resolutions(kind,target,target_version,decision,reason,reviewer_id,updated) VALUES(?,?,?,?,?,?,?) ON CONFLICT(kind,target,target_version) DO UPDATE SET decision=excluded.decision,reason=excluded.reason,reviewer_id=excluded.reviewer_id,updated=excluded.updated',(kind,target,version,decision,reason,g.user['id'],now()))
    db().execute('INSERT INTO resolution_history(kind,target,target_version,decision,reason,reviewer_id,updated) VALUES(?,?,?,?,?,?,?)',(kind,target,version,decision,reason,g.user['id'],now()))
    audit(g.user['id'],'resolution',{'kind':kind,'target':target,'decision':decision});db().commit();return jsonify(ok=True)

def export_data(mine=False):
    data={'format':'it-project-expert-review','format_version':1,'exported_at':datetime.now(timezone.utc).isoformat(),'bank_version':BANK['version'],'scope':'my_reviews' if mine else 'project','not_child_data':True}
    if mine:
        data['reviewer']=user_public(g.user)
        data['reviews']=[{**dict(r),'payload':json.loads(r['payload'])} for r in db().execute('SELECT kind,target,target_version,payload,status,revision,updated FROM reviews WHERE user_id=?',(g.user['id'],))]
    else:
        data.update(project_report());data.pop('network_urls',None)
        data['bank']=BANK;data['decisions_catalog']=DECISIONS;data['cases_catalog']=CASES
    return data

@app.get('/api/export')
@auth()
def export():
    data=export_data(mine=g.user['role']!='lead')
    fmt=request.args.get('format','json')
    if fmt=='json':
        raw=json.dumps(data,ensure_ascii=False,indent=2).encode('utf-8')
        return send_file(io.BytesIO(raw),mimetype='application/json',as_attachment=True,download_name='project-analysis.json' if g.user['role']=='lead' else 'my-expert-reviews.json')
    if fmt=='csv':
        out=io.StringIO(newline='');w=csv.writer(out)
        w.writerow(['reviewer','role','kind','target','status','revision','updated_utc','payload_json'])
        for r in data['reviews']:
            vals=[r.get('name',g.user['name']),r.get('role',g.user['role']),r['kind'],r['target'],r['status'],r['revision'],datetime.fromtimestamp(r['updated'],timezone.utc).isoformat(),json.dumps(r['payload'],ensure_ascii=False)]
            w.writerow(["'"+x if isinstance(x,str) and x.startswith(('=','+','-','@','\t','\r')) else x for x in vals])
        return send_file(io.BytesIO(out.getvalue().encode('utf-8-sig')),mimetype='text/csv',as_attachment=True,download_name='expert-reviews.csv')
    return fail('نوع خروجی معتبر نیست.')

@app.get('/api/admin/backup')
@auth(lead=True)
def backup():
    # SQLite backup API makes a coherent snapshot, including committed WAL records.
    path=DATA/'backups';path.mkdir(exist_ok=True)
    stamp=datetime.now().strftime('%Y%m%d-%H%M%S')+'-'+secrets.token_hex(3)
    target=path/f'workbench-{stamp}.sqlite3'
    dest=sqlite3.connect(target);db().backup(dest);dest.close()
    memory=io.BytesIO()
    with zipfile.ZipFile(memory,'w',zipfile.ZIP_DEFLATED) as z:
        z.write(target,'workbench.sqlite3');z.writestr('bank.json',json.dumps(BANK,ensure_ascii=False));z.writestr('analysis.json',json.dumps(export_data(),ensure_ascii=False))
        z.writestr('RESTORE.txt','Private backup: includes expert accounts and password hashes. Stop server; replace data/workbench.sqlite3 and bank.json from this archive. Remove stale -wal/-shm only while server is stopped. Restart. Keep original first. See README.md.\n')
    memory.seek(0);return send_file(memory,mimetype='application/zip',as_attachment=True,download_name=f'project-backup-{stamp}.zip')

def addresses():
    try:return sorted({x[4][0] for x in socket.getaddrinfo(socket.gethostname(),None,socket.AF_INET) if not x[4][0].startswith('127.')})
    except OSError:return []

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--host',default='0.0.0.0');parser.add_argument('--port',type=int,default=8877);args=parser.parse_args()
    initialize(); ips=addresses()
    app.config['ALLOWED_HOSTS']={'localhost','127.0.0.1',*ips}
    app.config['NETWORK_URLS']=[f'http://{ip}:{args.port}' for ip in ips] if args.host=='0.0.0.0' else []
    token=secrets.token_urlsafe(32)
    with app.app_context():
        db().execute("INSERT INTO meta(key,value) VALUES('local_token',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",(digest(token),));db().commit()
    link=f'http://127.0.0.1:{args.port}/#local={token}'
    (DATA/'OPEN_LOCAL.url').write_text('[InternetShortcut]\nURL='+link+'\n',encoding='utf-8')
    (DATA/'server-info.json').write_text(json.dumps({'local_url':f'http://127.0.0.1:{args.port}','local_entry':link,'network_urls':app.config['NETWORK_URLS'],'pid':os.getpid()},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Project workbench running on http://127.0.0.1:{args.port}',flush=True)
    from waitress import serve
    serve(app,host=args.host,port=args.port,threads=8,clear_untrusted_proxy_headers=True)

if __name__=='__main__':main()
