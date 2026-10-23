import {spawn,execFile} from 'node:child_process';
import {stat} from 'node:fs/promises';
import path from 'node:path';
import {localAbsolute} from './profiles';
import {createInterface} from 'node:readline';
export async function cliCommand(executable:string,kind:'codex'|'claude'|'gemini'):Promise<{file:string;args:string[];env:NodeJS.ProcessEnv}>{
 if(/\.(cmd|bat)$/i.test(executable)){
  const packageRoot=path.join(path.dirname(executable),'node_modules','@openai','codex');
  if(kind==='codex'&&process.platform==='win32'){const arch=process.arch==='arm64'?'arm64':'x64',triple=arch==='arm64'?'aarch64-pc-windows-msvc':'x86_64-pc-windows-msvc';const relative=path.join('vendor',triple,'bin','codex.exe');for(const native of [path.join(packageRoot,'node_modules','@openai','codex-win32-'+arch,relative),path.join(path.dirname(packageRoot),'codex-win32-'+arch,relative),path.join(packageRoot,relative)]){try{if((await stat(native)).isFile())return {file:native,args:[],env:{...process.env,CODEX_MANAGED_PACKAGE_ROOT:packageRoot,CODEX_MANAGED_BY_NPM:'1'}}}catch{}}}
  const entry=path.join(path.dirname(executable),'node_modules',kind==='codex'?'@openai/codex/bin/codex.js':kind==='claude'?'@anthropic-ai/claude-code/cli.js':'@google/gemini-cli/bundle/gemini.js');
  if(!(await stat(entry)).isFile())throw Error('unsupported-launcher');
  return {file:process.execPath,args:[entry],env:{...process.env,ELECTRON_RUN_AS_NODE:'1'}};
 }
 if(!/\.exe$/i.test(executable))throw Error('unsupported-launcher');
 return {file:executable,args:[],env:{...process.env}};
}
export async function backgroundCliCommand(executable:string,kind:'codex'|'claude'|'gemini'){const command=await cliCommand(executable,kind);return command.args.length?{...command,args:['--require',path.join(__dirname,'hidden-child.cjs'),...command.args]}:command}
function terminate(pid:number|undefined){if(!pid)return;if(process.platform==='win32')execFile('taskkill.exe',['/pid',String(pid),'/t','/f'],{windowsHide:true},()=>{});else try{process.kill(pid)}catch{}}
export function scopedEnvironment(kind:'codex'|'claude'|'gemini',base:NodeJS.ProcessEnv,values:Record<string,string>={}):NodeJS.ProcessEnv{const allowed={codex:'CODEX_HOME',claude:'CLAUDE_CONFIG_DIR',gemini:'GEMINI_CLI_HOME'}[kind];for(const [key,value] of Object.entries(values))if(key!==allowed||!localAbsolute(value))throw Error('invalid-profile-env');return {...base,...values}}
export async function codexStatus(executable:string,signal:AbortSignal,profileEnv:Record<string,string>={}):Promise<{account:any;limits:any}>{
 const cmd=await backgroundCliCommand(executable,'codex');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{
  const child=spawn(cmd.file,[...cmd.args,'app-server','--listen','stdio://'],{stdio:['pipe','pipe','pipe'],windowsHide:true,env:scopedEnvironment('codex',cmd.env,profileEnv)});
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
  (async()=>{await send('initialize',{clientInfo:{name:'cypher',title:'Cypher',version:'0.2.0'},capabilities:null});child.stdin.write(JSON.stringify({method:'initialized'})+'\n');const a=await send('account/read',{refreshToken:false});let limits:any=null;if(a?.account?.type==='chatgpt')limits=await send('account/rateLimits/read',{supportsLunaReserve:false,excludeResetCreditDetails:true});finish(undefined,{account:a?.account,limits})})().catch(()=>finish(Error('provider-unavailable')));
 });
}
export async function claudeStatus(executable:string,signal:AbortSignal,profileEnv:Record<string,string>={}):Promise<any>{
 const cmd=await backgroundCliCommand(executable,'claude');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{const child=execFile(cmd.file,[...cmd.args,'auth','status','--json'],{env:scopedEnvironment('claude',cmd.env,profileEnv),windowsHide:true,timeout:12000,maxBuffer:200000},(err,stdout)=>{signal.removeEventListener('abort',abort);try{const data=JSON.parse(stdout);resolve(data)}catch{reject(Error('provider-unavailable'))}});const abort=()=>{terminate(child.pid);reject(Error('aborted'))};signal.addEventListener('abort',abort,{once:true})});
}
