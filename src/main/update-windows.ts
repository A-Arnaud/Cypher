import {createReadStream} from 'node:fs';import {lstat} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {NsisUpdater,Provider,CancellationToken,type UpdateInfo,type ResolvedUpdateFileInfo} from 'electron-updater';
import {parseUpdateInfo,type ProviderRuntimeOptions} from 'electron-updater/out/providers/Provider';
import {ElectronHttpExecutor} from 'electron-updater/out/electronHttpExecutor';
import type {UpdateCandidate} from './update-release';
export function checkedManifest(raw:string,candidate:UpdateCandidate):UpdateInfo{
 const parsed=parseUpdateInfo(raw,'latest.yml',new URL(candidate.manifest!.url));const file=parsed.files?.[0];
 if(parsed.version!==candidate.version||parsed.files?.length!==1||!file||file.url!==candidate.file.name||file.size!==candidate.file.size||file.isAdminRightsRequired===true||typeof file.sha512!=='string'||!/^[A-Za-z0-9+/]{86}==$/.test(file.sha512)||Buffer.from(file.sha512,'base64').length!==64||(parsed as UpdateInfo&{packages?:unknown}).packages)throw Error('invalid-update-manifest');
 return {version:candidate.version,path:file.url,sha512:file.sha512,releaseDate:typeof parsed.releaseDate==='string'?parsed.releaseDate:new Date().toISOString(),files:[{url:file.url,sha512:file.sha512,size:file.size}],...(typeof parsed.minimumSystemVersion==='string'?{minimumSystemVersion:parsed.minimumSystemVersion}:{})};
}
class PinnedProvider extends Provider<UpdateInfo>{
 constructor(options:ProviderRuntimeOptions,private info:UpdateInfo,private candidate:UpdateCandidate){super(options)}
 async getLatestVersion(){return this.info}
 resolveFiles():ResolvedUpdateFileInfo[]{return [{url:new URL(this.candidate.file.url),info:this.info.files[0]}]}
}
/** Uses the NSIS engine with an already verified, version-pinned public release.
 * No polling, staged-rollout identifier, auto-download or install-on-quit is enabled. */
export class WindowsUpdateInstaller extends NsisUpdater {
 constructor(){super();this.logger=null;this.autoDownload=false;this.autoInstallOnAppQuit=false;this.allowPrerelease=false;this.allowDowngrade=false;this.disableWebInstaller=true;this.disableDifferentialDownload=true}
 async prepare(candidate:UpdateCandidate,manifest:string,signal:AbortSignal,progress:(value:number)=>void):Promise<()=>void>{
  const info=checkedManifest(manifest,candidate);if(!await this.isUpdateSupported(info))throw Error('unsupported-update');
  this.updateInfoAndProvider={info,provider:new PinnedProvider({executor:new ElectronHttpExecutor((_info,callback)=>callback('','')),platform:'win32',isUseMultipleRangeRequest:false},info,candidate)};
  const token=new CancellationToken();const cancel=()=>token.cancel();signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)cancel();const report=(value:{percent:number})=>progress(value.percent);this.on('download-progress',report);
  try{const files=await this.downloadUpdate(token);if(files.length!==1||files[0]!==this.installerPath)throw Error('invalid-downloaded-update');const stat=await lstat(files[0]);if(!stat.isFile()||stat.isSymbolicLink()||stat.size!==candidate.file.size)throw Error('update-size');const hash=createHash('sha256');for await(const part of createReadStream(files[0])){if(signal.aborted)throw Error('update-cancelled');hash.update(part)}if(hash.digest('hex')!==candidate.file.sha256)throw Error('update-digest');if(signal.aborted)throw Error('update-cancelled');return ()=>this.quitAndInstall(true,true)}finally{signal.removeEventListener('abort',cancel);this.removeListener('download-progress',report)}
 }
}
