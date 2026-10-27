import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import path from 'node:path';
import {catalog} from '../shared/catalog';
import type {Settings} from '../shared/model';
import {defaultSettings} from '../shared/defaults';
import {validShortcut} from '../shared/shortcut';
export {defaultSettings} from '../shared/defaults';
export function validatePatch(current:Settings,input:unknown):Settings{
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('invalid-settings');
 const p=input as Record<string,unknown>;const next={...current};
 for(const [k,v] of Object.entries(p)){
  if(['autoUpdateCheck','alwaysOnTop','startAtLogin','paused','compact','summaryMode','taskbarMode','taskbarOnboarded'].includes(k)){if(typeof v!=='boolean')throw Error('invalid-settings');(next as any)[k]=v}
  else if(k==='language'){if(v!=='fr'&&v!=='en')throw Error('invalid-language');next.language=v}
  else if(k==='opacity'){if(!Number.isInteger(v)||Number(v)<30||Number(v)>100)throw Error('invalid-opacity');next.opacity=Number(v)}
  else if(k==='pollSeconds'){if(!Number.isInteger(v)||Number(v)<30||Number(v)>900)throw Error('invalid-interval');next.pollSeconds=Number(v)}
  else if(k==='shortcut'){if(!validShortcut(v))throw Error('invalid-shortcut');next.shortcut=v}
  else if(k==='pinned'||k==='consents'){if(!Array.isArray(v)||v.length>256||v.some(id=>typeof id!=='string'||(!catalog.some(c=>c.id===id)&&!/^(codex|claude|gemini)-profile-[a-f0-9]{16}$/.test(id))))throw Error('invalid-provider');next[k]=[...new Set(v)]}
  else if(k==='alertThresholds'){if(!Array.isArray(v)||v.length>5||v.some(x=>typeof x!=='number'||!Number.isFinite(x)||x<1||x>99))throw Error('invalid-threshold');next.alertThresholds=[...new Set(v)].sort((a,b)=>b-a)}
  else throw Error('invalid-settings');
 }
 return next;
}
export function safeBounds(b:Settings['bounds'],work:{x:number;y:number;width:number;height:number}):NonNullable<Settings['bounds']>{
 const width=Math.min(430,work.width),height=Math.min(704,work.height);
 const bx=b&&Number.isFinite(b.x)?b.x:work.x+work.width-width-32;
 const by=b&&Number.isFinite(b.y)?b.y:work.y+40;
 return {x:Math.round(Math.max(work.x,Math.min(bx,work.x+work.width-width))),y:Math.round(Math.max(work.y,Math.min(by,work.y+work.height-height))),width,height};
}
export async function readSettings(file:string):Promise<Settings>{
 try{
  const raw:unknown=JSON.parse(await readFile(file,'utf8'));
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return defaultSettings();
  const {bounds,...fields}=raw as Record<string,unknown>;
  let settings=defaultSettings();
  // Recover independent valid preferences when one field is corrupt or newer.
  // Invalid consent lists retain the empty default: access is never inferred.
  for(const [key,value] of Object.entries(fields)){
   try{settings=validatePatch(settings,{[key]:value})}catch{}
  }
  // Older installs saved false before the user had ever chosen a bar preference.
  // Preserve an explicit removal, identified by a completed indicator activation.
  if(fields.taskbarMode===false&&fields.taskbarOnboarded!==true)settings.taskbarMode=true;
  if(bounds&&typeof bounds==='object'&&['x','y','width','height'].every(k=>typeof (bounds as Record<string,unknown>)[k]==='number'&&Number.isFinite((bounds as Record<string,number>)[k])))settings.bounds=bounds as Settings['bounds'];
  return settings;
 }catch{return defaultSettings()}
}
export function serializeChanges<T>(apply:(input:T)=>Promise<void>):(input:T)=>Promise<void>{let queue=Promise.resolve();return input=>{const operation=queue.then(()=>apply(input));queue=operation.catch(()=>{});return operation}}
let saving=Promise.resolve();
export function saveSettings(file:string,settings:Settings):Promise<void>{saving=saving.catch(()=>{}).then(async()=>{await mkdir(path.dirname(file),{recursive:true});const temp=file+'.tmp';await writeFile(temp,JSON.stringify(settings,null,2),'utf8');await rename(temp,file)});return saving}
