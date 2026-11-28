(() => {
 'use strict';
 const model=window.rasadGuideErd;
 const el=(tag,text)=>Object.assign(document.createElement(tag),{textContent:text||''});
 const relationLine=([parent,child,key,required])=>parent+'  '+(required?'1':'0..1')+' ── 0..*  '+child+'  ·  '+key;
 const sample={
  'قرارداد پرونده و پرداخت':['ref.Province → ref.City → ref.Branch','dw.Region → dw.Person → dw.Membership','dw.Membership → dw.Premium / dw.Benefit'],
  'مسیر دفتر تا داشبورد':['dw.Ledger / dw.Premium / dw.Benefit','bi.Finance / bi.Premium / bi.Benefit و سرویس محلی آزمایشی','بستهٔ فشرده → API محافظت‌شده سایت → گزارش'],
  'خانواده در دادهٔ وب':['dw.Person در بستهٔ پروفایل','lib/rasad-family.ts → household و coverageHistory','P-09: عضو تبعی ۱ به چند ردیف پرداخت؛ دادهٔ نمونهٔ تکمیلی سایت']
 };
 function makeRelationshipView(){
  const section=el('section'),label=el('label','نمایش رابطه‌های جدول'),select=el('select');
  label.htmlFor='erd-table';select.id='erd-table';
  for(const table of Object.keys(model.tables).sort()){
   const option=el('option',table);option.value=table;select.append(option);
  }
  select.value='dw.Membership';
  const diagram=el('div');diagram.className='erd-diagram';diagram.setAttribute('aria-live','polite');
  function refresh(){
   const name=select.value;
   const describe=(heading,rows,parentSide)=>{
    const card=el('div');card.append(el('h4',heading));
    if(!rows.length)card.append(el('p','در این سمت رابطه‌ای ثبت نشده است.'));
    for(const row of rows){
     const box=el('div');box.className='erd-edge';
     const code=el('code',row[parentSide?0:1]);code.dir='ltr';
     const caption=el('small',row[2]+' · '+(row[3]?'۱':'۰..۱')+' به ۰..*');
     box.append(code,caption);card.append(box);
    }
    return card;
   };
   const center=el('div');center.className='erd-center';
   const code=el('code',name);code.dir='ltr';
   center.append(el('small','جدول انتخاب‌شده'),code,el('p',model.tables[name][0]));
   diagram.replaceChildren(describe('۱. والدها',model.relationships.filter(row=>row[1]===name),true),center,describe('۳. فرزندان',model.relationships.filter(row=>row[0]===name),false));
  }
  select.addEventListener('change',refresh);refresh();
  section.append(label,select,diagram);
  return section;
 }
 function draw(){
  const fragment=document.createDocumentFragment();
  const lead=el('p','این بخش دو مدل جدا دارد: رابطه‌های واقعی پایگاه SS_GOV_DW_1 و مسیر انتقال به گزارش سایت. در SQL، ۱ به چند یعنی یک ردیف مرجع می‌تواند به صفر یا چند ردیف فرزند وصل شود. ۰..۱ یعنی کلید خارجی فرزند می‌تواند خالی باشد.');
  fragment.append(lead);
  for(const [name,nodes] of Object.entries(sample))fragment.append(window.rasadAudience.drawFlow(nodes,name));
  fragment.append(el('h3','مدل فیزیکی SQL: '+new Intl.NumberFormat('fa').format(Object.keys(model.tables).length)+' جدول و '+new Intl.NumberFormat('fa').format(model.relationships.length)+' پیوند'));
  fragment.append(makeRelationshipView());
  for(const [title,names] of model.groups){
   const box=el('section');box.append(el('h3',title));
   const grid=el('div');grid.className='erd-grid';
   for(const name of names){
    const [description,fields]=model.tables[name];
    const node=el('details');node.className='erd-node';node.id='erd-'+name.replace('.','-');
    const summary=el('summary');const code=el('code',name);code.dir='ltr';summary.append(code,el('span',description));node.append(summary);
    const attrs=el('ul');attrs.className='erd-list';
    for(const [type,key,role] of fields){
     const attr=el('li',[key,type,role].filter(Boolean).join(' · '));attr.dir='ltr';attrs.append(attr);
    }
    const edges=el('ul');edges.className='erd-list';
    for(const relationship of model.relationships.filter(edge=>edge[1]===name)){
     const line=el('li',relationLine(relationship));line.dir='ltr';edges.append(line);
    }
    node.append(el('h4','ستون‌ها و کلیدها'),attrs);
    if(edges.children.length)node.append(el('h4','پیوندهایی که این جدول در آنها فرزند است'),edges);
    grid.append(node);
   }
   box.append(grid);fragment.append(box);
  }
  const all=el('details');all.className='erd-node';all.append(el('summary','فهرست یک‌جای تمام کلیدهای خارجی'));
  const edges=el('ul');edges.className='erd-list';
  for(const relationship of model.relationships){const line=el('li',relationLine(relationship));line.dir='ltr';edges.append(line);}
  all.append(edges);fragment.append(all);
  return fragment;
 }
 window.rasadErdView={draw};
})();
