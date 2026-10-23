import {spawn,execFile} from 'node:child_process';
import {stat} from 'node:fs/promises';
import path from 'node:path';
import {createInterface} from 'node:readline';
export async function cliCommand(executable:string,kind:'codex'|'claude'):Promise<{file:string;args:string[];env:NodeJS.ProcessEnv}>{
 if(/\.(cmd|bat)$/i.test(executable)){
  const entry=path.join(path.dirname(executable),'node_modules',kind==='codex'?'@openai/codex/bin/codex.js':'@anthropic-ai/claude-code/cli.js');
  if(!(await stat(entry)).isFile())throw Error('unsupported-launcher');
  return {file:process.execPath,args:[entry],env:{...process.env,ELECTRON_RUN_AS_NODE:'1'}};
 }
 if(!/\.exe$/i.test(executable))throw Error('unsupported-launcher');
 return {file:executable,args:[],env:{...process.env}};
}
function terminate(pid:number|undefined){if(!pid)return;if(process.platform==='win32')execFile('taskkill.exe',['/pid',String(pid),'/t','/f'],{windowsHide:true},()=>{});else try{process.kill(pid)}catch{}}
export async function codexStatus(executable:string,signal:AbortSignal):Promise<{account:any;limits:any}>{
 const cmd=await cliCommand(executable,'codex');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{
  const child=spawn(cmd.file,[...cmd.args,'app-server','--listen','stdio://'],{stdio:['pipe','pipe','pipe'],windowsHide:true,env:cmd.env});
  let done=false;const pending=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void}>();let sequence=0,total=0;
  const lines=createInterface({input:child.stdout});
  const finish=(error?:Error,result?:{account:any;limits:any})=>{if(done)return;done=true;clearTimeout(timer);signal.removeEventListener('abort',abort);lines.close();child.stdin.end();terminate(child.pid);for(const p of pending.values())p.reject(Error('closed'));pending.clear();error?reject(error):resolve(result!)};
  const abort=()=>finish(Error('aborted'));const timer=setTimeout(()=>finish(Error('timeout')),20000);signal.addEventListener('abort',abort,{once:true});
  child.on('error',()=>finish(Error('launcher-failed')));child.on('exit',()=>{if(!done)finish(Error('cli-exited'))});
  // Never log CLI stderr or pass it through IPC; it may contain account details.
  child.stderr.on('data',()=>{});
  const send=(method:string,params:unknown)=>new Promise<any>((res,rej)=>{const id=++sequence;pending.set(id,{resolve:res,reject:rej});child.stdin.write(JSON.stringify({id,method,params})+'\n')});
  child.stdin.on('error',()=>finish(Error('cli-exited')));
  lines.on('line',line=>{total+=line.length;if(total>2_000_000){finish(Error('output-limit'));return}try{const msg=JSON.parse(line);const p=pending.get(msg.id);if(!p)return;pending.delete(msg.id);msg.error?p.reject(Error('provider-rejected')):p.resolve(msg.result)}catch{}});
  (async()=>{await send('initialize',{clientInfo:{name:'quota_glass',title:'Quota Glass',version:'0.1.0'},capabilities:null});child.stdin.write(JSON.stringify({method:'initialized'})+'\n');const a=await send('account/read',{refreshToken:false});let limits:any=null;if(a?.account?.type==='chatgpt')limits=await send('account/rateLimits/read',null);finish(undefined,{account:a?.account,limits})})().catch(()=>finish(Error('provider-unavailable')));
 });
}
export async function claudeStatus(executable:string,signal:AbortSignal):Promise<any>{
 const cmd=await cliCommand(executable,'claude');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{const child=execFile(cmd.file,[...cmd.args,'auth','status','--json'],{env:cmd.env,windowsHide:true,timeout:12000,maxBuffer:200000},(err,stdout)=>{signal.removeEventListener('abort',abort);try{const data=JSON.parse(stdout);resolve(data)}catch{reject(Error('provider-unavailable'))}});const abort=()=>{terminate(child.pid);reject(Error('aborted'))};signal.addEventListener('abort',abort,{once:true})});
}
