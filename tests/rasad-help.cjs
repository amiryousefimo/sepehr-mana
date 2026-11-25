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
const fixture={meta:packed('meta'),gov:packed('governance'),profiles:packed('profiles'),map:JSON.parse(read('iran-provinces.json')).features};
const run=String.raw`
meta=fixture.meta;gov=fixture.gov;geometries=fixture.map;
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
 profile=fixture.profiles[account];person=Number(account);results=profile.person;
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
for(const match of source.matchAll(/data-help="control:([^"]+)"/g))assert.ok(resolve('G-00','control',match[1]),match[1]);
assert.match(resolve('G-05','field','Rate','نرخ','pct')[0].text,/وصول ÷ جمع مطالبه/);
assert.match(resolve('P-01','metric','روز پوشش یکتا')[0].text,/۱۰ روز/);
const target=window.rasadGuide.entry('P-09','field','CurrentRials','ریال با نرخ مرجع','num');
assert.match(window.rasadGuide.href(target),/#topic-P-09~field~CurrentRials/);
assert.match(target.sections[2].text,/۶۰۰ میلیون/);
assert.deepEqual([...missing],[]);
return {pages:Object.keys(titles).length,topics:topics.size};
`;
const app=read('app.js').replace(/\binitGuideMode\(\);\s*init\(\);\s*$/,'');
const result=Function('document','window','fixture','assert','source',[
 read('pages.js'),read('help-reports.js'),read('help.js'),read('help-topics.js'),read('profile-math.js'),read('profile-insights.js'),app,run
].join('\n'))(document,window,fixture,assert,read('index.html'));
console.log('Help verified for',result.pages,'reports and',result.topics,'distinct topics.');
