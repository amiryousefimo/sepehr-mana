'use strict';
const titles={
 'P-00':'جست‌وجو و انتخاب فرد','P-01':'نمای کلی پروفایل بیمه‌ای','P-02':'تاریخچه عضویت و پوشش','P-03':'حق‌بیمه و سوابق پرداخت','P-04':'خدمات و مزایای دریافت‌شده','P-05':'حقوق بیمه‌ای و مستمری','P-06':'تصویر مالی و مفاهیم فردی','P-07':'شبیه‌سازی و مقایسه سناریو','P-08':'اسناد، مغایرت و کیفیت اطلاعات',
 'G-00':'نمای کلان مدیریتی','G-01':'تراز منابع و مصارف و ریشه‌یابی کسری','G-02':'نقدینگی و جریان وجوه','G-03':'عملکرد مالی و پایداری طرح‌ها','G-04':'تحلیل جغرافیایی استان‌ها و شعب','G-05':'حق‌بیمه، وصول و شکاف منابع','G-06':'هزینه درمان و عوامل رشد','G-07':'مستمری، جمعیت و تعهدات','G-08':'مطالبات و تعهدات دولت','G-09':'بودجه، عملکرد و پیش‌بینی','G-10':'شرکت‌ها و سرمایه‌گذاری','G-11':'ریسک، پیش‌بینی و سناریو','G-12':'کیفیت داده و تطبیق مالی'
};
const descriptions={
 'P-00':'یک پروندهٔ نمونه را با شناسهٔ نمایشی انتخاب کنید. جست‌وجو و بازکردن پرونده ثبت می‌شوند.',
 'P-01':'وضعیت کنونی، پوشش، پرداخت‌ها و حمایت‌های ثبت‌شده تا تاریخ مبنا.',
 'P-02':'خط زمانی طرح‌های بیمه‌ای، هم‌پوشانی، وقفه و مسیر ورود به تراکنش‌های هر دوره.',
 'P-03':'از دستمزد مشمول تا تشخیص، مطالبه، وصول و تفکیک پرداخت‌کنندگان.',
 'P-04':'هزینه کل و سهم واقعی صندوق، فرد و دیگر پرداخت‌کنندگان؛ همراه با مرجع هر خدمت.',
 'P-05':'تفاوت حقوق جاری، برآورد مشروط، ارزش حقوق اکتسابی و تعهد آینده.',
 'P-06':'تفکیک مبلغ اسمی، ارزش فرضی و اندوختهٔ واقعی در مدل تأمین مالی.',
 'P-07':'آزمون تغییر پارامتر در محیط آزمایشی؛ سابقه و قواعد جاری تغییر نمی‌کنند.',
 'P-08':'مرجع داده، موارد نیازمند بررسی، سند نمایشی و پیگیری اصلاح.',
 'G-00':'تصویر سازمان از منابع و مصارف، بودجه، نقدینگی و هشدارهای قابل پیگیری.',
 'G-01':'پل تراز، تغییر نسبت به دورهٔ مشابه و مسیر تا سرفصل و منبع رقم.',
 'G-02':'ماندهٔ آغاز و پایان، تاریخ وصول، سررسیدها و دامنهٔ پیش‌بینی آزمایشی.',
 'G-03':'مقایسهٔ طرح‌ها، جمعیت و کیفیت انتساب اقلام در دامنهٔ گزارش.',
 'G-04':'نقشهٔ شاخص منتخب و ریز شعب با امکان مقایسه و ردیابی سرفصل.',
 'G-05':'قیف حق‌بیمه، تحلیل کارگاه، دلیل ثبت‌شده و تأخیر وصول.',
 'G-06':'هزینه و استفاده از درمان و تجزیه اثر قیمت متوسط، حجم و ترکیب.',
 'G-07':'جمعیت آخر دوره، جریان ورود و خروج، پرداخت مستمری و تعهدات برآوردی.',
 'G-08':'زنجیره محاسبه، تأیید، مطالبه، وصول و مدارک هر مطالبهٔ نمونه.',
 'G-09':'تطبیق در دانه ماه، حساب، طرح، منطقه و نسخه بودجه.',
 'G-10':'جریان وجوه سازمان، سود عملیاتی، بازده، هزینه فرصت و مأموریت اجتماعی.',
 'G-11':'سناریوهای نسخه‌دار، حساسیت، توزیع اثر و پیش‌بینی ماندهٔ نقد.',
 'G-12':'کیفیت منبع، اختلاف دفتر، انتساب و ردیابی محاسبات.'
};
const F={
 'P-01':'from to plan','P-02':'from to plan history status party province city branch overlap','P-03':'from to plan history party status payer corrected grain dateBasis',
 'P-04':'from to plan province status kind service party dateBasis','P-05':'to rule rightStatus','P-06':'to rule valuation','P-07':'to scenario','P-08':'from to source type status',
 'G-00':'from to basis plan province','G-01':'from to basis plan province branch account direction attribution source','G-02':'from to bank scenario','G-03':'from to plan group province attribution direction',
 'G-04':'from to province city branch plan group indicator','G-05':'from to plan province city branch party sector status cause aging','G-06':'from to plan province city branch party service diagnosis age',
 'G-07':'from to plan province age gender cohort service','G-08':'from to plan province branch party status','G-09':'from to version plan province account direction',
 'G-10':'from to party sector relation status','G-11':'to plan scenario horizon','G-12':'from to source type status attribution account plan'
};
const columns={
 k:['PeriodKey','ماه'],p:['PlanKey','طرح','plan'],g:['RegionKey','شعبه','region'],a:['PartyKey','طرف/مرکز','party'],
 s:['SourceKey','سامانه مبدأ','source'],r:['SourceRef','مرجع ثبت'],status:['Status','وضعیت'],
 account:['Account','سرفصل'],type:['Type','نوع کنترل'],detail:['Detail','شرح'],state:['State','وضعیت رسیدگی'],
 in:['Inflow','ورودی','money'],out:['Outflow','خروجی','money'],close:['Closing','مانده پایان','money'],
 source:['Sources','منابع','money'],use:['Uses','مصارف','money'],balance:['Balance','تراز','money'],
 claimed:['Claimed','مطالبه','money'],collected:['Collected','وصول','money'],debt:['Debt','مانده','money'],
 med:['Fund','سهم صندوق','money'],cost:['Total','هزینه کل','money'],visits:['Volume','تعداد'],
 ticket:['TicketKey','کد پیگیری'],category:['Category','نوع درخواست'],created:['Created','تاریخ ثبت','date']
};
const C=(key,title,kind)=>[key,title,kind];
const V=(t,v,kind='money',subtitle='',link='')=>({t,v,kind,subtitle,link});
const X=(name,key)=>({name,key});
const emptyNote='در دامنهٔ انتخاب‌شده رکورد قابل نمایش وجود ندارد.';
const last=(rows,column='PeriodKey')=>rows.reduce((m,r)=>Math.max(m,r[column]||0),0);
const sum=(rows,col)=>rows.length?rows.reduce((n,r)=>n+(r[col]||0),0):null;
const diff=(a,b)=>a===null&&b===null?null:(a||0)-(b||0);
const ratio=(a,b)=>b&&a!==null?a/b:null;
const grouped=(rows,by,map)=>Array.from(Map.groupBy?Map.groupBy(rows,by):rows.reduce((r,x)=>{const k=by(x);if(!r.has(k))r.set(k,[]);r.get(k).push(x);return r},new Map()),([k,r])=>map(k,r));
const isPension=r=>r.Kind==='مستمری';
const isHealth=r=>r.Kind==='درمان';
const isCash=r=>r.Kind==='مزایای نقدی';
const mp=(rows,k)=>sum(rows,k);
function bundle(cards=[],panels=[],tables=[],note='',extra=''){return {cards,panels,tables,note,extra}}
function tab(t,rows,cols,opts={}){return {t,rows,cols,opts}}
function cashSummary(r){const end=last(r);return {opening:sum(r.filter(x=>x.PeriodKey===Math.min(...r.map(x=>x.PeriodKey))),'Opening'),closing:sum(r.filter(x=>x.PeriodKey===end),'Closing'),floor:sum(r.filter(x=>x.PeriodKey===end),'Floor'),inflow:sum(r,'Inflow'),outflow:sum(r,'Outflow')}}
function fin(r){
 const col=filters.basis==='نقدی'?'CashValue':'BookValue';
 const a=sum(r.filter(x=>x.Direction==='منبع'),col),b=sum(r.filter(x=>x.Direction==='مصرف'),col);
 return {Sources:a,Uses:b,Balance:diff(a,b)};
}
function premium(r){ const c=sum(r,'Claimed'),v=sum(r,'Collected');return {Wage:sum(r,'Wage'),Expected:sum(r,'Expected'),Assessed:sum(r,'Assessed'),Claimed:c,Collected:v,Debt:diff(c,v),Rate:ratio(v,c)} }
function pop(r,byPlan=null){
 const k=last(r),q=r.filter(x=>x.PeriodKey===k&&x.PlanKey===(byPlan??0));
 const a=sum(q.filter(x=>x.GroupStatus==='بیمه‌پرداز'),'Persons'), b=sum(q.filter(x=>['بازنشستگی','ازکارافتادگی','بازماندگی'].includes(x.GroupStatus)),'Persons');
 return {k,Insured:a,Retired:b,Support:ratio(a,b)};
}
function byMonth(r,fn){return grouped(r,x=>x.PeriodKey,(PeriodKey,rr)=>({PeriodKey,...fn(rr)})).sort((a,b)=>a.PeriodKey-b.PeriodKey)}
function byKey(r,key,fn){return grouped(r,x=>x[key],(v,rr)=>({[key]:v,...fn(rr)}))}
function cols(keys){return keys.map(k=>columns[k])}
const balt=[...cols(['source','use','balance'])];
const trace={trace:true};
function coverage(m){
 const lo=periods[filters.from]?.StartDate||periods[140201].StartDate,end=periods[filters.to]?.EndDate||periods[meta.asOf].EndDate;
 const l=new Date(lo+'T00:00:00Z').getTime(),z=new Date(end+'T00:00:00Z').getTime(),day=86400000;
 const dates=new Map(),part={};
 m.forEach(r=>{
   const start=Math.max(l,Date.parse(r.StartDate)),finish=Math.min(z,Date.parse(r.EndDate||end));
   for(let d=start;d<=finish;d+=day){if(!dates.has(d))dates.set(d,new Set());dates.get(d).add(r.PlanKey);part[r.PlanKey]=(part[r.PlanKey]||0)+1}
 });
 const ds=[...dates.keys()].sort((a,b)=>a-b);
 const all=ds.length,overlap=[...dates.values()].filter(s=>s.size>1).length;
 const gap=all?Math.round((ds.at(-1)-ds[0])/day)+1-all:null;
 const spans=Object.entries(part).map(([PlanKey,Days])=>({PlanKey:+PlanKey,Days,Share:ratio(Days,all)}));
 return {all,overlap,gap,spans};
}
function pview(id){
 const p=profile.person[0],m=filterRows(profile.membership,'membership'),pr=filterRows(profile.premium,'premium'),be=filterRows(profile.benefit,'benefit');
 const rr=filterRows(profile.rights,'rights'), rt=[...rr].sort((a,b)=>b.PeriodKey-a.PeriodKey)[0];
 const cv=coverage(m),pm=premium(pr),health=be.filter(isHealth),pension=be.filter(isPension),other=be.filter(isCash);
 const historyCol=C('HistoryTypeCode','نوع سابقه بیمه','history');
 const mbcols=[C('StartDate','آغاز','date'),C('EndDate','پایان','openDate'),...cols(['p','a','g']),historyCol,C('Coverage','نوع پوشش'),columns.status,C('Reason','علت خاتمه'),columns.r];
 const qcols=[...cols(['k','s','r','type']),C('Severity','شدت'),...cols(['state','detail'])];
 const tp=tab('ریز پوشش',m,mbcols,{trace:true,periodLink:true});
 const rtcols=[columns.k,C('RightStatus','وضعیت حق'),C('RuleKey','نسخه','rule'),C('ModelType','الگوی تأمین مالی'),C('WageBase','مزد مرجع','money'),C('CreditedMonths','ماه مؤثر'),C('CurrentAmount','جاری','money'),C('EstimatedAmount','مشروط','money'),C('AcquiredPV','حقوق اکتسابی','money'),C('FuturePV','تعهد آتی','money'),columns.r];
 const rtTable=tab('سوابق برآورد و نسخه محاسبه',rr,rtcols,trace);
 const rh=[V('مستمری جاری',rt?.CurrentAmount??null,'money','ثبت نمونه'),V('مستمری مشروط',rt?.EstimatedAmount??null,'money','برآورد آزمایشی','P-05'),V('حقوق اکتسابی',rt?.AcquiredPV??null,'money','ارزش فعلی آزمایشی'),V('تعهد آتی',rt?.FuturePV??null,'money','ارزش فعلی آزمایشی')];
 const prtrend=periodAgg(pr,premium);
 const benTrend=periodAgg(be,q=>({Fund:sum(q,'Fund'),Total:sum(q,'Total')}));
 if(id==='P-01')return bundle(
  [V('وضعیت پرونده',p.Status,'text',p.CaseCode,'P-05'),V('روز پوشش یکتا',cv.all,'num','بدون دوباره‌شماری','P-02'),V('پرداخت تجمعی',pm.Collected,'money','مبلغ اسمی','P-03'),V('مزایای سهم صندوق',sum(be,'Fund'),'money','درمان + نقدی + مستمری','P-04')],
  [chart('مسیر کوتاه پوشش',m,'','timeline'),chart('پرداخت و استفاده از مزایا',mergeMonths(prtrend,benTrend),'PeriodKey','line',[X('حق‌بیمه وصول‌شده','Collected'),X('سهم صندوق','Fund')])],[tp],
  'وضعیت پرونده آخرین ثبت پرونده است. پرداخت‌ها و مزایا دو جریان مستقل‌اند و تفاضل آنها تراز شخصی نیست.',
  pane('مشخصات و وضعیت حقوقی',mini([['شناسه',p.CaseCode],['شعبه',dim('region',p.RegionKey)],['پوشش‌های فعال',m.filter(x=>!x.EndDate).map(x=>dim('plan',x.PlanKey)).join('، ')||'خارج از پوشش جاری'],['وضعیت حق',rt?.RightStatus||'داده ثبت‌نشده']])+links(['P-02','P-03','P-04','P-05'])));
 if(id==='P-02')return bundle([V('روز یکتای پوشش',cv.all,'num'),V('طرح متمایز',cv.spans.length,'num'),V('روز وقفه میان دوره‌ها',cv.gap,'num'),V('روز هم‌پوشانی',cv.overlap,'num')],[
  chart('خط زمانی عضویت؛ برای ریز هر دوره انتخاب کنید',m,'','timeline'),chart('روز پوشش به تفکیک طرح',cv.spans,'PlanKey','bar',[X('روز پوشش','Days')],{label:'plan',unit:'num'})
 ],[tp,tab('چگالی زمانی حضور',cv.spans,[columns.p,C('Days','روز در طرح'),C('Share','نسبت به روزهای یکتا','pct')])],
 'روز هم‌پوشان در کل سابقه یک بار و در هر طرح مربوط یک بار حساب می‌شود؛ جمع درصد طرح‌ها ممکن است بیش از ۱۰۰٪ باشد. این نسبت قاعده تخصیص مستمری نیست.');
 if(id==='P-03'){
  const shares=[['سهم فرد','MemberShare'],['سهم کارفرما','EmployerShare'],['سهم دولت','StateShare'],['سایر','OtherShare']].filter(([,k])=>!filters.payer||filters.payer===k).map(([label,k])=>({label,value:sum(pr,k)}));
  const listed=pr.map(x=>({...x,Debt:x.Claimed-x.Collected}));
  const c=[...cols(['k','p','a']),historyCol,C('Wage','مزد مشمول','money'),C('Expected','انتظار','money'),C('Assessed','تشخیص','money'),...cols(['claimed','collected','debt']),C('MemberShare','فرد','money'),C('EmployerShare','کارفرما','money'),C('StateShare','دولت','money'),C('OtherShare','سایر','money'),C('Recorded','ثبت','date'),C('Paid','وصول','date'),C('Corrected','اصلاح','bool'),...cols(['status','r'])];
  return bundle([V('تشخیص‌شده',pm.Assessed),V('مطالبه‌شده',pm.Claimed),V('وصول‌شده',pm.Collected),V('مانده قابل پیگیری',pm.Debt,'money','مطالبه منهای وصول')],
   [chart('روند تشخیص، مطالبه و وصول',prtrend,'PeriodKey','line',[X('تشخیص','Assessed'),X('مطالبه','Claimed'),X('وصول','Collected')]),chart('ترکیب سهم‌ها از مبلغ وصولی',shares,'label','bar',[X('سهم پرداخت‌کننده','value')]),chart('روند مزد مشمول',prtrend,'PeriodKey','line',[X('مزد مشمول','Wage')])],
   [tab('دفتر ثبت و وصول حق‌بیمه',listed,c,trace),tab('موارد دیرثبت، اصلاح و مانده باز',listed.filter(x=>x.Corrected||!x.Paid||x.Paid>x.Due||x.Debt),[...cols(['k','r','debt','status']),C('Cause','دلیل نمونه'),C('Due','سررسید','date')],trace)],
   'انتساب به ماه تعلق است، مگر اینکه فیلتر تاریخ وصول یا ثبت را انتخاب کنید. انتخاب پرداخت‌کننده فقط ترکیب را محدود می‌کند.');
 }
 if(id==='P-04')return bundle([V('هزینه کل درمان',sum(health,'Total')),V('سهم صندوق از درمان',sum(health,'Fund')),V('مستمری',sum(pension,'Fund')),V('سایر مزایای نقدی',sum(other,'Fund'))],
  [chart('روند هزینه و سهم صندوق',benTrend,'PeriodKey','line',[X('هزینه کل','Total'),X('سهم صندوق','Fund')]),chart('ترکیب خدمت و سهم پرداخت‌کنندگان',byKey(be,'Service',q=>({Fund:sum(q,'Fund'),MemberShare:sum(q,'MemberShare'),OtherShare:sum(q,'OtherShare')})),'Service','bar',[X('صندوق','Fund'),X('فرد','MemberShare'),X('سایر','OtherShare')],{stack:true})],
  [tab('دفتر خدمت و مزایا',be,[C('Kind','خانواده مزایا'),C('Service','نوع خدمت'),C('EventDate','وقوع/استحقاق','date'),C('Paid','پرداخت','date'),...cols(['a','p','g','cost','med']),C('MemberShare','فرد','money'),C('OtherShare','سایر','money'),C('Attribution','مبنای انتساب'),...cols(['status','r'])],trace)],
  'درمان به پوشش معتبر همان زمان متصل است. هزینه کل با مبلغ پرداخت‌شده توسط صندوق یکسان نیست.');
 if(id==='P-05')return bundle(rh,[chart('مستمری جاری و برآورد در دوره‌های محاسبه',rr,'PeriodKey','line',[X('جاری','CurrentAmount'),X('مشروط','EstimatedAmount')]),pane('شناسنامه آخرین محاسبه',mini([['نسخه','DEMO-1.0'],['مزد مرجع',fmt(rt?.WageBase,'money')],['سابقه مؤثر',fmt(rt?.CreditedMonths,'num')],['مدل','PAYG']])+para(meta.dims.Rule[0].Assumption)+links(['P-02','P-07']))],[rtTable,tp],
  'مقدار آزمایشی، حکم یا احراز استحقاق نیست. طرح‌ها از سابقه واقعی خوانده می‌شوند و هیچ سهم مستمری به طرح فرض نشده است.');
 if(id==='P-06')return bundle([V('پرداخت اسمی تجمعی',pm.Collected),V('دارایی واقعی',rt?.RealAsset??null,'money','خارج از دامنه PAYG'),V('ارزش فرضی محاسباتی',rt?.Hypothetical??null,'money','قابل برداشت نیست'),V('مزایای دریافت‌شده',sum(be,'Fund'))],[
  chart('ترکیب مزایای اسمی سهم صندوق',byKey(be,'Kind',x=>({Fund:sum(x,'Fund')})),'Kind','bar',[X('سهم صندوق','Fund')]),
  pane('معنی و روش ارزش‌گذاری',mini([['اسمی','بدون تعدیل'],['فرضی','۱٫۱۴ × وصول تجمعی نمونه'],['دارایی واقعی','خارج از دامنه PAYG'],['حقوق و تعهد','ارزش فعلی صرفاً آزمایشی']])+links(['P-03','P-04','P-05']))
 ],[tab('ارزش‌ها به تفکیک مبنا',[{Metric:'پرداخت اسمی',Amount:pm.Collected,Range:'سابقه قابل مشاهده'},{Metric:'اندوخته واقعی',Amount:rt?.RealAsset,Range:'خارج از دامنه'},{Metric:'ارزش فرضی',Amount:rt?.Hypothetical,Range:'محاسبه نمایشی'},{Metric:'حقوق اکتسابی',Amount:rt?.AcquiredPV,Range:'نمونه ارزش فعلی'},{Metric:'تعهد آینده',Amount:rt?.FuturePV,Range:'نمونه سناریو'}].filter(x=>!filters.valuation||x.Range===filters.valuation),[C('Metric','مفهوم'),C('Amount','مبلغ','money'),C('Range','مبنا')]),rtTable],
 'این ارقام از یک جنس نیستند؛ با هم جمع نمی‌شوند و موجودی قابل برداشت از آنها به دست نمی‌آید.');
 if(id==='P-07'){
  const sc=scenarioData(), base=rt?.CurrentAmount??rt?.EstimatedAmount??null,v=base===null?null:Math.round(base*(1+sc.PensionRate));
  return bundle([V('مستمری مبنا',base),V('برآورد سناریو',v,'money','آزمایشی'),V('اثر تغییر',diff(v,base)),V('نسخه قاعده','DEMO-1.0','text')],
   [chart('مقایسه مبنا و جایگزین',[{Name:'مبنا',Value:base},{Name:sc.ScenarioName,Value:v}],'Name','bar',[X('مبلغ','Value')]),scenarioForm(true)],[runsTable()],
   'فقط پارامتر تعریف‌شده در نسخه آزمایشی تغییر می‌کند. نتیجه ثبت‌شده برای بازتولید به تاریخ مبنا و شناسه اجرا متصل است.');
 }
 if(id==='P-08'){
  const q=filterRows(profile.quality,'quality');
  return bundle([V('موارد کیفیت',q.length,'num'),V('موارد باز',q.filter(x=>x.State!=='رفع‌شده').length,'num'),V('درخواست‌های پیگیری',profile.tickets.length,'num'),V('آخرین دوره',meta.asOf,'period')],
   [chart('توزیع کنترل‌ها',byKey(q,'Type',r=>({Count:r.length})),'Type','bar',[X('موارد','Count')],{unit:'num'}),followForm(true)],
   [tab('فهرست سند و مورد کیفیت',q,qcols,trace),tab('پیگیری درخواست‌ها',profile.tickets,[columns.ticket,C('Ref','مرجع'),columns.category,columns.state,columns.created,columns.detail],trace)],
   'مرجع‌های قابل مشاهده از سامانه مبدأ ساختگی هستند. پاسخ عملیاتی سازمان در این نمونه متصل نیست.');
 }
 return bundle();
}

function gview(id){
 const f=filterRows(gov.finance,'finance'),cash=filterRows(gov.cash,'cash'),q=filterRows(gov.quality,'quality');
 const pr=filterRows(gov.premium,'premium'),b=filterRows(gov.benefit,'benefit'),claim=filterRows(gov.claim,'claim'),comp=filterRows(gov.company,'company'),bud=filterRows(gov.budget,'budget');
 const bh=b.filter(isHealth),bp=b.filter(isPension),popr=filterRows(gov.population,'population');
 const F=fin(f), lp=pop(popr,filters.plan===''?null:+filters.plan), ct=cashSummary(cash);
 const trend=byMonth(f,fin), account=byKey(f,'Account',fin).sort((a,b)=>Math.abs(b.Balance)-Math.abs(a.Balance));
 const financeCards=[V('کل منابع',F.Sources,'money',filters.basis,'G-01'),V('کل مصارف',F.Uses,'money',filters.basis,'G-01'),V('تراز منابع و مصارف',F.Balance,'money','منابع منهای مصارف','G-01')];
 const budgetData=rows=>({Approved:sum(rows,'Approved'),Revised:sum(rows,'Revised'),Actual:sum(rows,'Actual'),Forecast:sum(rows,'Forecast')});
 const budget=budgetData(bud),news=[];
 const baseline=byMonth(cash,r=>({Closing:sum(r,'Closing'),Floor:sum(r,'Floor'),Inflow:sum(r,'Inflow'),Outflow:sum(r,'Outflow')}));
 const sc=scenarioData();
 const fcrows=gov.forecast.filter(x=>x.ScenarioKey===sc.ScenarioKey&&(!filters.bank||x.Bank===filters.bank)).filter((x,i,a)=>!filters.horizon||x.PeriodKey<=[...new Set(a.map(y=>y.PeriodKey))].sort()[+filters.horizon-1]);
 const fc=byMonth(fcrows,r=>({Forecast:sum(r,'Closing'),Low:sum(r,'Low'),High:sum(r,'High'),Floor:sum(r,'Floor')}));
 const chartsCash=chart('ماندهٔ ثبت‌شده و افق پیش‌بینی',mergeMonths(baseline,fc),'PeriodKey','line',[X('مانده ثبت‌شده','Closing'),X('پیش‌بینی آزمایشی','Forecast'),X('کران پایین','Low'),X('کران بالا','High'),X('آستانه','Floor')],{dateBrush:false});
 const pp=premium(pr);
 const acctTab=tab('تفکیک سرفصل و منشأ تراز',account,[columns.account,...balt],{drill:'Account'});
 if(id==='G-00'){
   const pa=byKey(f,'PlanKey',fin).filter(x=>x.Balance<0).sort((x,y)=>x.Balance-y.Balance);
   if(pa.length)news.push(['G-03','تراز منفی '+dim('plan',pa[0].PlanKey),fmt(pa[0].Balance,'money')]);
   if(fc.some(x=>x.Low<x.Floor))news.push(['G-02','کران پایین پیش‌بینی زیر آستانه',periodLabel(fc.find(x=>x.Low<x.Floor).PeriodKey)]);
   if(ratio(budget.Actual,budget.Approved)<.98||ratio(budget.Actual,budget.Approved)>1.02)news.push(['G-09','انحراف عملکرد نسبت به مصوب',fmt(ratio(budget.Actual,budget.Approved),'pct')]);
   if(q.filter(x=>x.Severity==='بالا'&&x.State!=='رفع‌شده').length)news.push(['G-12','موارد کیفیت با شدت بالا',fmt(q.filter(x=>x.Severity==='بالا'&&x.State!=='رفع‌شده').length,'num')]);
   return bundle([...financeCards,V('مانده نقد پایان',ct.closing,'money','کل حساب‌های بانک','G-02')],[
    chart('روند عملکرد مالی',trend,'PeriodKey','line',[X('منابع','Sources'),X('مصارف','Uses'),X('تراز','Balance')]),
    chart('ترکیب منابع و مصارف',account,'Account','bar',[X('منابع','Sources'),X('مصارف','Uses')]),
    pane('بودجه و نقدینگی',mini([['تحقق کل بودجه',fmt(ratio(budget.Actual,budget.Approved),'pct')],['خالص نقد',fmt(diff(ct.inflow,ct.outflow),'money')],['فاصله تا آستانه',fmt(diff(ct.closing,ct.floor),'money')],['تحقق مصارف',fmt(ratio(sum(bud.filter(x=>x.Direction==='مصرف'),'Actual'),sum(bud.filter(x=>x.Direction==='مصرف'),'Approved')),'pct')]])),
    pane('هشدارهای قابل پیگیری','<div class="alertlist">'+(news.length?news.map(([to,title,value])=>linkAlert(to,title,value)).join(''):para('برای این دامنه هشدار فعال وجود ندارد.'))+'</div>')
   ],[acctTab],'مانده بانک در سطح حساب است؛ فیلتر طرح یا استان روی مانده بانک اعمال نمی‌شود. استثناها و وضعیت داده در صفحه کیفیت آمده‌اند.');
 }
 if(id==='G-01'){
   const prev=getPriorFinance(), pf=fin(prev);
   const detail=f.map(x=>({...x,Amount:filters.basis==='نقدی'?x.CashValue:x.BookValue,Recon:filters.basis==='نقدی'?null:x.BookValue-x.ControlValue})).sort((a,b)=>b.PeriodKey-a.PeriodKey);
   const alloc=byKey(f,'Attribution',fin);
   const comparable=f.filter(x=>x.PeriodKey>=140301);
   const compared=fin(comparable);
   const cmpNames=unique([...comparable,...prev].map(r=>r.Account));
   const byAcct=cmpNames.map(Account=>({Account,Change:diff(fin(comparable.filter(r=>r.Account===Account)).Balance,fin(prev.filter(r=>r.Account===Account)).Balance)}));
   return bundle([...financeCards,V('تغییر تراز هم‌دوره',prev.length?diff(compared.Balance,pf.Balance):null,'money','فقط ماه‌های دارای دوره مشابه')],[
    chart('پل سرفصل‌ها تا تراز',account,'Account','waterfall',[X('اثر بر تراز','Balance')]),chart('سهم هر سرفصل در تغییر تراز',prev.length?byAcct:[],'Account','bar',[X('تغییر','Change')]),chart('وضعیت انتساب',alloc,'Attribution','bar',[X('منابع','Sources'),X('مصارف','Uses')])],
   [acctTab,tab('منشأ تجمیعی رقم و تطبیق',detail,[...cols(['k','p','g','s','account']),C('Direction','جهت'),C('Attribution','نوع انتساب'),C('Method','روش انتساب'),C('Amount','مبلغ','money'),C('Recon','اختلاف دفتر','money')],trace)],
   'تعهدی بر دوره تعلق و نقدی بر تاریخ پرداخت است. تغییر سرفصل سهم حسابی در تغییر تراز است؛ اثبات علت اقتصادی نیست.');
 }
 if(id==='G-02'){
  const triggers=fc.filter(x=>x.Low<x.Floor);
  return bundle([V('مانده آغاز',ct.opening),V('ورودی نقد',ct.inflow),V('خروجی نقد',ct.outflow),V('مانده پایان',ct.closing,'money','خالص '+fmt(diff(ct.inflow,ct.outflow),'money'))],
   [chartsCash,chart('ورودی، خروجی و تعهد سررسید',byMonth(cash,r=>({Inflow:sum(r,'Inflow'),Outflow:sum(r,'Outflow'),Due:sum(r,'DueOutflow')})),'PeriodKey','bar',[X('ورودی','Inflow'),X('خروجی','Outflow'),X('سررسید','Due')]),pane('هشدار و تقویم نقد',mini([['خالص دوره',fmt(diff(ct.inflow,ct.outflow),'money')],['حداقل احتیاطی',fmt(ct.floor,'money')],['فاصله',fmt(diff(ct.closing,ct.floor),'money')],['اولین کران زیر آستانه',triggers.length?periodLabel(triggers[0].PeriodKey):'ندارد']]))],
   [tab('گردش و سررسید ماهانه حساب‌ها',cash,[columns.k,C('Bank','حساب'),C('Opening','آغاز','money'),...cols(['in','out','close']),C('DueOutflow','سررسید','money'),C('Floor','آستانه','money'),columns.s]),tab('پیش‌بینی و دامنه نمونه',fc,[columns.k,C('Forecast','میانه نمونه','money'),C('Low','کران پایین','money'),C('High','کران بالا','money'),C('Floor','آستانه','money')]),tab('تأخیر دریافت دولت',gov.claim.filter(x=>x.Paid<x.Invoiced).map(agingClaim),[columns.r,C('Due','سررسید','date'),C('Age','روز تأخیر'),columns.debt],trace)],
   'پیش‌بینی بر میانگین ۶ ماه و نرخ رشد فرضی است؛ کران‌ها فاصله اطمینان آماری نیستند. مبنای صفحه ماهانه است.');
 }
 if(id==='G-03'){
  const r=byKey(f,'PlanKey',q=>({...fin(q),Allocated:sum(q.filter(x=>x.Attribution==='تخصیص تحلیلی'),'BookValue'),Unassigned:sum(q.filter(x=>x.Attribution==='تخصیص‌نیافته'),'BookValue')})).map(x=>({...x,...(x.PlanKey?pop(popr,x.PlanKey):{Insured:null,Retired:null,Support:null})}));
  return bundle([...financeCards,V('تخصیص‌نیافته',sum(f.filter(x=>x.Attribution==='تخصیص‌نیافته'),'BookValue'),'money','مبلغ ناخالص تعهدی')],[
   chart('مقایسه منابع و مصارف طرح‌ها',r,'PlanKey','bar',[X('منابع','Sources'),X('مصارف','Uses')],{label:'plan'}),
   chart('ترکیب منابع در طرح',byKey(f.filter(x=>x.Direction==='منبع'),'PlanKey',x=>({Premium:sum(x.filter(a=>a.Account==='حق‌بیمه'),'BookValue'),Government:sum(x.filter(a=>a.Account==='سهم و حمایت دولت'),'BookValue'),Other:sum(x.filter(a=>!['حق‌بیمه','سهم و حمایت دولت'].includes(a.Account)),'BookValue')})),'PlanKey','bar',[X('حق‌بیمه','Premium'),X('دولت','Government'),X('سایر','Other')],{label:'plan',stack:true})],
   [tab('مقایسه و ورود به اجزای تراز طرح',r,[columns.p,...balt,C('Insured','بیمه‌پرداز'),C('Retired','مستمری‌بگیر'),C('Support','نسبت','ratio'),C('Allocated','تخصیص تحلیلی','money'),C('Unassigned','تخصیص‌نیافته','money')],{drill:'PlanKey'}),tab('روش و سرفصل اقلام تخصیص',f.filter(x=>x.Attribution!=='مستقیم'),[...cols(['k','p','account']),C('Method','روش'),C('BookValue','رقم تعهدی','money')],trace)],
   'نسبت پشتیبانیِ طرح بدون مخرج منتسب گزارش نمی‌شود. جمع بیمه‌پرداز طرح‌ها، به‌دلیل پوشش هم‌زمان، با تعداد یکتای سازمان برابر نیست.');
 }
 if(id==='G-04'){
  const indicator=filters.indicator||'Balance', selected=filterRows(gov.finance,'finance',{ignore:['province','city','branch']});
  const rr=byKey(f,'RegionKey',fin).map(x=>({...x,CityName:regionBy[x.RegionKey]?.CityName,Province:regionBy[x.RegionKey]?.Province,BranchCode:regionBy[x.RegionKey]?.BranchCode,...premium(pr.filter(p=>p.RegionKey===x.RegionKey)),...pop(popr.filter(a=>a.RegionKey===x.RegionKey),filters.plan===''?null:+filters.plan)}));
  const peerPremium=filterRows(gov.premium,'premium',{ignore:['province','city','branch']});
  const mapRows=grouped(selected,x=>regionBy[x.RegionKey]?.MapName||'00',(Code,ar)=>{
   const prem=peerPremium.filter(p=>regionBy[p.RegionKey]?.MapName===Code);
   return {Code,...fin(ar),...premium(prem)};
  });
  const peerRaw=byMonth(selected.filter(x=>x.RegionKey>0), ar=>({Peer:(fin(ar).Balance||0)/Math.max(1,new Set(ar.map(x=>regionBy[x.RegionKey].MapName)).size)}));
  const rank=[...rr].sort((a,b)=>(b[indicator]??-Infinity)-(a[indicator]??-Infinity));
  const points=rank.filter(x=>x.Rate!==null&&x.Rate<.78);
  const directory=(meta.dims.BranchDirectory||[]).filter(x=>(!filters.province||x.MapName===filters.province)&&(!filters.city||x.CityCode===filters.city)&&(!filters.branch||x.BranchCode===regionBy[+filters.branch]?.BranchCode));
  return bundle([...financeCards,V('نرخ وصول منطقه',pp.Rate,'pct','وصول / مطالبه')],[
   mapPanel(mapRows,indicator),chart('روند منطقه و میانگین ساده استان‌ها',mergeMonths(trend,peerRaw),'PeriodKey','line',[X('تراز دامنه','Balance'),X('میانگین استان‌ها','Peer')]),
   chart('رتبه شعب بر شاخص منتخب',rank.slice(0,12),'RegionKey','bar',[X('شاخص منتخب',indicator)],{label:'region',unit:indicator==='Rate'?'pct':'money'})],
   [tab('استان، شهر، شعبه و شاخص‌های مقایسه',rank,[C('Province','استان'),C('CityName','شهر'),C('BranchCode','کد شعبه'),columns.g,...balt,columns.collected,C('Rate','وصول / مطالبه','pct'),C('Insured','بیمه‌پرداز'),C('Retired','مستمری‌بگیر')],{drill:'RegionKey'}),tab('شعب زیر آستانه آزمایشی وصول',points,[columns.g,columns.collected,C('Rate','نرخ','pct')],{drill:'RegionKey'}),tab('فهرست مرجع شعب؛ شامل شعب بدون تراکنش نمونه',directory,[C('ProvinceName','استان'),C('CityName','شهر'),C('BranchCode','کد شعبه'),C('BranchName','نام شعبه'),C('SourceStatus','کد وضعیت مبدأ')])],
   'استان‌های خاکستری پوشش داده ندارند. انتخاب استان روی نقشه شعب همان استان را نشان می‌دهد. ستاد در نقشهٔ استان‌ها رنگ‌آمیزی نمی‌شود.');
 }
 if(id==='G-05'){
  const sts=[['انتظار','Expected'],['تشخیص','Assessed'],['مطالبه','Claimed'],['وصول','Collected'],['مانده','Debt']].map(([Stage,k])=>({Stage,Amount:pp[k]}));
  const det=pr.map(r=>({...r,Debt:r.Claimed-r.Collected,Rate:ratio(r.Collected,r.Claimed)}));
  const cause=byKey(det,'Cause',premium), aging=byKey(det,'Aging',premium), rank=byKey(det,'RegionKey',premium).sort((a,b)=>(b.Rate||0)-(a.Rate||0));
  return bundle([V('حق‌بیمه مورد انتظار',pp.Expected),V('تشخیص‌شده',pp.Assessed),V('وصول‌شده',pp.Collected),V('نرخ وصول',pp.Rate,'pct','وصول / مطالبه')],[
   chart('قیف مراحل حق‌بیمه',sts,'Stage','bar',[X('مبلغ','Amount')]),chart('روند تشخیص، مطالبه و وصول',byMonth(pr,premium),'PeriodKey','line',[X('تشخیص','Assessed'),X('مطالبه','Claimed'),X('وصول','Collected')]),chart('عوامل ثبت‌شده شکاف وصول',cause,'Cause','bar',[X('مانده','Debt')]),chart('وضعیت زمانی وصول',aging,'Aging','bar',[X('مانده','Debt'),X('وصول','Collected')])],
   [tab('رتبه عملکرد شعب',rank,[columns.g,...cols(['claimed','collected','debt']),C('Rate','نرخ وصول','pct')],{drill:'RegionKey'}),tab('جزئیات کارگاه بدون اطلاعات هویتی',det,[...cols(['k','g','p','a']),C('Cause','علت'),C('Aging','سررسید'),...cols(['status','claimed','collected','debt']),C('Rate','نرخ وصول','pct')],trace)],
   'مانده دارایی قابل‌وصول قطعی نیست. دلیل پرونده در داده نمونه یک برچسب تحلیلی است.');
 }
 if(id==='G-06'){
  const ef=filterRows(gov.healthEffect,'healthEffect');
  const agg=byKey(bh,'Service',r=>({Total:sum(r,'Total'),Fund:sum(r,'Fund'),Volume:sum(r,'Volume'),Avg:ratio(sum(r,'Total'),sum(r,'Volume'))}));
  const bridge=[['قیمت متوسط','PriceEffect'],['حجم خدمت','QuantityEffect'],['ورود / خروج ترکیب','CompositionEffect']].map(([Name,k])=>({Name,Amount:sum(ef,k)}));
  const dt=mergeMonths(byMonth(bh,x=>({Total:sum(x,'Total'),Fund:sum(x,'Fund')})),byMonth(ef,x=>({Prior:sum(x,'PriorCost')})));
  return bundle([V('هزینه کل درمان',sum(bh,'Total')),V('سهم صندوق',sum(bh,'Fund')),V('حجم خدمات',sum(bh,'Volume'),'num'),V('قیمت متوسط خدمت',ratio(sum(bh,'Total'),sum(bh,'Volume')),'million','میلیون ریال؛ تعرفه رسمی نیست')],[
   chart('روند هزینه، سهم صندوق و دوره مشابه',dt,'PeriodKey','line',[X('هزینه کل','Total'),X('سهم صندوق','Fund'),X('دوره مشابه','Prior')]),
   chart('پل عوامل رشد هزینه درمان',ef.length?bridge:[],'Name','waterfall',[X('اثر','Amount')]),
   chart('هزینه و سهم صندوق بر حسب خدمت',agg,'Service','bar',[X('هزینه کل','Total'),X('سهم صندوق','Fund')]),
   chart('ترکیب بیماری در داده نمونه',byKey(bh,'Diagnosis',x=>({Total:sum(x,'Total')})),'Diagnosis','bar',[X('هزینه خدمت','Total')])],
  [tab('هزینه و پرداخت‌کنندگان به تفکیک خدمت',bh,[...cols(['k','g','a','p']),C('Service','خدمت'),C('Diagnosis','گروه بیماری'),...cols(['cost','med','visits']),C('MemberShare','فرد','money'),C('OtherShare','سایر','money')],trace),
   tab('محاسبه عوامل رشد',ef,[...cols(['k','g','a']),C('Service','خدمت'),C('CurrentUnits','حجم جاری'),C('PriorUnits','حجم قبل'),C('PriceEffect','اثر قیمت','money'),C('QuantityEffect','اثر حجم','money'),C('CompositionEffect','تغییر ترکیب','money')],trace)],
   'اثر قیمت و حجم در سلول قابل مقایسه محاسبه می‌شود؛ خدمت تازه یا حذف‌شده در اثر ترکیب است. درصد رشد بدون مخرج دوره مشابه نمایش داده نمی‌شود.');
 }
 if(id==='G-07'){
  const k=last(filterRows(gov.obligation,'obligation')), ob=filterRows(gov.obligation,'obligation').filter(x=>x.PeriodKey===k);
  const freq=filterRows(gov.pensionBands,'pensionBands').sort((a,b)=>a.Fund-b.Fund);
  const n=sum(freq,'Frequency')||0;let at=0, medA=null,medB=null;
  freq.forEach(x=>{at+=x.Frequency;if(medA===null&&at>=Math.floor((n+1)/2))medA=x.Fund;if(medB===null&&at>=Math.ceil((n+1)/2))medB=x.Fund});
  const median=n?(medA+medB)/2:null;
  const poptrend=byMonth(popr,r=>{let a=pop(r,filters.plan===''?null:+filters.plan);let z=r.filter(x=>x.PlanKey===(filters.plan===''?0:+filters.plan));return {...a,Entries:sum(z,'Entries'),Exits:sum(z,'Exits')}});
  return bundle([V('بیمه‌پرداز آخر دوره',lp.Insured,'num'),V('مستمری‌بگیر آخر دوره',lp.Retired,'num'),V('پرداخت مستمری',sum(bp,'Fund')),V('تعهدات آتی نمونه',sum(ob,'FuturePV'),'money',k?periodLabel(k):'داده ثبت‌نشده')],[
   chart('جمعیت بیمه‌پرداز و مستمری‌بگیر',poptrend,'PeriodKey','line',[X('بیمه‌پرداز','Insured'),X('مستمری‌بگیر','Retired')],{unit:'num'}),
   chart('ورود و خروج ثبت‌شده',poptrend,'PeriodKey','bar',[X('ورود','Entries'),X('خروج','Exits')],{unit:'num'}),
   chart('توزیع گروه مستمری',byKey(bp,'Service',x=>({Fund:sum(x,'Fund')})),'Service','bar',[X('پرداخت','Fund')]),pane('تعریف شاخص‌های تکمیلی',mini([['نسبت پشتیبانی',fmt(lp.Support,'ratio')],['میانگین پرداخت',fmt(ratio(sum(bp,'Fund'),sum(bp,'Events')),'million')],['میانه پرداخت',fmt(median,'million')],['حقوق اکتسابی برآوردی',fmt(sum(ob,'AcquiredPV'),'money')]])+links(['G-11']))],
   [tab('نسل و وضعیت در ماه پایانی',popr.filter(x=>x.PeriodKey===lp.k&&x.PlanKey===(filters.plan===''?0:+filters.plan)),[...cols(['k','g']),C('GroupStatus','گروه'),C('AgeBand','سن'),C('Gender','جنس'),C('EntryCohort','نسل ورود'),C('Persons','تعداد')]),tab('حقوق و تعهدات آخرین محاسبه',ob,[...cols(['k','g']),C('EntryCohort','نسل'),C('RightStatus','وضعیت'),C('RuleKey','نسخه','rule'),C('AcquiredPV','حقوق اکتسابی','money'),C('FuturePV','تعهد آتی','money')])],
   'جمعیت سازمان در آخرین ماه یکتا است. سن فعلی نمونه و نسل ورود استفاده شده‌اند. تعهد و مستمری به طرح نامشخص نسبت داده نشده‌اند.');
 }
 if(id==='G-08'){
  const r=claim.map(agingClaim);
  const cf=a=>({Calculated:sum(a,'Calculated'),Confirmed:sum(a,'Confirmed'),Invoiced:sum(a,'Invoiced'),Paid:sum(a,'PaidAtBasis'),Debt:sum(a,'Debt')});
  const s=cf(r),stage=[['محاسبه','Calculated'],['تأیید','Confirmed'],['مطالبه','Invoiced'],['وصول','Paid'],['مانده','Debt']].map(([Stage,k])=>({Stage,Amount:s[k]}));
  return bundle([V('تعهد محاسبه‌شده',s.Calculated),V('مطالبه قطعی نمونه',s.Invoiced),V('وصول متصل به مطالبه',s.Paid),V('مانده تا تاریخ مبنا',s.Debt)],[
   chart('زنجیره مطالبه دولت',stage,'Stage','bar',[X('مبلغ','Amount')]),chart('سن مطالبات از تاریخ سررسید',byKey(r.filter(x=>x.Debt>0),'AgeBand',cf),'AgeBand','bar',[X('مانده','Debt')]),chart('روند ایجاد و وصول به تفکیک دوره تعهد',byMonth(r,cf),'PeriodKey','line',[X('مطالبه','Invoiced'),X('وصول','Paid')])],
   [tab('زنجیره اسناد و شناسه مطالبه',r,[columns.r,...cols(['k','p','a']),C('LegalBasis','مبنای قانونی نمونه'),C('Issued','ایجاد','date'),C('Due','سررسید','date'),C('PaymentDate','پرداخت','date'),C('Age','روز تأخیر'),C('Calculated','محاسبه','money'),C('Confirmed','تأیید','money'),C('Invoiced','مطالبه','money'),C('PaidAtBasis','وصول تا مبنا','money'),columns.debt,columns.status],trace)],
   'تنها پرداخت متصل به همان مطالبه تا پایان بازه از مانده کم می‌شود. اسناد و مبانی قانونی این نمونه ساختگی‌اند.');
 }
 if(id==='G-09'){
  const bby=byKey(bud,'Account',budgetData).map(x=>({...x,Variance:diff(x.Actual,x.Approved)}));
  return bundle([V('بودجه مصوب',budget.Approved),V('بودجه اصلاح‌شده',budget.Revised),V('عملکرد واقعی',budget.Actual),V('درصد تحقق',ratio(budget.Actual,budget.Approved),'pct','عملکرد / مصوب')],[
   chart('بودجه، عملکرد و پیش‌بینی',byMonth(bud,budgetData),'PeriodKey','line',[X('مصوب','Approved'),X('اصلاح‌شده','Revised'),X('عملکرد','Actual'),X('پیش‌بینی','Forecast')]),chart('پل انحراف سرفصل‌ها',bby,'Account','waterfall',[X('انحراف','Variance')]),chart('روند خطای پیش‌بینی هم‌سلول',byMonth(bud,x=>({Error:diff(sum(x,'Forecast'),sum(x,'Actual'))})),'PeriodKey','line',[X('پیش‌بینی منهای تحقق','Error')])],
   [tab('سلول‌های تطبیق و نسخه پیش‌بینی',bud.map(x=>({...x,Variance:x.Actual-x.Approved,Error:x.Forecast-x.Actual})),[...cols(['k','account','p','g']),C('Direction','جهت'),C('Version','نسخه'),C('ForecastAsOf','تاریخ تهیه','date'),C('Approved','مصوب','money'),C('Revised','اصلاحی','money'),C('Actual','عملکرد','money'),C('Forecast','پیش‌بینی','money'),C('Variance','انحراف','money'),C('Error','خطا','money'),columns.s],trace)],
   'هر بار یک نسخه بودجه انتخاب می‌شود. مقدار عملکرد میان نسخه‌ها دوباره جمع نمی‌شود. تاریخ ساخت پیش‌بینی قبل از ماه تحقق است.');
 }
 if(id==='G-10'){
  const ci=mp(comp,'Inflow'),co=mp(comp,'Outflow'),rev=mp(comp,'Revenue'),ex=mp(comp,'Expense');
  const byCompany=byKey(comp,'PartyKey',r=>({Inflow:mp(r,'Inflow'),Outflow:mp(r,'Outflow'),Net:diff(mp(r,'Inflow'),mp(r,'Outflow')),Profit:diff(mp(r,'Revenue'),mp(r,'Expense')),Benchmark:mp(r,'Benchmark'),Social:mp(r,'SocialOutput')}));
  return bundle([V('دریافت از شرکت‌ها',ci),V('پرداخت به شرکت‌ها',co),V('خالص گردش سازمان',diff(ci,co)),V('سود عملیاتی شرکت‌ها',diff(rev,ex))],[
   chart('جریان وجوه شرکت‌ها',byCompany,'PartyKey','bar',[X('ورودی سازمان','Inflow'),X('خروجی سازمان','Outflow')],{label:'party'}),
   chart('سود عملیاتی و هزینه فرصت',byCompany,'PartyKey','bar',[X('سود','Profit'),X('هزینه فرصت','Benchmark')],{label:'party'}),
   chart('خروجی مستقل مأموریت اجتماعی',byCompany,'PartyKey','bar',[X('تعداد خدمت نمونه','Social')],{label:'party',unit:'num'}),
   pane('شاخص‌های بازده و جریان',mini([['بازده عملیاتی / وجوه خروجی',fmt(ratio(diff(rev,ex),co),'pct')],['هزینه فرصت نمونه',fmt(mp(comp,'Benchmark'),'money')],['درآمد صورت مالی',fmt(rev,'money')],['هزینه صورت مالی',fmt(ex,'money')]]))],
   [tab('دفتر وجوه و صورت مالی شرکت',comp,[...cols(['k','a','in','out']),C('Relation','نوع رابطه'),C('Revenue','درآمد','money'),C('Expense','هزینه','money'),C('Benchmark','هزینه فرصت','money'),C('SocialOutput','خروجی اجتماعی'),C('StatementStatus','صورت مالی'),columns.r],trace)],
   'سود شرکت برابر خالص جریان سازمان نیست. هزینه فرصت ۱۲٪ وجوه خروجی در نمونه است و مأموریت اجتماعی ارزش پولی ندارد.');
 }
 if(id==='G-11'){
  const k=+filters.to||meta.asOf;
  const now=f.filter(x=>x.PeriodKey===k);
  const simulate=(r,sc)=>{
    const base=fin(r);
    const c=a=>sum(r.filter(x=>x.Account===a),'BookValue')||0;
    const v=base.Balance===null?null:base.Balance+Math.round(c('حق‌بیمه')*sc.PremiumRate)-Math.round(c('مستمری')*sc.PensionRate+c('درمان')*sc.HealthRate);
    return {Base:base.Balance,Scenario:v,Delta:diff(v,base.Balance)};
  };
  const S=simulate(now,sc);
  const groups=byKey(now,'PlanKey',r=>simulate(r,sc));
  const sensitivity=[-30,-15,0,15,30].map(v=>({Change:(v>0?'+':'')+v+'٪',...simulate(now,{...sc,PremiumRate:v/100})}));
  return bundle([V('تراز مبنا',S.Base),V('تراز سناریویی',S.Scenario,'money','آزمایشی'),V('اختلاف سناریو',S.Delta),V('مانده افق',fc.at(-1)?.Forecast??null,'money',sc.ScenarioName)],[chartsCash,
    chart('حساسیت تراز نسبت به وصول',sensitivity,'Change','line',[X('تراز سناریویی','Scenario')]),chart('توزیع اثر بین طرح‌ها',groups,'PlanKey','bar',[X('تغییر تراز','Delta')],{label:'plan'}),scenarioForm(false)
  ],[tab('مقایسه طرح و اقلام فاقد انتساب',groups,[columns.p,C('Base','تراز پایه','money'),C('Scenario','تراز سناریو','money'),C('Delta','اثر','money')]),runsTable()],
  'مدل سناریو برای تصمیم اکچوئری یا اعمال سیاست آماده نیست. دامنه نقد، دامنه نمونه است. جزئیات فردی در مدل حکمرانی وجود ندارد.');
 }
 if(id==='G-12'){
  const rr=f.filter(x=>x.Basis==='تعهدی').map(x=>({...x,Recon:x.BookValue-x.ControlValue}));
  const qc=byKey(q,'Type',r=>({Count:r.length,Open:r.filter(x=>x.State!=='رفع‌شده').length}));
  const un=byKey(rr,'Attribution',r=>({Value:sum(r,'BookValue')}));
  const src=meta.dims.Source.filter(x=>!filters.source||x.SourceKey===+filters.source);
  return bundle([V('منابع ثبت‌شده',src.length,'num'),V('مغایرت باز',q.filter(x=>x.State!=='رفع‌شده').length,'num'),V('فاصله دفتر تا تحلیل',sum(rr,'Recon')),V('فاقد انتساب',sum(rr.filter(x=>x.Attribution==='تخصیص‌نیافته'),'BookValue'))],[
   chart('کنترل کیفیت به تفکیک نوع',qc,'Type','bar',[X('کل','Count'),X('باز','Open')],{unit:'num'}),chart('اقلام مالی به تفکیک انتساب',un,'Attribution','bar',[X('مبلغ ناخالص تعهدی','Value')]),followForm(false)],
   [tab('تبار، منبع و دوره پوشش',src,[C('SystemName','سامانه'),C('OwnerName','مالک'),C('Updated','آخرین دریافت','date'),C('Coverage','پوشش')]),tab('صف کنترل‌های باز و بسته',q,[...cols(['k','s','r','type']),C('Severity','شدت'),...cols(['state','detail'])],trace),tab('اختلاف‌های دفتر و روش انتساب',rr.filter(x=>x.Recon!==0),[...cols(['k','s','account','p','g']),C('BookValue','تحلیل','money'),C('ControlValue','دفتر کنترل','money'),C('Recon','اختلاف','money'),C('Method','روش')],trace),tab('درخواست‌های تطبیق و کیفیت',tickets,[columns.ticket,C('Ref','مرجع'),columns.category,columns.state,columns.created,columns.detail],trace)],
   'داده مفقود، صفر ثبت‌شده و خارج از دامنه سه وضعیت جدا هستند. دفتر کنترل ساختگی است و تطبیق رسمی محسوب نمی‌شود.');
 }
 return bundle();
}
