import {spawn} from 'node:child_process';
const children=[];
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;process.exitCode=code;for(const child of children)child.kill('SIGTERM');setTimeout(()=>process.exit(code),1000).unref();}
for(const [command,args] of [['/opt/didban-venv/bin/python',['didban/production.py']],['node',['server.js']]]){
  const child=spawn(command,args,{stdio:'inherit',env:{...process.env,WORKBENCH_DATA:process.env.WORKBENCH_DATA||'/app/data/didban',WORKBENCH_PREFIX:'/didban'}});
  children.push(child);child.on('error',()=>stop(1));child.on('exit',code=>stop(code||1));
}
process.on('SIGTERM',()=>stop());process.on('SIGINT',()=>stop());
