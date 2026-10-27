import {execFileSync} from 'node:child_process';
import path from 'node:path';
export function startupSupported(input:{platform:string;packaged:boolean;portable:boolean;executable:string;temp:string}):boolean{
 if(input.platform==='darwin')return input.packaged&&!input.portable&&/^\/(?:Applications|Users\/[^/]+\/Applications)\/[^/]+\.app\/Contents\/MacOS\/[^/]+$/.test(input.executable);
 if(input.platform!=='win32'||!input.packaged||input.portable)return false;
 const relative=path.win32.relative(path.win32.resolve(input.temp).toLowerCase(),path.win32.resolve(input.executable).toLowerCase());
 return path.win32.isAbsolute(relative)||relative==='..'||relative.startsWith('..\\');
}
export interface MacLoginAdapter {
 setLoginItemSettings(options:{type:'mainAppService';openAtLogin:boolean}):void;
 getLoginItemSettings(options:{type:'mainAppService'}):{openAtLogin:boolean;status?:string;wasOpenedAtLogin?:boolean};
}
export function createMacStartup(api:MacLoginAdapter,available:boolean){
 const read=()=>api.getLoginItemSettings({type:'mainAppService'});
 const startupStatus=()=>{if(!available)return false;const current=read();return current.status==='enabled'||current.status==='requires-approval'||!current.status&&current.openAtLogin};
 const write=(enabled:boolean)=>api.setLoginItemSettings({type:'mainAppService',openAtLogin:enabled});
 return {startupStatus,needsApproval:()=>available&&read().status==='requires-approval',async configureStartup(enabled:boolean){if(!available)throw Error('startup-install-required');const previous=startupStatus();try{write(enabled);if(startupStatus()!==enabled)throw Error('startup-failed')}catch{try{write(previous)}catch{}throw Error('startup-failed')}}};
}
export function launchedAtLogin(platform:string,args:string[],wasOpenedAtLogin=false){return (args.includes('--cypher-startup')||platform==='win32'&&args.includes('--updated'))||platform==='darwin'&&wasOpenedAtLogin}
export function readStartupCommand(helper:string):string|undefined {try{const value=JSON.parse(execFileSync(helper,['--startup-query'],{encoding:'utf8',windowsHide:true,timeout:3000,maxBuffer:16384}).replace(/^\uFEFF/,''));return typeof value.command==='string'?value.command:undefined}catch{return undefined}}
export interface LoginAdapter {
 setLoginItemSettings(options:{name:string;path:string;args:string[];openAtLogin:boolean;enabled:boolean}):void;
 getLoginItemSettings(options:{path:string;args:string[]}):{openAtLogin:boolean;launchItems:{name:string;path:string;args:string[];enabled:boolean}[]};
}
export function createStartup(api:LoginAdapter,executable:string,available:boolean,readCommand?:()=>string|undefined){
 const args=['--cypher-startup'];
 const startupStatus=()=>{if(!available)return false;const current=api.getLoginItemSettings({path:executable,args});const exact=readCommand?readCommand()===`"${executable}" --cypher-startup`:current.openAtLogin;return exact&&current.launchItems.some(item=>item.name==='Cypher'&&item.enabled&&item.path.toLowerCase()===executable.toLowerCase()&&(readCommand||JSON.stringify(item.args)===JSON.stringify(args)))};
 const write=(enabled:boolean)=>api.setLoginItemSettings({name:'Cypher',path:executable,args,openAtLogin:enabled,enabled});
 return {startupStatus,needsApproval:()=>false,async configureStartup(enabled:boolean){if(!available)throw Error('startup-install-required');const previous=startupStatus();try{write(enabled);if(startupStatus()!==enabled)throw Error('startup-failed')}catch{try{write(previous)}catch{}throw Error('startup-failed')}}};
}
