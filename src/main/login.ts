import {spawn,type ChildProcess} from 'node:child_process';import {mkdir,writeFile,unlink} from 'node:fs/promises';import path from 'node:path';import {randomUUID} from 'node:crypto';import {cliCommand,scopedEnvironment} from './cli';import {localAbsolute,type ProfileRecord,type ProfileProvider} from './profiles';
export interface LoginPlan {providerId:ProfileProvider;file:string;prefixArgs:string[];profileEnv:Record<string,string>;cwd:string}
export function shellQuote(value:string):string{if(/[\0\r\n]/.test(value))throw Error('invalid-login-path');return "'"+value.replaceAll("'","'\\''")+"'"}
export function buildMacLoginScript(plan:LoginPlan,env:NodeJS.ProcessEnv):string{
 if(!['codex','claude','gemini'].includes(plan.providerId)||plan.prefixArgs.length>1)throw Error('unsupported-login');
 for(const value of [plan.file,...plan.prefixArgs,plan.cwd])if(!localAbsolute(value))throw Error('invalid-login-path');
 const scoped=scopedEnvironment(plan.providerId,env,plan.profileEnv);
 const assignments=Object.entries(scoped).filter((entry):entry is [string,string]=>typeof entry[1]==='string').map(([key,value])=>shellQuote(key+'='+value));
 const args=plan.providerId==='codex'?['login']:plan.providerId==='claude'?['auth','login']:[];
 return ['#!/bin/sh','trap \'/bin/rm -f -- "$0"\' EXIT',`cd ${shellQuote(plan.cwd)} || exit 1`,
  'echo "Cypher: sign in using the official CLI. Return to Cypher and refresh after signing in."',
  ['/usr/bin/env','-i',...assignments,shellQuote(plan.file),...plan.prefixArgs.map(shellQuote),...args].join(' '),
  'result=$?','echo "Sign-in command finished. You may close this terminal."','exit "$result"',''].join('\n');
}
async function launchMacLogin(plan:LoginPlan,env:NodeJS.ProcessEnv,scriptDir:string,root:string):Promise<ChildProcess>{
 const content=buildMacLoginScript(plan,env);await mkdir(root,{recursive:true});await mkdir(plan.cwd,{recursive:true});await mkdir(scriptDir,{recursive:true});
 const script=path.join(scriptDir,'login-'+randomUUID()+'.command');await writeFile(script,content,{encoding:'utf8',mode:0o700});
 return new Promise((resolve,reject)=>{
  // A dedicated Terminal instance keeps the child lifetime tied to this sign-in.
  const child=spawn('/usr/bin/open',['-W','-n','-a','Terminal',script],{stdio:'ignore',env:scopedEnvironment(plan.providerId,env)});
  child.once('spawn',()=>resolve(child));child.once('error',()=>{void unlink(script).catch(()=>{});reject(Error('terminalFailed'))});child.once('exit',()=>{void unlink(script).catch(()=>{})});child.unref();
 });
}
function quoted(value:string){if(!localAbsolute(value))throw Error('invalid-login-path');return '"'+value.replaceAll('%','%%')+'"'}
export function buildLoginScript(plan:LoginPlan):string{
 if(!['codex','claude','gemini'].includes(plan.providerId)||plan.prefixArgs.length>1)throw Error('unsupported-login');
 scopedEnvironment(plan.providerId,{},plan.profileEnv);
 for(const value of [plan.file,...plan.prefixArgs,plan.cwd])quoted(value);
 const command=['"%CYPHER_LOGIN_PROGRAM%"',...(plan.prefixArgs.length?['"%CYPHER_LOGIN_ENTRY%"']:[]),...(plan.providerId==='codex'?['login']:plan.providerId==='claude'?['auth','login']:[])].join(' ');
 const lines=['@echo off','setlocal DisableDelayedExpansion','title Cypher - Official sign in','echo Cypher: sign in using the official CLI. Never share your codes.'];
 if(plan.providerId==='gemini')lines.push('echo Gemini opens interactively. Use /auth if needed. No prompt is sent by this widget.');
 lines.push('cd /d "%CYPHER_LOGIN_CWD%" || exit /b 1',command,'echo.','echo Return to Cypher and refresh when sign in is complete.','endlocal');return lines.join('\r\n')+'\r\n';
}
export async function launchLogin(providerId:ProfileProvider,profile:ProfileRecord,executable:string,cwd:string,scriptDir:string):Promise<ChildProcess>{
 if(profile.providerId!==providerId||!localAbsolute(cwd)||!localAbsolute(scriptDir))throw Error('invalid-login');
 const cmd=await cliCommand(executable,providerId);const plan={providerId,file:cmd.file,prefixArgs:cmd.args,profileEnv:profile.env,cwd};
 if(process.platform==='darwin')return launchMacLogin(plan,cmd.env,scriptDir,profile.root);
 const content=buildLoginScript(plan);
 await mkdir(profile.root,{recursive:true});await mkdir(cwd,{recursive:true});await mkdir(scriptDir,{recursive:true});const script=path.join(scriptDir,'login-'+randomUUID()+'.cmd');await writeFile(script,content,'utf8');
 const comspec=path.join(process.env.SystemRoot??'C:/Windows','System32','cmd.exe');
 return new Promise((resolve,reject)=>{const child=spawn(comspec,['/d','/v:off','/c','start "Cypher sign in" /wait "%CYPHER_LOGIN_COMSPEC%" /d /v:off /k '+path.basename(script)],{windowsVerbatimArguments:true,detached:true,windowsHide:true,stdio:'ignore',cwd:scriptDir,env:{...scopedEnvironment(providerId,cmd.env,profile.env),QG_LOGIN_SCRIPT:script,CYPHER_LOGIN_COMSPEC:comspec,CYPHER_LOGIN_PROGRAM:cmd.file,CYPHER_LOGIN_ENTRY:cmd.args[0]??'',CYPHER_LOGIN_CWD:cwd}});child.once('spawn',()=>resolve(child));child.once('error',()=>{void unlink(script).catch(()=>{});reject(Error('terminalFailed'))});child.once('exit',()=>{void unlink(script).catch(()=>{})});child.unref()});
}
