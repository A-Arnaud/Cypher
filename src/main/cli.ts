import {spawn,execFile} from 'node:child_process';
import {stat} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {localAbsolute} from './profiles';
import {createInterface} from 'node:readline';
import {childEnvironment} from './child-environment';
async function nodeExecutable(){
 if(!process.versions.electron)return process.execPath;
 const dirs=[...(process.env.PATH??'').split(path.delimiter),path.join(process.env.ProgramFiles??'C:/Program Files','nodejs')];
 for(const dir of dirs){const file=path.join(dir,'node.exe');try{if((await stat(file)).isFile())return file}catch{}}
 throw Error('node-runtime-required');
}
export async function cliCommand(executable:string,kind:'codex'|'claude'|'gemini'):Promise<{file:string;args:string[];env:NodeJS.ProcessEnv}>{
 if(/\.(cmd|bat)$/i.test(executable)){
  const packageRoot=path.join(path.dirname(executable),'node_modules','@openai','codex');
  if(kind==='claude'&&process.platform==='win32'){
   const native=path.join(path.dirname(executable),'node_modules','@anthropic-ai','claude-code','bin','claude.exe');
   try{if((await stat(native)).isFile())return {file:native,args:[],env:{...process.env}}}catch{}
  }
  if(kind==='codex'&&process.platform==='win32'){const arch=process.arch==='arm64'?'arm64':'x64',triple=arch==='arm64'?'aarch64-pc-windows-msvc':'x86_64-pc-windows-msvc';const relative=path.join('vendor',triple,'bin','codex.exe');for(const native of [path.join(packageRoot,'node_modules','@openai','codex-win32-'+arch,relative),path.join(path.dirname(packageRoot),'codex-win32-'+arch,relative),path.join(packageRoot,relative)]){try{if((await stat(native)).isFile())return {file:native,args:[],env:{...process.env,CODEX_MANAGED_PACKAGE_ROOT:packageRoot,CODEX_MANAGED_BY_NPM:'1'}}}catch{}}}
  const entry=path.join(path.dirname(executable),'node_modules',kind==='codex'?'@openai/codex/bin/codex.js':kind==='claude'?'@anthropic-ai/claude-code/cli.js':'@google/gemini-cli/bundle/gemini.js');
  if(!(await stat(entry)).isFile())throw Error('unsupported-launcher');
  return {file:await nodeExecutable(),args:[entry],env:childEnvironment(process.env)};
 }
 if(!/\.exe$/i.test(executable))throw Error('unsupported-launcher');
 return {file:executable,args:[],env:{...process.env}};
}
export async function backgroundCliCommand(executable:string,kind:'codex'|'claude'|'gemini'){const command=await cliCommand(executable,kind);const preload=path.join(__dirname,'hidden-child.cjs').replace(/app\.asar([\\/])/,'app.asar.unpacked$1');return command.args.length?{...command,args:['--require',preload,...command.args]}:command}
function terminate(pid:number|undefined){if(!pid)return;if(process.platform==='win32')execFile('taskkill.exe',['/pid',String(pid),'/t','/f'],{windowsHide:true},()=>{});else try{process.kill(pid)}catch{}}
export function scopedEnvironment(kind:'codex'|'claude'|'gemini',base:NodeJS.ProcessEnv,values:Record<string,string>={}):NodeJS.ProcessEnv{const allowed={codex:'CODEX_HOME',claude:'CLAUDE_CONFIG_DIR',gemini:'GEMINI_CLI_HOME'}[kind];for(const [key,value] of Object.entries(values))if(key!==allowed||!localAbsolute(value))throw Error('invalid-profile-env');return {...childEnvironment(base),...values}}
export async function codexStatus(executable:string,signal:AbortSignal,profileEnv:Record<string,string>={}):Promise<{account:any;limits:any;limitsError?:string}>{
 const cmd=await backgroundCliCommand(executable,'codex');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{
  const child=spawn(cmd.file,[...cmd.args,'-c','analytics.enabled=false','-c','feedback.enabled=false','-c','otel.exporter="none"','-c','otel.trace_exporter="none"','-c','otel.metrics_exporter="none"','app-server','--listen','stdio://'],{cwd:os.tmpdir(),stdio:['pipe','pipe','pipe'],windowsHide:true,env:scopedEnvironment('codex',cmd.env,profileEnv)});
  let done=false;const pending=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void}>();let sequence=0,total=0;
  const lines=createInterface({input:child.stdout});
  const finish=(error?:Error,result?:{account:any;limits:any;limitsError?:string})=>{if(done)return;done=true;clearTimeout(timer);signal.removeEventListener('abort',abort);lines.close();child.stdin.end();terminate(child.pid);for(const p of pending.values())p.reject(Error('closed'));pending.clear();error?reject(error):resolve(result!)};
  const abort=()=>finish(Error('aborted'));const timer=setTimeout(()=>finish(Error('timeout')),20000);signal.addEventListener('abort',abort,{once:true});
  child.on('error',()=>finish(Error('launcher-failed')));child.on('exit',()=>{if(!done)finish(Error('cli-exited'))});
  // Never log CLI stderr or pass it through IPC; it may contain account details.
  child.stderr.on('data',()=>{});
  const send=(method:string,params:unknown)=>new Promise<any>((res,rej)=>{const id=++sequence;pending.set(id,{resolve:res,reject:rej});child.stdin.write(JSON.stringify({id,method,params})+'\n')});
  child.stdin.on('error',()=>finish(Error('cli-exited')));
  lines.on('line',line=>{total+=line.length;if(total>2_000_000){finish(Error('output-limit'));return}try{const msg=JSON.parse(line);const p=pending.get(msg.id);if(!p)return;pending.delete(msg.id);if(msg.error){const text=typeof msg.error.message==='string'?msg.error.message:'';p.reject(Error(msg.error.code===401||/unauthorized|401|not authenticated|not logged in|token.*expired|refresh.*token|sign in|log in/i.test(text)?'session-required':'provider-rejected'))}else p.resolve(msg.result)}catch{}});
  (async()=>{await send('initialize',{clientInfo:{name:'cypher',title:'Cypher',version:'0.4.7'},capabilities:null});child.stdin.write(JSON.stringify({method:'initialized'})+'\n');const a=await send('account/read',{refreshToken:false});let limits:any=null;let limitsError:string|undefined;if(a?.account?.type==='chatgpt')try{limits=await send('account/rateLimits/read',{supportsLunaReserve:false,excludeResetCreditDetails:true})}catch(e){limitsError=e instanceof Error?e.message:'provider-rejected'}finish(undefined,{account:a?.account,limits,limitsError})})().catch(e=>finish(e instanceof Error?e:Error('provider-unavailable')));
 });
}
export async function claudeStatus(executable:string,signal:AbortSignal,profileEnv:Record<string,string>={}):Promise<any>{
 const cmd=await backgroundCliCommand(executable,'claude');if(signal.aborted)throw Error('aborted');
 return new Promise((resolve,reject)=>{const child=execFile(cmd.file,[...cmd.args,'auth','status','--json'],{cwd:os.tmpdir(),env:{...scopedEnvironment('claude',cmd.env,profileEnv),CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:'1',DO_NOT_TRACK:'1',DISABLE_TELEMETRY:'1'},windowsHide:true,timeout:12000,maxBuffer:200000},(err,stdout)=>{signal.removeEventListener('abort',abort);try{const data=JSON.parse(stdout);resolve(data)}catch{reject(Error('provider-unavailable'))}});const abort=()=>{terminate(child.pid);reject(Error('aborted'))};signal.addEventListener('abort',abort,{once:true})});
}
