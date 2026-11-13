"""Provision requested accounts locally. Never commit credentials or databases."""
import argparse, json, secrets
from app import initialize, app, db, now, DATA
from werkzeug.security import generate_password_hash

def provision(psychologist_password, supplied_passwords=None):
    initialize()
    accounts=[('admin','مدیر پروژه','lead',secrets.token_urlsafe(18)),
              ('test','کاربر آزمایشی','psychologist',secrets.token_urlsafe(18)),
              ('monir.sadat','منیرسادات سیدکریمی','psychologist',psychologist_password)]
    created=[]
    supplied_passwords=supplied_passwords or {}
    with app.app_context():
        for username,name,role,password in accounts:
            password=supplied_passwords.get(username,password)
            if not isinstance(password,str) or not 8<=len(password)<=128:
                raise ValueError('Every password must contain 8 to 128 characters.')
            if db().execute('SELECT id FROM users WHERE username=?',(username,)).fetchone(): continue
            db().execute('INSERT INTO users(username,name,role,password_hash,created,is_test) VALUES(?,?,?,?,?,?)',
                         (username,name,role,generate_password_hash(password),now(),int(username=='test')))
            created.append({'username':username,'name':name,'role':role,'password':password})
        db().commit()
    if created:
        path=DATA/'REQUESTED_ACCOUNTS.json'
        existing=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
        path.write_text(json.dumps(existing+created,ensure_ascii=False,indent=2),encoding='utf-8')
    return len(created)

if __name__=='__main__':
    import getpass
    parser=argparse.ArgumentParser();parser.parse_args()
    count=provision(getpass.getpass('Psychologist password: '))
    print(f'{count} accounts created. Private credentials are in the data directory.')
