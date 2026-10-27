import {dialog,type BrowserWindow} from 'electron';
import path from 'node:path';import {stat,mkdir} from 'node:fs/promises';import {randomUUID} from 'node:crypto';
import {startCodexBrowserLogin} from './codex-browser-login';
import {discoverTools,type Detection} from './discovery';
import {discoverProfiles,publicProfiles,profileProviders,type ProfileProvider,type ProfileRecord} from './profiles';
import {readRegistry,saveRegistry,type Registry} from './registry';import {launchLogin} from './login';import {cliCommand} from './cli';import {serializeChanges} from './settings';
interface Host {userData:string;home:string;appData:string;localAppData:string;directExecutable?:string;openAuth?:(url:string)=>Promise<void>;window:()=>BrowserWindow|undefined;language:()=>string;grant:(id:string,allowed:boolean,pin:boolean)=>Promise<void>;refresh:()=>Promise<void>;publish:()=>void}
export class Accounts {
 profiles:ProfileRecord[]=[];detections:Detection[]=[];readonly active=new Set<string>();
 readonly loginErrors:Record<string,string>={};private directSessions=new Map<string,AbortController>();
 private registry:Registry={profiles:[],executables:{}};private timers=new Set<ReturnType<typeof setInterval>>();private disposed=false;
 private serialize=serializeChanges(async(action:()=>Promise<void>)=>action());
 constructor(private host:Host){}
 async initialize(){this.registry=await readRegistry(path.join(this.host.userData,'registry.json'));return this.discover()}
 async discover():Promise<Detection[]>{
  this.detections=await discoverTools({home:this.host.home,path:process.env.PATH??'',appData:this.host.appData,localAppData:this.host.localAppData});
  for(const d of this.detections){const executable=this.registry.executables[d.id];if(executable)try{if((await stat(executable)).isFile()){await cliCommand(executable,this.provider(d.id));d.executable=executable;d.installed=true;d.evidence=[...new Set([...d.evidence,'user-selected-executable'])]}}catch{}}
  const codex=this.detections.find(d=>d.id==='codex');if(codex&&!codex.executable&&this.host.directExecutable){codex.executable=this.host.directExecutable;codex.builtIn=true;codex.evidence.push('built-in-connector')}
  this.profiles=await discoverProfiles({home:this.host.home,env:process.env},this.registry.profiles);return this.detections;
 }
 publicProfiles(){return publicProfiles(this.profiles)}
 directLoginIds(){return [...this.directSessions.keys()]}
 provider(id:unknown):ProfileProvider{if(typeof id!=='string'||!profileProviders.includes(id as ProfileProvider))throw Error('unsupported-login');return id as ProfileProvider}
 profile(id:unknown){if(typeof id!=='string')throw Error('invalid-profile');const p=this.profiles.find(p=>p.id===id);if(!p)throw Error('invalid-profile');return p}
 async consent(id:unknown,allowed:unknown){if(typeof allowed!=='boolean')throw Error('invalid-consent');const p=this.profile(id);await this.host.grant(p.id,allowed,false)}
 private async stamp(p:ProfileRecord){const filename=p.providerId==='codex'?'auth.json':p.providerId==='claude'?'.credentials.json':'oauth_creds.json';try{return (await stat(path.join(p.directory,filename))).mtimeMs}catch{return 0}}
 async login(id:unknown){
  const p=this.profile(id);if(this.active.has(p.id))return;const detection=this.detections.find(d=>d.id===p.providerId);if(detection?.builtIn||p.connectionMethod==='browser')return this.loginDirect(p.providerId,p.id);const executable=detection?.executable;if(!executable)throw Error('notInstalled');
  this.active.add(p.id);this.host.publish();const baseline=await this.stamp(p);
  try{
   const child=await launchLogin(p.providerId,p,executable,path.join(this.host.userData,'login-workspaces',p.id),path.join(this.host.userData,'login-scripts'));
   await this.host.grant(p.id,true,true);
   const started=Date.now();const timer=setInterval(()=>{if(this.disposed||Date.now()-started>600000){clearInterval(timer);this.timers.delete(timer);return}void this.stamp(p).then(stamp=>{if(stamp>baseline){clearInterval(timer);this.timers.delete(timer);void this.host.refresh().catch(()=>{})}})},3000);timer.unref();this.timers.add(timer);
   child.once('exit',()=>{clearInterval(timer);this.timers.delete(timer);this.active.delete(p.id);if(!this.disposed){this.host.publish();void this.host.refresh().catch(()=>{})}});
  }catch{this.active.delete(p.id);this.host.publish();throw Error('terminalFailed')}
 }
 async loginDirect(provider:unknown,profileId?:unknown){
  if(provider!=='codex'||!this.host.directExecutable||!this.host.openAuth||this.disposed)throw Error('direct-login-unavailable');
  if(this.directSessions.size)throw Error('login-already-open');
  return this.serialize(async()=>{
   if(this.disposed)throw Error('direct-login-unavailable');if(this.directSessions.size)throw Error('login-already-open');let profile:ProfileRecord;
   if(profileId!==undefined){profile=this.profile(profileId);if(profile.providerId!=='codex')throw Error('invalid-profile');if(this.active.has(profile.id))return}
   else{const token=randomUUID(),root=path.join(this.host.userData,'profiles','codex',token);await mkdir(root,{recursive:true});this.registry.profiles.push({connectionMethod:'browser',providerId:'codex',root,label:'Cypher '+token.slice(0,8)});await this.persist();await this.host.refresh();profile=this.profiles.find(p=>p.providerId==='codex'&&p.root===root)!;if(!profile)throw Error('invalid-profile')}
   await mkdir(profile.root,{recursive:true});if(this.disposed)throw Error('direct-login-unavailable');delete this.loginErrors[profile.id];const controller=new AbortController();this.directSessions.set(profile.id,controller);this.active.add(profile.id);this.host.publish();
   try{
    const cmd=await cliCommand(this.host.directExecutable!,'codex');if(controller.signal.aborted)throw Error('cancelled');
    const session=startCodexBrowserLogin(cmd,profile.env,url=>this.host.openAuth!(url),controller.signal);
    const complete=session.completed.then(async()=>{if(!this.disposed){await this.host.grant(profile.id,true,true);await this.host.refresh()}}).catch(()=>{if(!controller.signal.aborted&&!this.disposed)this.loginErrors[profile.id]='directLoginFailed'}).finally(()=>{this.directSessions.delete(profile.id);this.active.delete(profile.id);if(!this.disposed)this.host.publish()});
    // Register completion handlers immediately; the IPC returns once the browser opens.
    void complete;await session.opened;
   }catch{const cancelled=controller.signal.aborted;controller.abort();this.directSessions.delete(profile.id);this.active.delete(profile.id);if(!this.disposed){if(!cancelled)this.loginErrors[profile.id]='directLoginFailed';this.host.publish()}if(!cancelled)throw Error('direct-login-failed')}
  });
 }
 cancelLogin(id:unknown){const profile=this.profile(id);this.directSessions.get(profile.id)?.abort();delete this.loginErrors[profile.id];this.host.publish()}
 async addAccount(id:unknown){const providerId=this.provider(id);return this.serialize(async()=>{
  const detection=this.detections.find(d=>d.id===providerId);if(!detection?.executable||detection.builtIn)throw Error('notInstalled');const token=randomUUID();const root=path.join(this.host.userData,'profiles',providerId,token);
  this.registry.profiles.push({providerId,root,label:'Profile '+token.slice(0,8)});await this.persist();await this.host.refresh();const p=this.profiles.find(p=>p.providerId===providerId&&path.resolve(p.root).toLowerCase()===path.resolve(root).toLowerCase());if(!p)throw Error('invalid-profile');await this.login(p.id);
 })}
 async importProfile(id:unknown){const providerId=this.provider(id);const window=this.host.window();if(!window)return;
  const result=await dialog.showOpenDialog(window,{title:providerId==='gemini'?'Gemini: select the home containing .gemini':'Select '+providerId+' profile folder',defaultPath:this.host.home,properties:['openDirectory']});if(result.canceled||!result.filePaths[0])return;
  await this.serialize(async()=>{this.registry.profiles.push({providerId,root:result.filePaths[0]});await this.persist();await this.host.refresh()});
 }
 async locateExecutable(id:unknown){const providerId=this.provider(id);const window=this.host.window();if(!window)return;
  const result=await dialog.showOpenDialog(window,{title:'Select '+providerId+' CLI executable',properties:['openFile'],...(process.platform==='win32'?{filters:[{name:'CLI executable',extensions:['exe','cmd']}]}:{})});if(result.canceled||!result.filePaths[0])return;
  const executable=result.filePaths[0];await cliCommand(executable,providerId);
  await this.serialize(async()=>{this.registry.executables[providerId]=executable;await this.persist();await this.host.refresh()});
 }
 private persist(){return saveRegistry(path.join(this.host.userData,'registry.json'),this.registry)}
 dispose(){this.disposed=true;for(const controller of this.directSessions.values())controller.abort();this.directSessions.clear();for(const timer of this.timers)clearInterval(timer);this.timers.clear()}
}
