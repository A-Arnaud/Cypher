import {spawn,type ChildProcess} from 'node:child_process';import {mkdir,writeFile,unlink} from 'node:fs/promises';import path from 'node:path';import {randomUUID} from 'node:crypto';import {cliCommand,scopedEnvironment} from './cli';import {localAbsolute,type ProfileRecord,type ProfileProvider} from './profiles';
export interface LoginPlan {providerId:ProfileProvider;file:string;prefixArgs:string[];profileEnv:Record<string,string>;cwd:string}
function quoted(value:string){if(!localAbsolute(value))throw Error('invalid-login-path');return '"'+value.replaceAll('%','%%')+'"'}
export function buildLoginScript(plan:LoginPlan):string{
 if(!['codex','claude','gemini'].includes(plan.providerId)||plan.prefixArgs.length>1)throw Error('unsupported-login');
 scopedEnvironment(plan.providerId,{},plan.profileEnv);
 const command=[quoted(plan.file),...plan.prefixArgs.map(quoted),...(plan.providerId==='codex'?['login']:plan.providerId==='claude'?['auth','login']:[])].join(' ');
 const lines=['@echo off','setlocal DisableDelayedExpansion','title Quota Glass - Official sign in','echo Quota Glass: sign in using the official CLI. Never share your codes.'];
 if(plan.providerId==='gemini')lines.push('echo Gemini opens interactively. Use /auth if needed. No prompt is sent by this widget.');
 for(const [key,value] of Object.entries(plan.profileEnv))lines.push('set "'+key+'='+value.replaceAll('%','%%')+'"');
 lines.push('cd /d '+quoted(plan.cwd),command,'echo.','echo Return to Quota Glass and refresh when sign in is complete.','endlocal');return lines.join('\r\n')+'\r\n';
}
export async function launchLogin(providerId:ProfileProvider,profile:ProfileRecord,executable:string,cwd:string,scriptDir:string):Promise<ChildProcess>{
 if(profile.providerId!==providerId||!localAbsolute(cwd)||!localAbsolute(scriptDir))throw Error('invalid-login');
 const cmd=await cliCommand(executable,providerId);const content=buildLoginScript({providerId,file:cmd.file,prefixArgs:cmd.args,profileEnv:profile.env,cwd});
 await mkdir(profile.root,{recursive:true});await mkdir(cwd,{recursive:true});await mkdir(scriptDir,{recursive:true});const script=path.join(scriptDir,'login-'+randomUUID()+'.cmd');await writeFile(script,content,'utf8');
 const comspec=path.join(process.env.SystemRoot??'C:/Windows','System32','cmd.exe');
 return new Promise((resolve,reject)=>{const child=spawn(comspec,['/d','/v:off','/k','""%QG_LOGIN_SCRIPT%""'],{windowsVerbatimArguments:true,detached:true,windowsHide:false,stdio:'ignore',cwd,env:{...cmd.env,QG_LOGIN_SCRIPT:script}});child.once('spawn',()=>resolve(child));child.once('error',()=>{void unlink(script).catch(()=>{});reject(Error('terminalFailed'))});child.once('exit',()=>{void unlink(script).catch(()=>{})});child.unref()});
}
