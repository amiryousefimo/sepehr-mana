'use strict';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const plain=new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2});
const fmtDate=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'UTC'});
const CIRCLE=['#087d7b','#46689e','#bd793c','#7789bb','#5a7c84','#a45769','#865d2b'];
const defaults={from:'140201',to:'140507',basis:'تعهدی',version:'B-02',scenario:'1',horizon:'12',plan:'',province:'',branch:'',group:'',party:'',status:'',source:'',account:'',type:'',bank:'',attribution:'',direction:'',age:'',gender:'',cohort:'',service:'',diagnosis:'',corrected:'',payer:'',overlap:'',valuation:'',rule:'',rightStatus:'',sector:'',aging:'',cause:'',indicator:'Balance',kind:'',relation:'',grain:'ماهانه',dateBasis:'تعلق / وقوع'};
let meta,gov,profile,periods={},regionBy={},geometries=[],role='analyst',active='G-00',person=null,results=[],runs=[],tickets=[],units='money',loadToken=0;
let filters={...defaults},displayTables=[],tableState={},chosenRow=null,view='',debounce,toastTimer,formMsg='',searchMsg='',searchDraft={code:'DEMO-0001',status:'',branch:'0'};
let profileScope=null;
let facetCache=new Map();
const num=v=>plain.format(v);
function periodLabel(v){return v?String(periods[v]?.Label||v).replace(/[0-9]/g,x=>'۰۱۲۳۴۵۶۷۸۹'[x]):'—'}
function dateLabel(v){return v?fmtDate.format(new Date(v.length===10?v+'T00:00:00Z':v)):'—'}
function fmt(v,type){
 if(type==='openDate')return v?dateLabel(v):'جاری';
 if(v===null||v===undefined||v==='')return '—';
 if(type==='date')return dateLabel(v);
 if(type==='period')return periodLabel(v);
 if(type==='bool')return v?'بله':'خیر';
 if(type==='text')return v;
 if(type==='ratio'||type==='num')return typeof v==='number'?num(v):v;
 if(type==='pct')return num(v*100)+'٪';
 if(type==='money'||type==='million')return num(v/(type==='million'||active[0]==='P'?1e6:1e9));
 return typeof v==='number'?num(v):v;
}
function dim(type,v){
 const dims=meta?.dims||{};
 const cfg={plan:['Plan','PlanKey','PlanName'],region:['Region','RegionKey','Branch'],history:['HistoryType','HistoryTypeCode','HistoryTypeName'],party:['Party','PartyKey','PartyName'],source:['Source','SourceKey','SystemName'],rule:['Rule','RuleKey','Version']};
 const [l,k,f]=cfg[type]||[];
 return dims[l]?.find(x=>x[k]===+v)?.[f]??'—';
}
function showCell(r,[k,_,t]){
 const v=r[k];
 if(['plan','region','party','source','rule'].includes(t))return dim(t,v);
 if(k==='PeriodKey'||k==='BasisPeriod')return typeof v==='number'?periodLabel(v):v;
 return fmt(v,t);
}
function scenarioData(){return meta.dims.Scenario.find(x=>x.ScenarioKey===+filters.scenario)||meta.dims.Scenario[0]}
async function api(url,options={}){
 const prefix='/dashboard_2/report';
 const deadline=AbortSignal.timeout(20000);
 try{
  const response=await fetch(prefix+url,{signal:deadline,...options});
  const result=await response.json();
  if(!response.ok){const err=Error(result.error||'خطای ارتباط با سرور');err.status=response.status;throw err}
  return result;
 }catch(error){
  if(deadline?.aborted)throw Error('خواندن اطلاعات بیش از ۲۰ ثانیه طول کشید. دوباره تلاش کنید.');
  throw error;
 }
}
const option=(v,t=v,selected=false)=>'<option value="'+esc(v)+'"'+(selected?' selected':'')+'>'+esc(t)+'</option>';
function sel(key,title,opts){
 return '<div class="help-field"><div class="help-inline"><label for="f-'+esc(key)+'">'+esc(title)+'</label>'+help('filter',key,title)+'</div><select id="f-'+esc(key)+'" name="'+esc(key)+'"'+(opts.length<2?' disabled':'')+'>'+opts.map(x=>option(x[0],x[1],String(x[0])===filters[key])).join('')+'</select></div>';
}
const named={from:'از ماه',to:'تا ماه / تاریخ مبنا',basis:'مبنای مالی',plan:'طرح بیمه‌ای',province:'استان',branch:'شعبه',group:'گروه بیمه‌ای',status:'وضعیت',party:'کارگاه / ارائه‌دهنده / طرف',payer:'سهم پرداخت‌کننده',corrected:'ثبت اصلاحی',grain:'دوره روند',dateBasis:'مبنای تاریخ',kind:'نوع مزایا',service:'نوع خدمت / مستمری',rule:'نسخه قاعده',rightStatus:'وضعیت حق',valuation:'مبنای ارزش‌گذاری',scenario:'سناریو',source:'سامانه مبدأ',type:'نوع مغایرت',account:'سرفصل',direction:'جهت جریان',attribution:'نوع انتساب',bank:'حساب بانکی',horizon:'افق پیش‌بینی',indicator:'شاخص جغرافیا',sector:'صنعت / حوزه',cause:'عامل شکاف',aging:'وضعیت زمانی وصول',diagnosis:'گروه بیماری',age:'گروه سنی',gender:'جنس',cohort:'نسل ورود',version:'نسخه بودجه',relation:'نوع رابطه',overlap:'دوره‌های هم‌زمان'};
defaults.city='';defaults.history='';named.city='شهر';named.history='نوع سابقه بیمه';
const unique=r=>[...new Set(r.filter(x=>x!==null&&x!==undefined))];
const opts=(r,key)=>unique((r||[]).map(x=>x[key])).sort((a,b)=>(''+a).localeCompare(''+b,'fa')).map(x=>[x,x]);
const facetData={
 'G-00':'finance','G-01':'finance','G-02':'cash','G-03':'finance','G-04':'finance','G-05':'premium','G-06':'benefit',
 'G-07':'population','G-08':'claim','G-09':'budget','G-10':'company','G-11':'finance','G-12':'quality',
 'P-01':'membership','P-02':'membership','P-03':'premium','P-04':'benefit','P-05':'rights','P-06':'rights','P-07':'rights','P-08':'quality'
};
const directFacet={account:'Account',direction:'Direction',attribution:'Attribution',cause:'Cause',aging:'Aging',bank:'Bank',kind:'Kind',service:'Service',diagnosis:'Diagnosis',type:'Type',age:'AgeBand',gender:'Gender',cohort:'EntryCohort',relation:'Relation',rightStatus:'RightStatus'};
const geoCode=r=>r?.MapName||r?.ProvinceCode;
const provinceName=r=>r?.MapName==='Tehran'?'تهران':r?.Province;
function facetRows(key,extra=[]){
 const data=(active[0]==='G'?gov:profile)||{};
 let sources=[facetData[active]];
 if(active==='G-07'&&key==='service')sources=['benefit'];
 if(active==='G-12'&&['attribution','account','plan'].includes(key))sources=['finance'];
 if(active==='G-12'&&key==='source'&&!filters.type&&!filters.status)sources=['quality','finance'];
 const ignore=[key,...extra,...(key==='province'?['city','branch']:key==='city'?['branch']:[])];
 const cacheKey=JSON.stringify([sources,ignore,filters]);
 if(!facetCache.has(cacheKey)){
  const rows=sources.flatMap(kind=>{
   let source=data[kind]||[];
   if(active==='G-06')source=source.filter(isHealth);
   if(active==='G-07'&&kind==='benefit')source=source.filter(isPension);
   return filterRows(source,kind,{ignore});
  });
  facetCache.set(cacheKey,rows);
 }
 return facetCache.get(cacheKey);
}
function filterOptions(key){
 const d=meta.dims;
 const all=['','همه'];
 const strings=a=>[all,...a];
 const kv=a=>a.map(x=>[x,x]);
 if(key==='from'||key==='to'){
  const kind=facetData[active],rows=facetRows('from',['to']);
  return d.Period.filter(p=>p.IsActual&&(
   p.PeriodKey===+filters[key]||rows.some(r=>{
    const start=key==='from'?p.PeriodKey:+filters.from,end=key==='to'?p.PeriodKey:+filters.to;
    if(start>end)return false;
    if(kind==='membership')return r.StartDate<=periods[end]?.EndDate&&(!r.EndDate||r.EndDate>=periods[start]?.StartDate);
    const effective=active[0]==='P'&&filters.dateBasis!=='تعلق / وقوع'&&['premium','benefit'].includes(kind);
    const month=effective?calendarKey(filters.dateBasis==='ثبت'?r.Recorded:r.Paid):r.PeriodKey;
    return !month&&!effective||month>=start&&month<=end;
   })
  )).map(p=>[p.PeriodKey,periodLabel(p.PeriodKey)]);
 }
 if(key==='indicator')return [['Balance','تراز'],['Sources','منابع'],['Uses','مصارف'],['Collected','وصول'],['Rate','نرخ وصول']];
 if(key==='horizon')return [['3','۳ ماه'],['6','۶ ماه'],['12','۱۲ ماه']];
 if(key==='scenario')return d.Scenario.map(x=>[x.ScenarioKey,x.ScenarioName]);
 if(key==='grain')return kv(['ماهانه','سالانه']);
 if(key==='valuation')return strings(kv(['سابقه قابل مشاهده','خارج از دامنه','محاسبه نمایشی','نمونه ارزش فعلی','نمونه سناریو']));
 const rows=facetRows(key);
 const lookup=(list,col,label)=>{const values=new Set(rows.map(r=>r[col]));return list.filter(r=>values.has(r[col])).map(r=>[r[col],r[label]])};
 const regions=lookup(d.Region,'RegionKey','Branch').map(([id])=>regionBy[id]).filter(Boolean);
 if(key==='plan')return strings(lookup(d.Plan,'PlanKey','PlanName'));
 if(key==='province'||key==='city')return strings([...new Map(regions.map(r=>key==='province'?[geoCode(r),provinceName(r)]:[r.CityCode,r.CityName]).filter(([code])=>code&&code!=='00')).entries()].sort((a,b)=>a[1].localeCompare(b[1],'fa')));
 if(key==='branch')return strings(regions.filter(r=>r.RegionKey>0).map(r=>[r.RegionKey,r.Branch]));
 if(key==='history')return strings(lookup(d.HistoryType,'HistoryTypeCode','HistoryTypeName'));
 if(key==='group')return strings(opts(d.Plan.filter(r=>rows.some(x=>x.PlanKey===r.PlanKey)),'GroupName'));
 if(key==='party')return strings(lookup(d.Party,'PartyKey','PartyName'));
 if(key==='sector'){const ids=new Set(rows.map(r=>r.PartyKey));return strings(opts(d.Party.filter(r=>ids.has(r.PartyKey)),'Sector'))}
 if(key==='source')return strings(lookup(d.Source,'SourceKey','SystemName'));
 if(key==='rule')return strings(lookup(d.Rule,'RuleKey','Version'));
 if(key==='basis'||key==='version'){const field=key==='basis'?'Basis':'Version';return opts(rows,field).length?opts(rows,field):kv([filters[key]])}
 if(key==='status')return strings(opts(rows,active==='G-10'?'StatementStatus':active==='P-08'||active==='G-12'?'State':'Status'));
 if(key==='payer')return strings([['MemberShare','فرد'],['EmployerShare','کارفرما'],['StateShare','دولت'],['OtherShare','سایر']].filter(([col])=>rows.some(r=>r[col]>0)));
 if(key==='corrected')return [all,...[['yes','اصلاح‌شده'],['no','عادی']].filter(([value])=>rows.some(r=>r.Corrected===(value==='yes')))];
 if(key==='overlap')return [all,...(rows.some(r=>membershipOverlap(r,periods[+filters.from]?.StartDate,periods[+filters.to]?.EndDate))?[['yes','فقط دارای هم‌پوشانی']]:[])];
 if(key==='dateBasis'){
  const kinds=active==='P-03'?['تعلق / وقوع','وصول','ثبت']:['تعلق / وقوع','پرداخت'];
  return kv(kinds.filter(b=>facetRows(key,['from','to']).some(r=>{const m=b===kinds[0]?r.PeriodKey:calendarKey(b==='ثبت'?r.Recorded:r.Paid);return m>=+filters.from&&m<=+filters.to})||b===filters[key]));
 }
 return strings(opts(rows,directFacet[key]));
}
function activeFilters(){return new Set((F[active]||'').split(' '))}
function calendarKey(d){if(!d)return 0;return meta.dims.Period.find(x=>x.StartDate<=d&&d<=x.EndDate)?.PeriodKey||0}
function membershipOverlap(row,lo,hi){
 return (profile?.membership||[]).some(x=>x.MembershipKey!==row.MembershipKey&&x.StartDate<=(row.EndDate||hi)&&row.StartDate<=(x.EndDate||hi)&&x.StartDate<=hi&&(x.EndDate||hi)>=lo);
}
function filterRows(rows,kind,options={}){
 const include=activeFilters(),ignore=options.ignore||[];
 const f=k=>include.has(k)&&!ignore.includes(k)?filters[k]:'';
 const vals=Object.fromEntries(Object.keys(filters).map(k=>[k,f(k)]));
 const fr=options.from??+vals.from, to=options.to??(+vals.to||meta.asOf);
 const lo=periods[fr]?.StartDate||'0001-01-01',hi=periods[to]?.EndDate||'9999-12-31';
 const mapping={account:'Account',direction:'Direction',attribution:'Attribution',cause:'Cause',aging:'Aging',bank:'Bank',kind:'Kind',service:'Service',diagnosis:'Diagnosis',type:'Type',age:'AgeBand',gender:'Gender',cohort:'EntryCohort',relation:'Relation',rightStatus:'RightStatus',status:kind==='quality'?'State':kind==='company'?'StatementStatus':'Status'};
 const fields=Object.entries(mapping).filter(([k,n])=>vals[k]&&!(kind==='pensionBands'&&k==='status'));
 return (rows||[]).filter(r=>{
  let key=r.PeriodKey;
  if(kind==='membership'){
   if(r.StartDate>hi||r.EndDate&&r.EndDate<lo)return false;
   if(vals.overlap==='yes'&&!membershipOverlap(r,lo,hi))return false;
  }else if(typeof key==='number'){
   if(active[0]==='P'&&vals.dateBasis&&vals.dateBasis!=='تعلق / وقوع'&&['premium','benefit'].includes(kind)){key=calendarKey(vals.dateBasis==='ثبت'?r.Recorded:r.Paid);if(!key)return false}
   if(key<fr||key>to)return false;
  }
  if(kind==='finance'&&!ignore.includes('basis')&&r.Basis!==(vals.basis||'تعهدی'))return false;
  if(kind==='budget'&&!ignore.includes('version')&&r.Version!==(vals.version||'B-02'))return false;
  if(vals.plan){
   if(r.PlanKey!==undefined&&r.PlanKey!==+vals.plan)return false;
   if(['obligation','pensionBands'].includes(kind)&&+vals.plan!==0)return false;
  }
  if(vals.group&&r.PlanKey!==undefined&&meta.dims.Plan.find(x=>x.PlanKey===r.PlanKey)?.GroupName!==vals.group)return false;
  if(vals.branch&&r.RegionKey!==undefined&&r.RegionKey!==+vals.branch)return false;
  if(vals.province&&r.RegionKey!==undefined&&(regionBy[r.RegionKey]?.MapName||regionBy[r.RegionKey]?.ProvinceCode)!==vals.province)return false;
  if(vals.city&&r.RegionKey!==undefined&&regionBy[r.RegionKey]?.CityCode!==vals.city)return false;
  if(vals.history&&r.HistoryTypeCode!==undefined&&r.HistoryTypeCode!==vals.history)return false;
  if(vals.party&&r.PartyKey!==undefined&&r.PartyKey!==+vals.party)return false;
  if(vals.sector&&r.PartyKey!==undefined&&meta.dims.Party.find(x=>x.PartyKey===r.PartyKey)?.Sector!==vals.sector)return false;
  if(vals.source&&r.SourceKey!==undefined&&r.SourceKey!==+vals.source)return false;
  if(vals.rule&&r.RuleKey!==undefined&&r.RuleKey!==+vals.rule)return false;
  if(vals.corrected&&r.Corrected!==undefined&&r.Corrected!==(vals.corrected==='yes'))return false;
  if(profileScope&&['P-03','P-04'].includes(active)&&['premium','benefit'].includes(kind)&&r.MembershipKey!==profileScope)return false;
  return fields.every(([_,n])=>r[n]===undefined||r[n]===vals[_]);
 });
}
function periodAgg(rows,map){
 const phase=r=>{const k=activeFilters().has('dateBasis')&&filters.dateBasis!=='تعلق / وقوع'?calendarKey(filters.dateBasis==='ثبت'?r.Recorded:r.Paid):r.PeriodKey;return filters.grain==='سالانه'&&active==='P-03'?String(Math.floor(k/100)):k};
 return grouped(rows,phase,(PeriodKey,a)=>({PeriodKey,...map(a)})).sort((a,b)=>a.PeriodKey-b.PeriodKey);
}
function getPriorFinance(){
 const from=+filters.from, to=+filters.to;
 const start=Math.max(140301,from);
 if(start>to)return [];
 return filterRows(gov.finance,'finance',{from:start-100,to:to-100});
}
function agingClaim(r){
 const a=periods[+filters.to]?.EndDate||periods[meta.asOf].EndDate;
 const paid=r.PaymentDate&&r.PaymentDate<=a?r.Paid:0, age=Math.max(0,Math.round((Date.parse(a)-Date.parse(r.Due))/86400000));
 return {...r,PaidAtBasis:paid,Debt:r.Invoiced-paid,Age:age,AgeBand:age===0?'سررسید نشده':age<=30?'۱ تا ۳۰ روز':age<=90?'۳۱ تا ۹۰ روز':age<=180?'۹۱ تا ۱۸۰ روز':'بیش از ۱۸۰ روز'};
}
function mergeMonths(...lists){const rows=new Map();lists.flat().forEach(r=>rows.set(r.PeriodKey,{...rows.get(r.PeriodKey),...r}));return [...rows.values()].sort((a,b)=>a.PeriodKey-b.PeriodKey)}
const para=t=>'<p>'+esc(t)+'</p>';
function help(kind,key,label=key,context=''){
 const topic=window.rasadHelp.resolve(active,kind,key,label,context);
 if(!topic)return '';
 return '<button class="help-button" type="button" data-help="'+esc(kind+':'+key)+'" data-help-context="'+esc(context)+'" data-help-label="'+esc(label)+'" aria-label="راهنما: '+esc(label)+'" aria-haspopup="dialog"><span aria-hidden="true">؟</span></button>';
}
function withHelp(html,kind,key,label,context){
 const tag=/^<h[1-6]>/.test(html)?'div':'span';
 return '<'+tag+' class="help-inline">'+html+help(kind,key,label,context)+'</'+tag+'>';
}
const control=(html,key,label)=>withHelp(html,'control',key,label);
const formField=(label,key,html)=>'<div class="help-field"><div class="help-inline"><label for="help-field-'+key+'">'+esc(label)+'</label>'+help('control',key==='premium'||key==='pension'||key==='health'?'scenarioPercent':key,label)+'</div>'+html.replace(/^<(\w+)/,'<$1 id="help-field-'+key+'"')+'</div>';
const links=items=>'<div class="listlinks">'+items.map(key=>withHelp('<a href="#'+key+'">'+esc(titles[key])+'</a>','page',key,titles[key])).join('')+'</div>';
const linkAlert=(page,label,value)=>withHelp('<a href="#'+page+'">'+esc(label)+'<span>'+esc(value)+'</span></a>','page',page,label);
const mini=rows=>'<div class="mini-grid">'+rows.map(([title,value,key,type])=>'<div>'+withHelp('<small>'+esc(title)+'</small>',key?'detail':'metric',key||title,title,type)+'<br><b>'+esc(value)+'</b></div>').join('')+'</div>';
const emptyPanel=()=>'<div class="empty">'+control(esc(emptyNote),'empty','نبود داده')+'</div>';
function pane(t,html){return '<section class="panel"><div class="panelhead">'+withHelp('<h2>'+esc(t)+'</h2>','panel',t)+'</div>'+html+'</section>'}
function chart(t,rows,axis,type,series=[],o={}){
 if(type==='timeline')return pane(t,timeline(rows));
 if(!rows.length||!series.some(s=>rows.some(r=>typeof r[s.key]==='number')))return pane(t,emptyPanel());
 const unit=o.unit||'money';
 let rr=rows;
 if(type==='waterfall'){
   let acc=0;rr=rows.map(x=>{const f=acc;acc+=x[series[0].key]||0;return {...x,F:f,T:acc}});
   rr.push({[axis]:'خالص',F:0,T:acc,total:true});
 }
 const values=type==='waterfall'?rr.flatMap(x=>[x.F,x.T]):o.stack?rr.map(x=>series.reduce((a,s)=>a+(x[s.key]||0),0)):rr.flatMap(x=>series.map(s=>x[s.key])).filter(x=>typeof x==='number');
 let mi=Math.min(0,...values),ma=Math.max(0,...values);if(mi===ma)ma+=1;
 const w=480,h=192,x0=60,x1=w-13,y0=10,y1=h-35;
 const X=(i,bar)=>bar?x0+(i+0.5)*(x1-x0)/rr.length:x0+(rr.length===1?(x1-x0)/2:i*(x1-x0)/(rr.length-1));
 const Y=v=>y1-(v-mi)*(y1-y0)/(ma-mi);
 const svg=['<svg class="chart" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(t)+'">'];
 for(let i=0;i<5;i++){
  const v=mi+(ma-mi)*i/4,y=Y(v);
  svg.push('<path d="M'+x0+' '+y+'H'+x1+'" stroke="#e3edf1"/><text text-anchor="end" x="'+(x0-5)+'" y="'+(y+3)+'">'+esc(fmt(v,unit))+'</text>');
 }
 if(mi<0)svg.push('<path d="M'+x0+' '+Y(0)+'H'+x1+'" stroke="#a5bcc6"/>');
 const label=v=>axis==='PeriodKey'?periodLabel(v):o.label?dim(o.label,v):String(v);
 const marks=type==='line'?5:Math.min(rr.length,8);
 const indices=new Set(Array.from({length:Math.min(marks,rr.length)},(_,j)=>Math.round(j*(rr.length-1)/Math.max(1,Math.min(marks,rr.length)-1))));
 rr.forEach((r,i)=>{if(indices.has(i)){const tx=label(r[axis]);svg.push('<text text-anchor="middle" direction="rtl" x="'+X(i,type!=='line')+'" y="'+(h-10)+'"><title>'+esc(tx)+'</title>'+esc(tx.length>15?tx.slice(0,14)+'…':tx)+'</text>')}});
 const rect=(x,a,b,width,color,name,action)=>'<rect x="'+x+'" y="'+Math.min(Y(a),Y(b))+'" width="'+width+'" height="'+Math.max(1,Math.abs(Y(b)-Y(a)))+'" rx="2" fill="'+color+'"'+(action?' tabindex="0" role="button" data-drill="'+esc(action)+'" aria-label="'+esc(name)+'"':'')+'><title>'+esc(name)+'</title></rect>';
 function action(r){return (axis==='PeriodKey'&&typeof r[axis]==='number'&&o.dateBrush!==false?'PeriodKey':axis==='PlanKey'||axis==='Account'||axis==='RegionKey'?axis:null)&&r[axis]!==undefined?axis+'|'+r[axis]:''}
 if(type==='line'){
   series.forEach((s,j)=>{
      let pen=false,path='';
      rr.forEach((r,i)=>{let v=r[s.key];if(typeof v!=='number'){pen=false;return}path+=(pen?' L':' M')+X(i,false)+' '+Y(v);pen=true});
      svg.push('<path d="'+path+'" stroke="'+CIRCLE[j]+'" stroke-width="2.5" fill="none"'+(s.key.match(/Forecast|High|Low/)?' stroke-dasharray="5 4"':'')+'/>');
      rr.forEach((r,i)=>{const v=r[s.key];if(typeof v!=='number')return;const a=action(r),txt=s.name+'، '+label(r[axis])+': '+fmt(v,unit);
       svg.push('<circle cx="'+X(i,false)+'" cy="'+Y(v)+'" r="'+(rr.length<=12?3:2)+'" fill="'+CIRCLE[j]+'"'+(a?' tabindex="0" data-drill="'+esc(a)+'" aria-label="'+esc(txt)+'"':'')+'><title>'+esc(txt)+'</title></circle>')})
   });
 }else if(type==='waterfall'){
   rr.forEach((r,i)=>{const z=Math.min(36,(x1-x0)/rr.length*.62);svg.push(rect(X(i,true)-z/2,r.F,r.T,z,r.total?'#415f9c':r.T<r.F?'#bc7543':'#087d7b',label(r[axis])+': '+fmt(r.T-r.F,unit),r.total?'':action(r)));
    if(i<rr.length-2)svg.push('<path d="M'+(X(i,true)+z/2)+' '+Y(r.T)+'H'+(X(i+1,true)-z/2)+'" stroke="#aebec5" stroke-dasharray="4 3"/>')
   });
 }else{
   const z=Math.min(50,(x1-x0)/rr.length*.7),bw=o.stack?z:z/series.length;
   rr.forEach((r,i)=>{let cum=0;series.forEach((s,j)=>{const a=r[s.key];if(typeof a!=='number')return;const origin=o.stack?cum:0;svg.push(rect(X(i,true)-z/2+(o.stack?0:bw*j),origin,origin+a,Math.max(1,bw-1),CIRCLE[j],label(r[axis])+' · '+s.name+': '+fmt(a,unit),action(r)));if(o.stack)cum+=a})});
 }
 svg.push('</svg><div class="legend">'+series.map((s,j)=>withHelp('<i style="background:'+CIRCLE[j]+'"></i>'+esc(s.name),'series',s.key,s.name,unit)).join('')+withHelp('<small>محورهای نمودار</small>','axes',axis,'محورهای نمودار',unit)+'</div>');
 return pane(t,svg.join(''));
}
function timeline(rows){
 if(!rows.length)return emptyPanel();
 const lo=Date.parse(periods[+filters.from]?.StartDate||periods[140201].StartDate),hi=Date.parse(periods[+filters.to]?.EndDate||periods[meta.asOf].EndDate),length=Math.max(86400000,hi-lo);
 return '<div class="timeline">'+rows.map((r,i)=>{const a=Math.max(0,Math.min(100,(Date.parse(r.StartDate)-lo)*100/length)),b=r.EndDate?Math.min(100,(Date.parse(r.EndDate)-lo)*100/length):100;const text=dim('plan',r.PlanKey)+' · '+dateLabel(r.StartDate)+' تا '+(r.EndDate?dateLabel(r.EndDate):'جاری');
 return '<div class="track"><button class="segment" data-drill="MembershipKey|'+r.MembershipKey+'" style="inset-inline-start:'+a+'%;width:'+Math.max(1,b-a)+'%;background:'+CIRCLE[i%CIRCLE.length]+'" title="'+esc(text)+'">'+esc(text)+'</button></div>'}).join('')+'</div><div class="footrow">'+withHelp(esc(periodLabel(+filters.from)),'filter','from','شروع خط زمانی')+control('<small>خواندن نوارها</small>','timeline','خط زمانی عضویت')+withHelp(esc(periodLabel(+filters.to)),'filter','to','پایان خط زمانی')+'</div>';
}
function mapPanel(rows,indicator){
 const labels={Balance:'تراز',Collected:'وصول',Sources:'منابع',Uses:'مصارف',Rate:'نرخ وصول'};
 const value=new Map(rows.map(x=>[x.Code,x[indicator]]));
 const names=new Map(meta.dims.Region.filter(r=>r.MapName).map(r=>[r.MapName,provinceName(r)]));
 const nums=[...names.keys()].map(code=>value.get(code)).filter(Number.isFinite),min=Math.min(...nums),max=Math.max(...nums);
 const scale=['#d0eeeb','#a0d6d0','#63b8b0','#2b928e','#086663'];
 const shown=code=>Number.isFinite(value.get(code))?fmt(value.get(code),indicator==='Rate'?'pct':'money'):'فاقد داده';
 const color=code=>{const v=value.get(code);return Number.isFinite(v)?scale[max===min?2:Math.min(4,Math.floor((v-min)/(max-min)*5))]:'#dce8ed'};
 const area=new Map();
 let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
 const point=([lon,lat])=>{const x=(lon-44)*16,y=(40-lat)*19;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);return x.toFixed(1)+','+y.toFixed(1)};
 for(const {properties,geometry} of geometries){
  const code=properties.shapeName;
  const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
  const paths=polygons.map(poly=>poly.map(ring=>'M'+ring.map(point).join('L')+'Z').join(' ')).join(' ');
  area.set(code,(area.get(code)||'')+' '+paths);
 }
 const actionable=new Set(filterOptions('province').slice(1).map(([code])=>code));
 const canOpen=code=>actionable.has(code)||code===filters.province;
 const shapeOrder=[...area].sort(([a],[b])=>Number(a===filters.province)-Number(b===filters.province));
 const shapes=shapeOrder.map(([code,path])=>{
  const caption=(names.get(code)||code)+' · '+shown(code),selected=code===filters.province;
  return '<path d="'+path.trim()+'" fill-rule="evenodd" style="fill:'+color(code)+'" class="'+(selected?'selected':'')+'"'+(canOpen(code)?' tabindex="0" role="button" aria-pressed="'+selected+'" data-drill="ProvinceCode|'+esc(code)+'" aria-label="'+esc(caption)+'"':'')+'><title>'+esc(caption)+'</title></path>';
 }).join('');
 const ranking=[...names].sort(([a,an],[b,bn])=>(value.get(b)??-Infinity)-(value.get(a)??-Infinity)||an.localeCompare(bn,'fa'));
 const list=ranking.map(([code,label])=>'<li><button type="button" aria-pressed="'+(code===filters.province)+'" data-drill="ProvinceCode|'+esc(code)+'"'+(canOpen(code)?'':' disabled')+'><span><i style="background:'+color(code)+'"></i>'+esc(label)+'</span><b>'+esc(shown(code))+'</b></button>'+help('province',code,label,labels[indicator])+'</li>').join('');
 const svg=area.size?'<svg class="map" viewBox="'+[left-9,top-9,right-left+18,bottom-top+18].join(' ')+'" aria-label="نقشه تعاملی استان‌های ایران">'+shapes+'</svg>':para('نقشه بارگذاری نشد؛ استان را از فهرست انتخاب کنید.');
 const heading='نقشه استان‌ها · '+labels[indicator];
 const legend='<div class="legend"><span>کم</span>'+scale.map(c=>'<i style="background:'+c+'"></i>').join('')+'<span>زیاد</span>'+control('<i style="background:#dce8ed"></i>فاقد داده','mapLegend','رنگ‌های نقشه')+'</div>';
 return '<section class="panel province-panel"><div class="panelhead">'+withHelp('<h2>'+esc(heading)+'</h2>','panel','نقشه استان‌ها',heading)+control('<span class="pill">'+num(nums.length)+' از '+num(names.size)+' استان با داده</span>','mapCount','تعداد استان‌های دارای داده')+'</div><p aria-live="polite">'+control(filters.province?'استان انتخاب‌شده: '+esc(names.get(filters.province)||filters.province):'برای دیدن شهرها و شعب، یک استان انتخاب کنید.','mapSelection','انتخاب استان')+'</p><div class="province-grid"><div>'+svg+legend+'<p class="mapnote" dir="ltr">© OpenStreetMap contributors, Wambacher · geoBoundaries IRN ADM1 · ODbL 1.0</p></div><div>'+control('<h3>رتبه استان‌ها</h3>','mapRanking','رتبه استان‌ها')+'<ol class="province-list" aria-label="رتبه استان‌ها">'+list+'</ol></div></div></section>';
}
function tableHTML(t,i){
 const {rows,cols}=t;
 const st=tableState[i]||{page:0,col:-1,asc:true};
 let arr=rows.map((r,j)=>({r,j}));
 if(st.col>=0){
  const c=cols[st.col];
  arr.sort((a,b)=>{const x=a.r[c[0]],y=b.r[c[0]];if(x==null)return y==null?0:1;if(y==null)return -1;const k=typeof x==='number'&&typeof y==='number'?x-y:String(showCell(a.r,c)).localeCompare(String(showCell(b.r,c)),'fa',{numeric:true});return st.asc?k:-k});
 }
 const batch=12,total=Math.max(1,Math.ceil(arr.length/batch)),page=Math.min(st.page,total-1);
 const rowAction=['select','drill','periodLink','trace'].find(key=>t.opts[key]);
 const h='<thead><tr>'+cols.map(([key,label,type],position)=>'<th scope="col"'+(st.col===position?' aria-sort="'+(st.asc?'ascending':'descending')+'"':'')+'>'+withHelp('<button type="button" data-sort="'+i+'|'+position+'">'+esc(label)+(st.col===position?(st.asc?' ↑':' ↓'):'')+'</button>','field',key,label,type)+'</th>').join('')+(rowAction?'<th scope="col">'+control('جزئیات',rowAction,'عمل ستون جزئیات')+'</th>':'')+'</tr></thead>';
 const tr=arr.slice(page*batch,(page+1)*batch).map(({r,j})=>{
  const action=t.opts.select?'انتخاب پرونده':t.opts.drill?'ریز شاخص':t.opts.periodLink?'انتخاب دوره':t.opts.trace?'منشأ و جزئیات':'';
  return '<tr>'+cols.map(c=>'<td'+(typeof r[c[0]]==='number'&&r[c[0]]<0?' class="neg"':'')+'>'+esc(showCell(r,c))+'</td>').join('')+(action?'<td><button class="linklike" data-row="'+i+'|'+j+'">'+action+'</button></td>':'')+'</tr>'
 }).join('');
 const pageBar='<div class="footrow"><span>'+num(arr.length)+' ردیف · '+num(page+1)+' از '+num(total)+'</span>'+control('<button type="button" class="secondary" data-paging="'+i+'|'+(page-1)+'"'+(page===0?' disabled':'')+'>قبلی</button> <button type="button" class="secondary" data-paging="'+i+'|'+(page+1)+'"'+(page+1>=total?' disabled':'')+'>بعدی</button>','paging','صفحه‌بندی جدول')+'</div>';
 return '<section class="panel tablepanel" data-table="'+i+'"><div class="panelhead">'+withHelp('<h2>'+esc(t.t)+'</h2>','panel',t.t)+control('<span class="pill">'+num(rows.length)+' ردیف</span>','rows','تعداد ردیف‌ها')+'</div>'+(arr.length?'<div class="tablebox"><table>'+h+'<tbody>'+tr+'</tbody></table></div>'+pageBar:emptyPanel())+'</section>';
}
function kpis(rows){
 if(!rows.length)return '';
 return '<div class="kpis">'+rows.map((x,i)=>{const q=x.v<0?'warn':x.subtitle==='آزمایشی'?'sc':'good';
 const value='<span>'+esc(x.t)+'</span><strong>'+esc(fmt(x.v,x.kind))+'</strong><small>'+esc(x.subtitle||(x.kind==='money'?units:''))+'</small>';
 return '<article class="kpi '+q+'">'+(x.link?'<button type="button" data-go="'+x.link+'">'+value+'</button>':value)+help('metric',x.t,x.t,x.link?titles[x.link]:'')+'</article>'}).join('')+'</div>';
}
function filtersHTML(){
 const keys=F[active]?.split(' ')||[];
 if(!keys.length)return '';
 return '<form class="filters" id="filters">'+keys.map(k=>sel(k,named[k],filterOptions(k))).join('')+'<div class="actions">'+control('<span class="filter-note">گزینه‌ها بر اساس دادهٔ همین صفحه به‌روز می‌شوند.</span>','filters','گزینه‌های فیلتر')+control('<button class="secondary" type="button" data-reset>بازنشانی</button>','reset','بازنشانی فیلترها')+'</div></form>';
}
function searchView(){
 const p=meta.dims.Region.filter(x=>x.RegionKey>0);
 const statuses=['بیمه‌پرداز','وقفه پوشش','بازنشستگی','ازکارافتادگی','بازماندگی'];
 const form=pane('فرم جست‌وجوی ممیزی‌شده','<form class="form" id="search">'+formField('نوع شناسه','searchKind','<select name="kind"><option>شناسه نمایشی</option></select>')+formField('شناسه پرونده نمونه','searchCode','<input placeholder="DEMO-0001" name="code" value="'+esc(searchDraft.code)+'" required>')+formField('وضعیت پرونده','searchStatus','<select name="status">'+option('','همه',!searchDraft.status)+statuses.map(x=>option(x,x,x===searchDraft.status)).join('')+'</select>')+formField('شعبه','searchBranch','<select name="branch">'+option('0','حوزه مجاز نقش',searchDraft.branch==='0')+p.map(x=>option(x.RegionKey,x.Branch,+searchDraft.branch===x.RegionKey)).join('')+'</select>')+control('<button type="submit">جست‌وجو</button>','search','جست‌وجو')+control('<button type="button" class="secondary" data-search-clear>پاک‌کردن</button>','clear','پاک‌کردن فرم')+'</form>'+para(searchMsg||'نمونه‌های قابل امتحان: DEMO-0001 برای بیمه‌شده نمونه و DEMO-0005 برای پرونده مستمری.'));
 const arr=[tab('پرونده‌های منطبق',results,[C('CaseCode','شناسه نمایشی'),C('DisplayName','پرونده'),columns.g,columns.status],{select:true})];
 return {cards:[V('دامنه نقش',meta.roles[role].name,'text','داده ساختگی'),V('نتیجه منطبق',results.length,'num'),V('کنترل دسترسی','فعال','text'),V('تاریخ مبنا',meta.asOf,'period')],panels:[],extra:form,tables:arr,note:'پرونده‌های این محیط ساختگی‌اند. برای جست‌وجو از شناسه پرونده نمونه استفاده کنید.'};
}
function scenarioForm(isP){
 if(!meta.roles[role].scenario)return pane('سناریوهای آماده',para('برای مقایسه، سناریو و فیلترهای گزارش را انتخاب کنید.'));
 const s=scenarioData();
 const allowed=meta.roles[role].scenario;
 const nums=(name,title,value)=>formField(title+' (٪)',name,'<input type="number" name="'+name+'" min="-30" max="30" step="0.1" value="'+value+'" required>');
 return pane('اجرای سناریو و ذخیره نسخه',para('قاعده DEMO-1.0 | دامنه تغییر: ۳۰− تا ۳۰+ درصد | ثبت همراه مبنا، اجراکننده، تاریخ اثر و نتیجه.')+
 '<form id="scenario-form" class="form">'+formField('نام سناریو','scenarioName','<input name="name" value="'+esc(s.ScenarioName+' · آزمون')+'" minlength="2" maxlength="80" required>')+formField('تاریخ اثر فرضی (میلادی)','scenarioDate','<input name="effective" type="date" value="2026-10-23" min="2026-10-23" max="2028-03-19" required>')+
 (isP?'':nums('premium','وصول',Math.round(s.PremiumRate*100)))+nums('pension','مستمری',Math.round(s.PensionRate*100))+(isP?'':nums('health','درمان',Math.round(s.HealthRate*100)))+
 control('<button type="submit"'+(!allowed?' disabled':'')+'>اجرا و ذخیره</button>','scenarioRun','اجرا و ذخیره')+'</form>'+para(!allowed?'نقش نمونه امکان اجرای سفارشی ندارد.':formMsg));
}
function runsTable(){
 const r=runs.map(x=>{let z={};try{z=JSON.parse(x.Result)}catch{}return {...x,Base:z.base,Estimate:z.scenario,Impact:z.delta}});
 return tab('دفتر اجراهای ثبت‌شده و قابل بازتولید',r,[C('RunKey','شناسه'),C('ScenarioName','نسخه سناریو'),C('BasisPeriod','دوره مبنا'),C('EffectiveDate','اثر فرضی','date'),C('Actor','اجراکننده'),C('RuleKey','قاعده','rule'),C('Base','مبنا','money'),C('Estimate','نتیجه','money'),C('Impact','اثر','money'),columns.status],trace);
}
function followForm(isP){
 if(role==='viewer')return '';
 return pane(isP?'ثبت درخواست اصلاح':'ثبت مغایرت یا درخواست تطبیق','<form id="follow-form" class="form">'+formField('مرجع','followRef','<input name="ref" value="'+esc(isP?profile.person[0].CaseCode:'QA-DEMO')+'" maxlength="80" required>')+formField('دسته','followCategory','<select name="category">'+['اصلاح سابقه','مغایرت پرداخت','کیفیت داده','تطبیق مالی','سایر'].map(x=>option(x,x,x===(isP?'اصلاح سابقه':'تطبیق مالی'))).join('')+'</select>')+formField('شرح','followDetail','<textarea name="detail" rows="2" minlength="3" maxlength="450" required></textarea>')+control('<button type="submit">ثبت و دریافت کد</button>','followSend','ثبت و دریافت کد')+'</form>'+para(formMsg||'درخواست در انبار آزمایشی ذخیره می‌شود.'));
}
function nav(){
 const r=meta.roles[role],p=r.scope!=='none';
 $('#products').innerHTML=(r.gov?withHelp('<a href="#G-00" aria-current="'+(active[0]==='G')+'">حکمرانی</a>','control','governance','حکمرانی'):'')+(p?withHelp('<a href="#P-00" aria-current="'+(active[0]==='P')+'">پروفایل فرد</a>','control','profile','پروفایل فرد'):'');
 $('#nav').innerHTML='<div class="navtitle">'+(active[0]==='G'?control('حکمرانی و پایداری مالی','governance','حکمرانی و پایداری مالی'):control('پرونده بیمه اجتماعی','profile','پرونده بیمه اجتماعی'))+'</div>'+Object.entries(titles).filter(([k])=>k[0]===active[0]).map(([k,t])=>'<div class="nav-item"><a class="navlink" href="#'+k+'"'+(k===active?' aria-current="page"':'')+'><bdi>'+k+'</bdi><span>'+esc(t)+'</span></a>'+help('page',k,t)+'</div>').join('');
}
function render(){
 facetCache.clear();
 nav();
 units=active[0]==='G'?'میلیارد ریال':'میلیون ریال';
 const ok=!((active[0]==='P'&&active!=='P-00'&&!profile)||(active[0]==='G'&&!gov));
 const d=!ok?bundle([],[],[],'',pane('در حال دریافت اطلاعات…',control('در حال آماده‌سازی گزارش','loading','دریافت داده‌ها'))):active==='P-00'?searchView():active[0]==='P'?pview(active):gview(active);
 if(profileScope&&active[0]==='P'&&['P-03','P-04'].includes(active))d.note+=' · فیلتر دوره عضویت '+num(profileScope)+' فعال است.';
 displayTables=d.tables;
 const base=(active[0]==='P'&&person&&profile?' · '+profile.person[0].CaseCode:'')+' · تاریخ مبنا '+periodLabel(+filters.to);
 const toolbar='<div class="toolbar">'+control('<button class="secondary" data-def>تعریف شاخص‌ها</button>','definitions','تعریف شاخص‌ها')+control('<button class="secondary" data-save-view>ذخیره نما</button>','save','ذخیره نما')+(view?control('<button class="secondary" data-restore>نمای ذخیره‌شده</button>','restore','نمای ذخیره‌شده'):'')+(meta.roles[role].export&&d.tables.length?control('<button data-export>خروجی CSV</button>','export','خروجی CSV'):'')+'</div>';
 $('#main').innerHTML='<div class="crumb">'+control((active[0]==='G'?'حکمرانی و پایداری مالی':'پروفایل بیمه‌ای فرد')+'  /  <bdi>'+active+'</bdi>'+esc(base),'path','مسیر و ماه مبنا')+'</div>'+
 '<div class="pagehead"><div>'+withHelp('<h1>'+esc(titles[active])+'</h1>','page',active,titles[active])+'<p>'+esc(descriptions[active])+' '+control('<span class="tag">'+units+'</span>','units','واحد مبلغ')+'</p></div>'+toolbar+'</div>'+
 filtersHTML()+kpis(d.cards)+(d.extra||'')+(d.note?'<p class="keynote">'+withHelp(esc(d.note),'page',active,'نکته و مثال این گزارش')+'</p>':'')+(d.panels.length?'<div class="twocol">'+d.panels.join('')+'</div>':'')+d.tables.map(tableHTML).join('');
}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('active');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('active'),4700)}
function modal(t,h){$('#dialog-body').innerHTML='<h2>'+esc(t)+'</h2>'+h;$('#dialog').showModal()}
function fail(message){$('#main').innerHTML='<section class="panel banner-error" role="alert">'+control('<h2>گزارش آماده نشد</h2>','retry','مشکل بارگذاری گزارش')+'<p>'+esc(message)+'</p>'+control('<button id="retry-load" type="button">تلاش دوباره</button>','retry','تلاش دوباره')+' '+control('<a href="/dashboard_2" target="_top">بازگشت به داشبورد سایت</a>','session','بازگشت به سایت')+'</section>';$('#retry-load').addEventListener('click',()=>meta?navigate():init());}
async function navigate(){
 const k=location.hash.slice(1).toUpperCase();
 let dest=titles[k]?k:'G-00';
 if(dest[0]==='G'&&!meta.roles[role].gov)dest='P-00';
 if(dest[0]==='P'&&meta.roles[role].scope==='none')dest='G-00';
 if(dest[0]==='P'&&dest!=='P-00'&&!person)dest='P-00';
 if(location.hash!=='#'+dest){location.replace('#'+dest);return}
 const token=++loadToken;
 active=dest;tableState={};formMsg='';$('#sidebar').classList.remove('active');
 if(dest[0]==='G'&&!gov){
  render();
  try{const g=await api('/api/governance');if(token!==loadToken)return;gov=g}catch(error){if(token===loadToken)fail(error.message);return}
 }
 try{
   if(dest==='G-11'||dest==='P-07'){const r=await api('/api/runs'+(dest==='P-07'?'?person='+person:''));if(token!==loadToken)return;runs=r||[]}
   if(dest==='G-12'){const r=await api('/api/followups');if(token!==loadToken)return;tickets=r||[]}
   if(dest==='G-04'&&!geometries.length){const r=await api('/iran-provinces.json');if(token!==loadToken)return;geometries=r.features||[]}
 }catch(e){toast(e.message)}
 repairFacets();render();window.scrollTo(0,0);
}
function drill(action){
 const at=action.indexOf('|'),key=action.slice(0,at),val=action.slice(at+1);
 if(key==='MembershipKey'){
  const x=profile.membership.find(r=>r.MembershipKey===+val);
  if(x)modal('دوره عضویت · '+dim('plan',x.PlanKey),mini([['آغاز',dateLabel(x.StartDate)],['پایان',x.EndDate?dateLabel(x.EndDate):'جاری'],['کارگاه',dim('party',x.PartyKey)],['مرجع',x.SourceRef]])+'<div class="listlinks">'+control('<button data-memberlink="'+x.MembershipKey+'|P-03">پرداخت‌های دوره</button>','membershipPremium','پرداخت‌های دوره')+control('<button data-memberlink="'+x.MembershipKey+'|P-04">مزایای دوره</button>','membershipBenefit','مزایای دوره')+'</div>');
 }else if(key==='ProvinceCode'){
  const selected=filters.province===val?'':val;
  applyFilter('province',selected);
  requestAnimationFrame(()=>[...document.querySelectorAll('.province-list [data-drill]')].find(el=>el.dataset.drill===action)?.focus({preventScroll:true}));
 }
 else if(key==='RegionKey'){
  filters.branch=val;filters.province=regionBy[+val]?.MapName||regionBy[+val]?.ProvinceCode||'';
  filters.city=regionBy[+val]?.CityCode||'';
  if(active==='G-04')location.hash='G-01';else {location.hash='G-04';refresh()}
 }else if(key==='Account'){
  filters.account=val;
  if(active==='G-01')refresh();else location.hash='G-01';
 }else if(key==='PlanKey'){
  filters.plan=val;
  if(active==='G-03')location.hash='G-01';else refresh();
 }else if(key==='PeriodKey'){
  filters.from=val;filters.to=val;repairFacets();refresh();
 }
}
function detailTable(t,r){
 const data=t.cols.map(column=>[column[1],showCell(r,column),column[0],column[2]]);
 if(r.SourceKey!==undefined)data.push(['منبع',dim('source',r.SourceKey)]);
 if(r.SourceRef)data.push(['نوع مدرک','سند ساختگی ثبت‌شده']);
 if(r.Result)data.push(['خروجی ثبت‌شده',r.Result],['مفروضات',r.Parameters]);
 modal('جزئیات · '+t.t,mini(data)+(r.SourceRef?'<p>شناسه مرجع: <bdi>'+esc(r.SourceRef)+'</bdi> · داده نمایشی</p>':'')+(active[0]==='P'&&active!=='P-08'?links(['P-08']):active[0]==='G'&&active!=='G-12'?links(['G-12']):''));
}
function refresh(){tableState={};render()}
function updateTable(i){const el=document.querySelector('[data-table="'+i+'"]');if(el)el.outerHTML=tableHTML(displayTables[i],i)}
function repairFacets(preferred){
 if(active[0]==='G'?!gov:!profile)return;
 facetCache.clear();
 const keys=[...activeFilters()].filter(k=>k!==preferred&&k!=='from'&&k!=='to'&&filters[k]&&filters[k]!==defaults[k]);
 for(const key of keys){
  if(!filterOptions(key).some(([v])=>String(v)===filters[key]))filters[key]=defaults[key];
 }
}
function applyFilter(key,value){
 filters[key]=value;
 if(key==='province')filters.city='';
 if(key==='city'||key==='province')filters.branch='';
 repairFacets(key);
 refresh();
}
function csvCell(v){let s=String(v??'');if(/^[=+@\t\r]/.test(s)||/^-\D/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
async function exportCSV(){
 const t=displayTables[0];if(!t)return;
 await api('/api/export-audit',{method:'POST',body:JSON.stringify({person:active[0]==='P'?person:null})});
 const raw=t.rows.map(r=>t.cols.map(c=>csvCell(c[2]==='money'||c[2]==='pct'?r[c[0]]:showCell(r,c))).join(','));
 const header=t.cols.map(c=>csvCell(c[1]+(c[2]==='money'?' (ریال)':c[2]==='pct'?' (نسبت اعشاری)':''))).join(',');
 const obj=URL.createObjectURL(new Blob(['\ufeff'+[header,...raw].join('\r\n')],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=obj;a.download='Dashboard1-'+active+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(obj),1500);
 toast('خروجی ثبت و آماده شد.');
}
const helpDialog=$('#help-dialog');
let helpTrigger;
function showHelp(kind,key,label,context,trigger){
 const topics=window.rasadHelp.resolve(active,kind,key,label,context);
 if(!topics)return;
 $('#help-title').textContent=label;
 $('#help-content').innerHTML=topics.map(({title,text})=>'<section><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p></section>').join('');
 helpTrigger=trigger;
 helpDialog.showModal();
}
helpDialog.addEventListener('close',()=>{if(helpTrigger?.isConnected)helpTrigger.focus({preventScroll:true})});
document.addEventListener('click',async ev=>{
 const el=ev.target.closest('button,[data-drill],a');
 if(!el||el.disabled)return;
 const {dataset:d}=el;
 if(d.help){
  const separator=d.help.indexOf(':');
  showHelp(d.help.slice(0,separator),d.help.slice(separator+1),d.helpLabel||el.getAttribute('aria-label').replace(/^راهنما: /,''),d.helpContext,el);
  return;
 }
 if(el.tagName==='A'&&el.hash&&$('#dialog').open)$('#dialog').close();
 try{
  if('go'in d){location.hash=d.go;return}
  if('reset'in d){for(const k of activeFilters())filters[k]=defaults[k];profileScope=null;refresh();return}
  if('paging'in d){const [i,p]=d.paging.split('|').map(Number);tableState[i]={...tableState[i],page:p};updateTable(i);return}
  if('sort'in d){const [i,j]=d.sort.split('|').map(Number),a=tableState[i]||{};tableState[i]={col:j,asc:a.col!==j||!a.asc,page:0};updateTable(i);return}
  if('drill'in d){drill(d.drill);return}
  if('row'in d){
   const [i,j]=d.row.split('|').map(Number),t=displayTables[i],r=t.rows[j];
   if(t.opts.select){
    try{const next=await api('/api/profile?person='+r.PersonKey);profile=next;person=r.PersonKey;profileScope=null;location.hash='P-01'}catch(e){toast(e.message)}
   }else if(t.opts.periodLink)drill('MembershipKey|'+r.MembershipKey);
   else if(t.opts.drill)drill(t.opts.drill+'|'+r[t.opts.drill]);
   else detailTable(t,r);
   return;
  }
  if('memberlink'in d){
   const [k,p]=d.memberlink.split('|');profileScope=+k;$('#dialog').close();location.hash=p;return;
  }
  if('def'in d){
   showHelp('page',active,'تعریف شاخص‌ها · '+titles[active],'',el);return;
  }
  if('saveView'in d){view=JSON.stringify({page:active,filters});try{localStorage.setItem('dashboard1-view',view)}catch{}render();toast('نمای جاری روی این مرورگر ذخیره شد.');return}
  if('restore'in d){const x=JSON.parse(view);filters={...defaults,...x.filters};if(active!==x.page)location.hash=x.page;else {repairFacets();refresh()}return}
  if('export'in d){await exportCSV();return}
  if('searchClear'in d){searchDraft={code:'',status:'',branch:'0'};results=[];searchMsg='';refresh();return}
  if(el.id==='menu')el.setAttribute('aria-expanded',String($('#sidebar').classList.toggle('active')));
 }catch(e){toast(e.message)}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('svg [data-drill]')){e.preventDefault();drill(e.target.dataset.drill)}});
document.addEventListener('change',event=>{
 const field=event.target;
 if(!field.matches('#filters select'))return;
 applyFilter(field.name,field.value);
 document.getElementById(field.id)?.focus({preventScroll:true});
});
document.addEventListener('submit',async ev=>{
 const form=ev.target;
 if(!['filters','search','scenario-form','follow-form'].includes(form.id))return;
 ev.preventDefault();
 if(form.id==='filters')return;
 const x=Object.fromEntries(new FormData(form));
 const button=form.querySelector('button[type="submit"],button:not([type])');
 if(button)button.disabled=true;
 try{
  if(form.id==='search'){
   searchDraft=x;
   results=await api('/api/search?'+new URLSearchParams({q:x.code,status:x.status,branch:x.branch}));
   searchMsg=results.length?'پرونده منطبق پیدا شد. برای مشاهده، آن را انتخاب کنید.':'هیچ پرونده‌ای در حوزه دسترسی انتخاب‌شده پیدا نشد.';
  }else if(form.id==='scenario-form'){
   const isP=active==='P-07';
   const result=await api('/api/scenario',{method:'POST',body:JSON.stringify({name:x.name,effective:x.effective,premium:+(x.premium||0),pension:+(x.pension||0),health:+(x.health||0),basis:+filters.to,person:isP?person:null,plan:!isP&&filters.plan!==''?+filters.plan:null})});
   runs=await api('/api/runs'+(isP?'?person='+person:''))||[];
   formMsg='اجرای '+num(result.RunKey)+' ذخیره شد. اثر: '+fmt(result.result.delta,'money')+' '+units;
   toast(formMsg);
  }else{
   const isP=active==='P-08';
   const r=await api('/api/followup',{method:'POST',body:JSON.stringify({...x,person:isP?person:null})});
   if(isP)profile=await api('/api/profile?person='+person);else tickets=await api('/api/followups')||[];
   formMsg='درخواست دریافت شد. کد پیگیری '+num(r.TicketKey);
   toast(formMsg);
  }
  refresh();
 }catch(e){toast(e.message);if(button)button.disabled=false}
});
$('#role')?.addEventListener('change',async e=>{
 role=e.target.value;profile=null;person=null;profileScope=null;gov=null;tickets=[];runs=[];results=[];searchMsg='';formMsg='';filters={...defaults};
 await navigate();
});
window.addEventListener('hashchange',()=>{if(meta)navigate().catch(e=>fail(e.message))});
async function init(){
 try{view=localStorage.getItem('dashboard1-view')||''}catch{}
 try{
  meta=await api('/api/meta');
  periods=Object.fromEntries(meta.dims.Period.map(x=>[x.PeriodKey,x]));
  regionBy=Object.fromEntries(meta.dims.Region.map(x=>[x.RegionKey,x]));
  role=meta.role||role;
  await navigate();
 }catch(e){if(e.status===401)login();else fail(e.message)}
}
function login(){
 meta=null;gov=null;profile=null;person=null;$('#nav').innerHTML='';$('#products').innerHTML='';
 $('#main').innerHTML='<section class="panel login-card">'+control('<h2>نشست شما پایان یافته است</h2>','session','نشست حساب سایت')+'<p>'+control('<a href="/dashboard_2" target="_top">ورود دوباره به سایت</a>','session','ورود دوباره به سایت')+'</p></section>';
}
init();
