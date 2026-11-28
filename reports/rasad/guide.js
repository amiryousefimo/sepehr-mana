(() => {
 'use strict';
 const book=window.rasadReportHelp,guide=window.rasadGuide,audience=window.rasadAudience;
 const headingKeys=['سؤال','مسیر داده','مثال','کار با صفحه'];
 const nav=document.querySelector('#book-nav'),main=document.querySelector('#book-main'),search=document.querySelector('#guide-search');
 const names={PeriodKey:'ماه',Balance:'تراز',Rate:'نرخ وصول',Paid:'وصول یا پرداخت',RegionKey:'شعبه',Insured:'بیمه‌پرداز',Retired:'مستمری‌بگیر',Debt:'مانده',MemberShare:'سهم فرد',Fund:'سهم صندوق',CashDate:'تاریخ وجه'};
 const captions=Object.fromEntries(Object.values(columns).map(([key,label])=>[key,label]));
 const dom=(tag,value)=>Object.assign(document.createElement(tag),{textContent:value??''});
 const readable=key=>guide.profileFields[key]?.[0]||names[key]||captions[key]||key;
 const tech=guide.entry('G-00','page','G-00','ERD و مسیر داده');
 const erd={...tech,id:'erd',label:'ERD و مسیر داده'};
 const chapterAnchors=Object.keys(titles).map(page=>guide.entry(page,'page',page,titles[page]));
 const aliases=[
  ['G-05','Expected','حق‌بیمه مورد انتظار'],['G-05','Assessed','حق‌بیمه تشخیص‌شده'],
  ['G-02','Forecast','پیش‌بینی مانده نقد'],['G-09','Forecast','پیش‌بینی بودجه'],
  ['P-09','CurrentRials','ریال با نرخ مرجع']
 ].map(([page,key,label])=>guide.entry(page,'field',key,label));
 const entries=[
  ...aliases,
  ...chapterAnchors,
  ...Object.entries(book).flatMap(([page,contents])=>Object.keys(contents).filter(key=>!headingKeys.includes(key)).map(key=>guide.entry(page,'panel',key,key))),
  ...[...new Set([...Object.keys(guide.original.fields),...Object.keys(guide.profileFields)])].map(key=>guide.entry(guide.profileFields[key]?'P-09':'G-00','field',key,readable(key))),
  ...[...new Set([...Object.keys(guide.original.metrics),...Object.keys(guide.original.metricKeys),...Object.keys(guide.profileMetrics)])].map(key=>guide.entry(guide.profileMetrics[key]?'P-10':'G-00','metric',key,key)),
  ...Object.keys(guide.original.controls).map(key=>guide.entry('P-00','control',key,key))
 ].filter(item=>item.sections);
 const records=[...new Map(entries.slice().reverse().map(item=>[item.id,item])).values()].reverse();
 function link(entry){
  const element=dom('a',entry.label);
  element.href='#'+encodeURIComponent(entry.id);
  return element;
 }
 function section(label,paragraph){
  const element=dom('section');
  element.append(dom('h3',label),dom('p',paragraph));
  return element;
 }
 function listing(heading,entries){
  const group=dom('section');
  group.append(dom('h3',heading));
  const links=dom('ul');
  for(const entry of entries){
   const item=dom('li');item.append(link(entry));links.append(item);
  }
  group.append(links);return group;
 }
 function decoded(value){try{return decodeURIComponent(value)}catch{return ''}}
 function activeEntry(){
  const fragment=decoded(location.hash.slice(1));
  if(!fragment)return null;
  const params=new URLSearchParams(location.search),label=params.get('label'),context=params.get('context')||'';
  if(fragment==='erd')return erd;
  const exact=records.find(entry=>entry.id===fragment);
  if(exact&&!label&&!context)return exact;
  if(!fragment.startsWith('topic-'))return exact||null;
  const [page,kind,key]=fragment.slice(6).split('~').map(decoded);
  if(!Object.hasOwn(titles,page)||!Object.hasOwn(guide.kinds,kind)||!key)return null;
  const entry=guide.entry(page,kind,key,label||readable(key),context);
  return entry.sections?entry:null;
 }
 function drawIndex(){
  const normalized=value=>value.toLocaleLowerCase('fa').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\s\u200c-]+/g,'');
  const needle=normalized(search.value.trim());
  if(needle){
   const hits=value=>normalized(value).includes(needle);
   const exact=[erd,...records].filter(entry=>hits(entry.label+' '+entry.key));
   const used=new Set(exact.map(entry=>entry.id));
   const matches=[...exact,...records.filter(entry=>!used.has(entry.id)&&Object.values(audience.resolve(entry)).some(track=>Array.isArray(track)&&track.some(item=>item.text&&hits(item.text))))];
   nav.replaceChildren(matches.length?listing('نتایج جست‌وجو',matches.slice(0,45)):dom('p','نتیجه‌ای پیدا نشد. عبارتی کوتاه‌تر امتحان کنید.'));
   return;
  }
  nav.replaceChildren(listing('از اینجا شروع کنید',[erd,...aliases]),listing('حکمرانی و پایداری مالی',chapterAnchors.filter(item=>item.page[0]==='G')),listing('پرونده بیمه اجتماعی',chapterAnchors.filter(item=>item.page[0]==='P')));
 }
 function render(){
  const entry=activeEntry();
  const card=dom('article');
  card.className='book-card';
  if(entry?.id==='erd'){
   card.append(dom('h2',entry.label),window.rasadErdView.draw());
  }else if(!entry){
   card.append(dom('h2','از کجا شروع کنم؟'),section('فرق سه بخش چیست؟','«توضیح ساده» با یک مثال کوتاه مفهوم را روشن می‌کند. «برای مدیر مالی» می‌گوید با عدد چه تصمیمی بگیرید و کجا ممکن است اشتباه کنید. «برای مهندس» نام جدول، مرحلهٔ محاسبه و راه رسیدن به صفحه را نشان می‌دهد.'),section('داخل گزارش هم همین راهنما هست','«نیاز به راهنمایی دارم» را بزنید، سپس علامت سؤال کنار همان ستون یا نمودار را انتخاب کنید.'),listing('اصطلاح‌های مهم و مسیر داده',[...aliases,erd]),listing('نمونه‌های پیشنهادی',chapterAnchors.filter(item=>['P-00','P-09','P-10','G-00'].includes(item.page))));
  }else{
   card.id=entry.id;
   card.append(dom('small',entry.page+' · '+guide.kinds[entry.kind]),dom('h2',entry.label));
   card.append(audience.buildReader(entry));
   if(entry.kind==='page'){
    const related=records.filter(item=>item.page===entry.page&&item.kind==='panel');
    if(related.length)card.append(listing('نمودارها و جدول‌های این گزارش',related));
   }else card.append(listing('ادامه در فصل گزارش',chapterAnchors.filter(item=>item.page===entry.page)));
   card.append(listing('منشأ جدول‌ها',[erd]));
  }
  main.replaceChildren(card);
  window.scrollTo(0,0);
 }
 search.addEventListener('input',drawIndex);
 document.addEventListener('click',event=>{
  if(location.search&&event.target.closest('a[href^="#"]')){
   event.preventDefault();
   location.assign(location.pathname+event.target.closest('a').hash);
  }
 });
 window.addEventListener('hashchange',render);
 drawIndex();render();
})();
