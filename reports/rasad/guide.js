(() => {
 'use strict';
 const book=window.rasadReportHelp,guide=window.rasadGuide;
 const headingKeys=['سؤال','مسیر داده','مثال','کار با صفحه'];
 const nav=document.querySelector('#book-nav'),main=document.querySelector('#book-main'),search=document.querySelector('#guide-search');
 const names={PeriodKey:'ماه',Balance:'تراز',Rate:'نرخ وصول',Paid:'وصول یا پرداخت',RegionKey:'شعبه',Insured:'بیمه‌پرداز',Retired:'مستمری‌بگیر',Debt:'مانده',MemberShare:'سهم فرد',Fund:'سهم صندوق',CashDate:'تاریخ وجه'};
 const captions=Object.fromEntries(Object.values(columns).map(([key,label])=>[key,label]));
 const dom=(tag,value)=>Object.assign(document.createElement(tag),{textContent:value??''});
 const readable=key=>guide.profileFields[key]?.[0]||names[key]||captions[key]||key;
 const chapterAnchors=Object.keys(titles).map(page=>guide.entry(page,'page',page,titles[page]));
 const records=[
  ...chapterAnchors,
  ...Object.entries(book).flatMap(([page,contents])=>Object.keys(contents).filter(key=>!headingKeys.includes(key)).map(key=>guide.entry(page,'panel',key,key))),
  ...[...new Set([...Object.keys(guide.original.fields),...Object.keys(guide.profileFields)])].map(key=>guide.entry(guide.profileFields[key]?'P-09':'G-00','field',key,readable(key))),
  ...[...new Set([...Object.keys(guide.original.metrics),...Object.keys(guide.original.metricKeys),...Object.keys(guide.profileMetrics)])].map(key=>guide.entry(guide.profileMetrics[key]?'P-10':'G-00','metric',key,key)),
  ...Object.keys(guide.original.controls).map(key=>guide.entry('P-00','control',key,key))
 ].filter(item=>item.sections);
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
  const exact=records.find(entry=>entry.id===fragment);
  if(exact&&!label&&!context)return exact;
  if(!fragment.startsWith('topic-'))return exact||null;
  const [page,kind,key]=fragment.slice(6).split('~').map(decoded);
  if(!Object.hasOwn(titles,page)||!Object.hasOwn(guide.kinds,kind)||!key)return null;
  const entry=guide.entry(page,kind,key,label||readable(key),context);
  return entry.sections?entry:null;
 }
 function drawIndex(){
  const needle=search.value.trim().toLocaleLowerCase('fa').replaceAll('\u200c',' ');
  const normalized=value=>value.toLocaleLowerCase('fa').replaceAll('\u200c',' ');
  if(needle){
   const matches=records.filter(entry=>normalized(entry.label+' '+entry.key+' '+entry.sections.map(item=>item.text).join(' ')).includes(needle)).slice(0,45);
   nav.replaceChildren(matches.length?listing('نتایج جست‌وجو',matches):dom('p','نتیجه‌ای پیدا نشد. عبارتی کوتاه‌تر امتحان کنید.'));
   return;
  }
  nav.replaceChildren(listing('حکمرانی و پایداری مالی',chapterAnchors.filter(item=>item.page[0]==='G')),listing('پرونده بیمه اجتماعی',chapterAnchors.filter(item=>item.page[0]==='P')));
 }
 function render(){
  const entry=activeEntry();
  const card=dom('article');
  card.className='book-card';
  if(!entry){
   card.append(dom('h2','از کجا شروع کنم؟'),section('راهنما را همان‌جا باز کنید','از بالای گزارش «نیاز به راهنمایی دارم» را بزنید. علامت سؤال ظاهر می‌شود. از پنجره راهنما می‌توانید مستقیم به توضیح تکمیلی همان موضوع بروید.'),section('اول یک نمونه ببینید','در بخش پروفایل فرد، DEMO-0001 را جست‌وجو کنید. از نمای پرونده وارد پوشش و حساب مالی خانواده یا سناریوی بازنشستگی شوید.'),section('مبلغ، تاریخ و اعداد خالی','دادهٔ پرونده‌ها آزمایشی است. مبلغ اسمی با ارزش معادل طلا و با حقوق ماهانه فرق دارد. برای مقایسه، مبنا و واحد یکسان انتخاب کنید. خط تیره یعنی مقدار قابل محاسبه یا ثبت‌شده در دست نیست.'),listing('نمونه‌های پیشنهادی',chapterAnchors.filter(item=>['P-00','P-09','P-10','G-00'].includes(item.page))));
  }else{
   card.id=entry.id;
   card.append(dom('small',entry.page+' · '+guide.kinds[entry.kind]),dom('h2',entry.label));
   for(const item of entry.sections)card.append(section(item.title,item.text));
   if(entry.kind==='page'){
    const related=records.filter(item=>item.page===entry.page&&item.kind==='panel');
    if(related.length)card.append(listing('نمودارها و جدول‌های این گزارش',related));
   }else card.append(listing('ادامه در فصل گزارش',chapterAnchors.filter(item=>item.page===entry.page)));
   const supplement={
    'P-09':'پوشش بر اساس روز یکتا و گروه نوع سابقه است. گردش نقدی تا تاریخ بسته قطع می‌شود. نرخ ماه از قیمت پایانی همان ماه است و نرخ مرجع تاریخ مستقل دارد. هیچ درخواست عضویت یا پرونده‌ای به منبع قیمت فرستاده نمی‌شود.',
    'P-10':'این مدل استحقاق بازنشستگی را تعیین نمی‌کند. در سوابق ناقص، تنها ماه‌های مزددار وارد برآورد می‌شوند. برای رقم رسمی باید پرونده و مقررات جاری توسط سازمان بررسی شود.'
   };
   const practical=supplement[entry.page]||(entry.kind==='field'?'این عنوان ممکن است در چند جدول تکرار شود. تفاوت تاریخ پرداخت با تاریخ تعلق و فرق عدد خام با رقم تجمیعی را در فصل گزارش راهنما دنبال کنید.':'در صورت نیاز، از جدول ریز گزارش مرجع سطر را پیدا کنید. برای مقایسهٔ دو نما، فیلتر و واحد را یکسان نگه دارید.');
   card.append(section('برای بررسی دقیق‌تر',practical));
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
