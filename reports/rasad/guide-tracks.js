(() => {
 'use strict';
 const tracks={
  plain:{label:'توضیح ساده',caption:'با مثال روزمره و بدون اصطلاح فنی'},
  finance:{label:'برای مدیر مالی',caption:'تعریف، تفسیر و تصمیم'},
  engineering:{label:'برای مهندس',caption:'منشأ، ریزدانه و مسیر داده'}
 };
 const findBook=page=>page[0]==='P'?window.rasadProfileGuide:window.rasadGovernanceGuide;
 const globals=()=>[window.rasadGovernanceGuide,window.rasadProfileGuide].filter(Boolean);
 function terms(page,key,label,mapped){
  const primary=findBook(page)?.terms||{};
  const names=[key,label,mapped].filter(Boolean);
  for(const name of names)if(primary[page+':'+name])return primary[page+':'+name];
  for(const book of [findBook(page),...globals()]){
   for(const name of names)if(book?.terms?.[name])return book.terms[name];
  }
 }
 function unique(items){
  const seen=new Set();
  return items.filter(item=>item.text&&!seen.has(item.text.trim())&&seen.add(item.text.trim()));
 }
 function resolve(entry){
  const {page,kind,key,label,context,sections}=entry;
  if(!sections)return null;
  const base=window.rasadGuide.original;
  const catalog=findBook(page);
  const report=catalog?.reports?.[page];
  const term=kind==='page'?report:key==='Paid'&&context==='date'?null:terms(page,key,label,base.metricKeys[key]||base.filterKeys[key]);
  const specific=Boolean(term);
  let plain,example,finance,decision,engineering,flow;
  if(term)({plain,example,finance,decision,engineering,flow}=term);
  else{
   const isColumn=['field','series','detail'].includes(kind);
   const metadata=window.rasadGuide.profileFields[key];
   plain=sections[0].text;
   example=metadata?.[3]||sections[2].text;
   if(example===window.rasadReportHelp[page]?.['مثال']||example===plain)example='';
   if(isColumn){
    finance=metadata?.[1]||base.fields[key]||plain;
    engineering=metadata?.[2]||('کلید دادهٔ نمایشی: '+key+'. نگاشت ستون و قالب نمایش را در تعریف همین جدول در pages.js یا profile-insights.js بررسی کنید.');
    decision='برای ردیابی، همین ستون را همراه مرجع ردیف و مبنای زمانی جدول بخوانید.';
    flow=metadata?[]:report?.flow;
   }else if(kind==='panel'||kind==='metric'){
    finance=sections[0].text;
    decision=sections[3].text===window.rasadReportHelp[page]?.['کار با صفحه']?'':sections[3].text;
    engineering='تعریف این '+window.rasadGuide.kinds[kind]+' در سازندهٔ گزارش '+page+' با شناسه «'+key+'» است. مسیر زیر منشأ کل گزارش است؛ هر عدد فقط ورودی‌های لازم خودش را مصرف می‌کند.';
    flow=report?.flow;
   }else{
    finance='';
    engineering=kind==='filter'?'فیلتر '+key+' در تنظیمات صفحهٔ '+page+'؛ مقدار انتخابی دامنهٔ قابل مشاهده را تعیین می‌کند.':kind==='control'?'کنترل '+key+' در رابط گزارش؛ عمل آن را در app.js یا profile-insights.js دنبال کنید.':'برچسب '+key+' در رابط گزارش '+page+'.';
   }
  }
  return {
   plain:unique([{title:'به زبان ساده',text:plain},{title:'یک مثال',text:example}]),
   finance:unique([{title:'تعریف و روش خواندن',text:finance},{title:'کاربرد و نتیجه‌گیری',text:decision}]),
   engineering:unique([{title:specific?'منشأ و روش ساخت':'ردگیری در پیاده‌سازی',text:engineering}]),
   flow:flow||[],specific
  };
 }
 function block(tag,text){return Object.assign(document.createElement(tag),{textContent:text||''});}
 function drawFlow(items,note){
  const group=block('figure');group.className='guide-flow';
  group.append(block('figcaption',note||'مسیر داده؛ از ورودی تا نمایش'));
  const list=block('ol');
  items.forEach(item=>list.append(block('li',item)));
  group.append(list);
  return group;
 }
 function buildReader(entry,initial='plain'){
  const result=resolve(entry),region=block('div');
  region.className='guide-reader';
  const choices=block('div');choices.className='guide-choices';choices.setAttribute('role','group');choices.setAttribute('aria-label','نوع توضیح');
  const content=block('div');content.className='guide-track-content';content.setAttribute('aria-live','polite');
  const buttons={};
  for(const [key,track] of Object.entries(tracks)){
   const button=block('button',track.label);button.type='button';button.title=track.caption;
   button.addEventListener('click',()=>show(key));choices.append(button);buttons[key]=button;
  }
  function show(key){
   const selected=Object.hasOwn(tracks,key)?key:'plain';
   Object.entries(buttons).forEach(([item,button])=>button.setAttribute('aria-pressed',String(item===selected)));
   content.replaceChildren();
   if(!result)return;
   for(const item of result[selected]){
    const section=block('section');section.append(block('h3',item.title),block('p',item.text));content.append(section);
   }
   if(selected==='finance'&&!result.finance.length)content.append(block('p','این بخش یک کنترل یا برچسب است و محاسبهٔ مالی مستقلی ندارد.'));
   if(selected==='engineering'&&result.flow.length)content.append(drawFlow(result.flow));
   if(entry.kind!=='page'&&!result.specific&&selected!=='plain'){
    const link=block('a','دیدن توضیح همین بخش در فصل گزارش');link.href=window.rasadGuide.href(window.rasadGuide.entry(entry.page,'page',entry.page,titles[entry.page]));
    link.target='_blank';link.rel='noopener';content.append(link);
   }
  }
  region.append(choices,content);show(initial);
  return region;
 }
 window.rasadAudience={tracks,resolve,drawFlow,buildReader,terms};
})();
