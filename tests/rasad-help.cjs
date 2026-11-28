const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {gunzipSync}=require('node:zlib');
const assert=require('node:assert/strict');

const root=join(__dirname,'..','reports','rasad');
const read=file=>readFileSync(join(root,file),'utf8');
const packed=file=>JSON.parse(gunzipSync(readFileSync(join(root,file+'.json.gz'))));
const nodes=new Map();
const document={querySelector(selector){
 if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',addEventListener(){}});
 return nodes.get(selector);
},addEventListener(){}};
const window={addEventListener(){}};
const fixture={meta:packed('meta'),gov:packed('governance'),profiles:packed('profiles'),shortTerm:packed('short-term'),map:JSON.parse(read('iran-provinces.json')).features};
const run=String.raw`
meta=fixture.meta;gov={...fixture.gov,shortTermBenefit:fixture.shortTerm.shortTermBenefit};geometries=fixture.map;
periods=Object.fromEntries(meta.dims.Period.map(item=>[item.PeriodKey,item]));
regionBy=Object.fromEntries(meta.dims.Region.map(item=>[item.RegionKey,item]));
meta.roles={
 viewer:{name:'مشاهده گزارش آزمایشی',scope:'all',gov:true,scenario:false,export:false},
 analyst:{name:'تحلیل‌گر',scope:'all',gov:true,scenario:true,export:true}
};
const missing=new Set(), topics=new Set();
const resolve=window.rasadHelp.resolve;
window.rasadHelp.resolve=(page,kind,key,label,context)=>{
 const sections=resolve(page,kind,key,label,context);
 if(sections){
  assert.equal(sections.length,4,page+':'+key);
  assert.ok(sections.every(section=>section.title&&section.text),page+':'+key);
  topics.add(kind+':'+key);
 }else missing.add(kind+':'+key+' ['+label+']');
 return sections;
};
for(const account of ['1','5']){
 profile={...fixture.profiles[account],shortTermBenefits:fixture.shortTerm.profiles[account]||[]};person=Number(account);results=profile.person;
 for(const id of Object.keys(titles)){
  active=id;render();
  const html=$('#main').innerHTML;
  assert.ok(html.includes('data-help="page:'+id+'"'),id+' missing title guide');
  assert.ok($('#nav').innerHTML.includes('data-help="page:'+id+'"'),id+' missing menu guide');
  assert.ok(!/<button\b[^>]*>(?:(?!<\/button>)[\s\S])*<button\b/.test(html),id+' nested button');
 }
}
for(const access of Object.keys(meta.roles)){
 if(access==='viewer')continue;
 role=access;
 for(const id of ['G-11','G-12','P-07','P-08']){
  active=id;render();
 }
}
active='G-04';role='viewer';render();
assert.equal(($('#main').innerHTML.match(/data-help="province:/g)||[]).length,31);
active='G-13';filters={...defaults};facetCache.clear();
const reportCategory=gov.shortTermBenefit[0].BenefitTypeCode;
assert.ok(filterOptions('supportType').some(([code])=>code===reportCategory));
filters.supportType=reportCategory;facetCache.clear();
const governed=gview(active);
const governancePaid=gov.shortTermBenefit.filter(row=>row.BenefitTypeCode===reportCategory).reduce((amount,row)=>amount+row.PaidAmount,0);
assert.equal(governed.cards[0].v,governancePaid);
assert.equal(governed.tables[0].rows.length,1);
assert.ok(governed.cards[3].v>0,'support type filter must not remove separate healthcare spend');
person=1;profile={...fixture.profiles['1'],shortTermBenefits:fixture.shortTerm.profiles['1']};
active='P-04';filters={...defaults};facetCache.clear();
const shortTerm=profile.shortTermBenefits, paidShortTerm=shortTerm.filter(row=>row.Status==='Paid');
const shortTermGross=paidShortTerm.reduce((amount,row)=>amount+row.PaidAmount,0);
const shortTermIncrement=paidShortTerm.filter(row=>row.LegacyBenefitKey==null).reduce((amount,row)=>amount+row.PaidAmount,0);
const shortTermTitle='پرداخت مزایای کوتاه‌مدت';
const shortTermTable=report=>report.tables.find(table=>table.t==='ریز پرونده‌ها و پرداخت‌های مزایای کوتاه‌مدت').rows;
const baseBenefitFund=profile.benefit.reduce((amount,row)=>amount+row.Fund,0);
assert.equal(shortTermTable(pview(active)).length,shortTerm.length);
assert.equal(pview(active).cards.find(card=>card.t===shortTermTitle).v,shortTermGross);
assert.ok(filterOptions('kind').some(([value])=>value==='مزایای کوتاه‌مدت'));
filters.status='در انتظار رسیدگی';facetCache.clear();
assert.ok(shortTermTable(pview(active)).length>0);
assert.ok(shortTermTable(pview(active)).every(row=>row.ShortTermPaidDate===null));
assert.equal(pview(active).cards.find(card=>card.t===shortTermTitle).v,0);
filters={...defaults,kind:'مزایای کوتاه‌مدت',dateBasis:'پرداخت'};facetCache.clear();
assert.equal(shortTermTable(pview(active)).length,paidShortTerm.length);
assert.deepEqual(new Set(shortTermTable(pview(active)).map(row=>row.BenefitTypeCode)),new Set(paidShortTerm.map(row=>row.BenefitTypeCode)));
for(const [page,label] of [['P-01','مزایای سهم صندوق'],['P-06','مزایای دریافت‌شده']]){
 active=page;filters={...defaults};
 assert.equal(pview(page).cards.find(card=>card.t===label).v,baseBenefitFund+shortTermIncrement);
}
active='P-09';filters={...defaults};render();
assert.equal(pview(active).cards.find(card=>card.t===shortTermTitle).v,shortTermGross);
assert.match($('#main').innerHTML,/data-help="field:CashCategory"/);
assert.ok(window.rasadAudience.resolve(window.rasadGuide.entry('P-04','field','ShortTermPaidInRange','مبلغ پرداخت‌شده کوتاه‌مدت','money')).specific);
for(const match of source.matchAll(/data-help="control:([^"]+)"/g))assert.ok(resolve('G-00','control',match[1]),match[1]);
assert.match(resolve('G-05','field','Rate','نرخ','pct')[0].text,/وصول ÷ جمع مطالبه/);
assert.match(resolve('P-01','metric','روز پوشش یکتا')[0].text,/۱۰ روز/);
const target=window.rasadGuide.entry('P-09','field','CurrentRials','ریال با نرخ مرجع','num');
assert.match(window.rasadGuide.href(target),/#topic-P-09~field~CurrentRials/);
assert.match(target.sections[2].text,/۶۰۰ میلیون/);
assert.deepEqual([...missing],[]);
for(const page of Object.keys(titles)){
 const record=window.rasadAudience.resolve(window.rasadGuide.entry(page,'page',page,titles[page]));
 assert.equal(record.specific,true,page);
 assert.equal(record.plain.length,2,page);
 assert.equal(record.finance.length,2,page);
 assert.equal(record.engineering.length,1,page);
 assert.ok(record.flow.length>=3,page);
 assert.notEqual(record.plain[0].text,record.finance[0].text,page);
}
const financeField=(page,key,label)=>window.rasadAudience.resolve(window.rasadGuide.entry(page,'field',key,label,'money'));
const expected=financeField('G-05','Expected','مورد انتظار'),assessed=financeField('G-05','Assessed','تشخیص‌شده');
assert.ok(expected.specific&&assessed.specific);
assert.notEqual(expected.engineering[0].text,assessed.engineering[0].text);
const cash=financeField('G-02','Forecast','پیش‌بینی'),budget=financeField('G-09','Forecast','پیش‌بینی');
assert.ok(cash.specific&&budget.specific);
assert.notEqual(cash.engineering[0].text,budget.engineering[0].text);
const erd=window.rasadGuideErd;
assert.equal(new Set(erd.groups.flatMap(group=>group[1])).size,29);
assert.equal(erd.relationships.length,74);
assert.deepEqual(erd.relationships.find(edge=>edge[2]==='LegacyBenefitKey'),['dw.Benefit','dw.ShortTermPayment','LegacyBenefitKey',false]);
for(const [parent,child,key] of erd.relationships){
 assert.ok(erd.tables[parent]&&erd.tables[child],parent+' → '+child);
 assert.ok(erd.tables[child][1].some(([,column,role])=>column===key&&role?.includes('FK')),child+'.'+key);
}
return {pages:Object.keys(titles).length,topics:topics.size};
`;
const app=read('app.js').replace(/\binitGuideMode\(\);\s*init\(\);\s*$/,'');
const result=Function('document','window','fixture','assert','source',[
 read('pages.js'),read('help-reports.js'),read('help.js'),read('help-topics.js'),read('guide-governance.js'),read('guide-profiles.js'),read('guide-tracks.js'),read('guide-erd.js'),read('profile-math.js'),read('profile-insights.js'),app,run
].join('\n'))(document,window,fixture,assert,read('index.html'));
console.log('Help verified for',result.pages,'reports and',result.topics,'distinct topics.');
