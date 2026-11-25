const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const root=join(__dirname,'..','reports','rasad');
const scripts=['pages.js','help-reports.js','help.js','help-topics.js'].map(file=>readFileSync(join(root,file),'utf8'));
const index=Function('window',scripts.join('\n')+'\nreturn {titles,books:window.rasadReportHelp,fields:window.rasadGuide.profileFields};')({});
process.stdout.write(JSON.stringify(index));
