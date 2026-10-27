import {spawn} from 'node:child_process';import {createInterface} from 'node:readline';import os from 'node:os';
import {scopedEnvironment,terminate} from './cli';
interface Command {file:string;args:string[];env:NodeJS.ProcessEnv}
export function trustedCodexAuthUrl(value:unknown):value is string{
 if(typeof value!=='string'||value.length>16384)return false;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&['auth.openai.com','chatgpt.com','auth0.openai.com'].includes(url.hostname)}catch{return false}
}
/** Only auth RPCs; no threads, prompts, tools, or arbitrary URLs are exposed. */
export function startCodexBrowserLogin(command:Command,profileEnv:Record<string,string>,open:(url:string)=>Promise<void>,signal:AbortSignal,timeoutMs=600000){
 const env=scopedEnvironment('codex',command.env,profileEnv);
 let readyResolve!:()=>void,readyReject!:(error:Error)=>void,completeResolve!:()=>void,completeReject!:(error:Error)=>void;
 const opened=new Promise<void>((resolve,reject)=>{readyResolve=resolve;readyReject=reject});
 const completed=new Promise<void>((resolve,reject)=>{completeResolve=resolve;completeReject=reject});
 let done=false,sequence=0,total=0,loginId:string|undefined,early:{loginId?:string;success?:boolean}|undefined;
 const pending=new Map<number,{resolve:(value:any)=>void;reject:(error:Error)=>void}>();
 const child=spawn(command.file,[...command.args,'-c','analytics.enabled=false','-c','feedback.enabled=false','-c','otel.exporter="none"','-c','otel.trace_exporter="none"','-c','otel.metrics_exporter="none"','-c','cli_auth_credentials_store="file"','app-server','--listen','stdio://'],{cwd:os.tmpdir(),env,windowsHide:true,stdio:['pipe','pipe','pipe']});
 const lines=createInterface({input:child.stdout});
 const finish=(error?:Error)=>{if(done)return;done=true;clearTimeout(timer);clearTimeout(startTimer);signal.removeEventListener('abort',abort);lines.close();child.stdin.end();terminate(child.pid);for(const item of pending.values())item.reject(Error('login-closed'));pending.clear();if(error){readyReject(error);completeReject(error)}else{readyResolve();completeResolve()}};
 const abort=()=>finish(Error('cancelled'));const timer=setTimeout(()=>finish(Error('login-timeout')),timeoutMs);const startTimer=setTimeout(()=>finish(Error('login-start-failed')),20000);
 signal.addEventListener('abort',abort,{once:true});child.on('error',()=>finish(Error('login-start-failed')));child.on('exit',()=>{if(!done)finish(Error('login-process-exited'))});child.stdin.on('error',()=>finish(Error('login-process-exited')));child.stderr.on('data',()=>{});
 const notify=(value:{loginId?:string;success?:boolean})=>{if(!loginId){early=value;return}if(value.loginId===loginId)finish(value.success===true?undefined:Error('login-rejected'))};
 lines.on('line',line=>{
  total+=line.length;if(total>2_000_000){finish(Error('login-output-limit'));return}
  let message:any;try{message=JSON.parse(line)}catch{return}
  if(message.method==='account/login/completed'){notify(message.params??{});return}
  const item=pending.get(message.id);if(!item)return;pending.delete(message.id);message.error?item.reject(Error('login-rejected')):item.resolve(message.result);
 });
 const send=(method:string,params:unknown)=>new Promise<any>((resolve,reject)=>{if(done){reject(Error('login-closed'));return}const id=++sequence;pending.set(id,{resolve,reject});child.stdin.write(JSON.stringify({id,method,params})+'\n')});
 void (async()=>{
  if(signal.aborted){abort();return}
  await send('initialize',{clientInfo:{name:'cypher',title:'Cypher',version:'0.5.1'},capabilities:null});child.stdin.write(JSON.stringify({method:'initialized'})+'\n');
  const result=await send('account/login/start',{type:'chatgpt'});
  if(!result||result.type!=='chatgpt'||typeof result.loginId!=='string'||!result.loginId||!trustedCodexAuthUrl(result.authUrl))throw Error('invalid-login-response');
  loginId=result.loginId;await open(result.authUrl);if(done)return;clearTimeout(startTimer);readyResolve();if(early)notify(early);
 })().catch(()=>finish(Error('login-start-failed')));
 return {opened,completed};
}
