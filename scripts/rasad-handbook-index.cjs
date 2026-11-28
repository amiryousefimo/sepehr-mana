const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const root=join(__dirname,'..','reports','rasad');
const scripts=['pages.js','help-reports.js','help.js','help-topics.js','guide-governance.js','guide-profiles.js','guide-tracks.js','guide-erd.js'].map(file=>readFileSync(join(root,file),'utf8'));
const index=Function('window','module',scripts.join('\n')+`\n
 const catalog=[window.rasadGovernanceGuide,window.rasadProfileGuide];
 const guides=Object.fromEntries(Object.keys(titles).map(page=>[page,window.rasadAudience.resolve(window.rasadGuide.entry(page,'page',page,titles[page]))]));
 const reference=catalog.map(book=>{
   const unique=new Map();
   for(const [key,data] of Object.entries(book.terms)){
     const fingerprint=JSON.stringify(data);
     if(!unique.has(fingerprint))unique.set(fingerprint,{keys:[],data});
     unique.get(fingerprint).keys.push(key);
   }
   return [...unique.values()];
 });
 return {titles,guides,terms:catalog.map(book=>book.terms),reference,erd:window.rasadGuideErd};
`)({},undefined);
process.stdout.write(JSON.stringify(index));
