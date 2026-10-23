import {createHash} from 'node:crypto';
import type {ProfileRecord} from './profiles';
import {catalog} from '../shared/catalog';
import type {ProviderSnapshot} from '../shared/model';
import type {Detection} from './discovery';
import {codexStatus,claudeStatus} from './cli';
import {parseCodexLimits,maskAccount} from './metrics';
export interface Context {detections:Detection[];consents:string[];profiles?:ProfileRecord[]}
export function dedupeSnapshots(values:ProviderSnapshot[]):ProviderSnapshot[]{const seen=new Map<string,string>();const duplicates=new Map<string,string>();for(const s of [...values].sort((a,b)=>a.id.localeCompare(b.id))){if(s.auth!=='connected'||!s.identityKey)continue;const previous=seen.get(s.identityKey);if(previous)duplicates.set(s.id,previous);else seen.set(s.identityKey,s.id)}return values.map(s=>({...s,duplicateOf:duplicates.get(s.id)}))}
export async function collectProvider(id:string,ctx:Context,signal:AbortSignal):Promise<ProviderSnapshot>{
 const profile=ctx.profiles?.find(p=>p.id===id);const providerId=profile?.providerId??id;const entry=catalog.find(c=>c.id===providerId);const d=ctx.detections.find(x=>x.id===providerId);
 const base:ProviderSnapshot={id,providerId,profileLabel:profile?.label,auth:'unknown',metrics:[],state:'unavailable',message:'unavailable',observedAt:Date.now()};
 if(!entry||entry.support==='planned')return {...base,state:'planned',message:'planned'};
 if(entry.billing==='upstream')return {...base,message:'upstream'};
 if(!d?.installed)return {...base,message:d?.configPresent?'configOnly':'notInstalled'};
 if(['codex','claude','ollama','lmstudio'].includes(providerId)&&!ctx.consents.includes(id))return {...base,state:'consent',message:'consent'};
 try{
  if(providerId==='codex'&&d.executable){const data=await codexStatus(d.executable,signal,profile?.env);const a=data.account;
   if(!a)return {...base,auth:'required',message:'signIn'};
   const metrics=parseCodexLimits(data.limits);return {...base,auth:'connected',account:maskAccount(a.email),plan:a.type==='chatgpt'&&typeof a.planType==='string'?a.planType:a.type==='apiKey'?'API':undefined,identityKey:typeof data.limits?.accountId==='string'?createHash('sha256').update('codex:'+data.limits.accountId).digest('hex'):undefined,metrics,state:metrics.length?'ready':'unavailable',message:metrics.length?'providerData':a.type==='apiKey'?'apiSeparate':'quotaUnavailable'};
  }
  if(providerId==='claude'&&d.executable){const a=await claudeStatus(d.executable,signal,profile?.env);return {...base,auth:a.loggedIn?'connected':'required',account:maskAccount(a.email),plan:typeof a.subscriptionType==='string'?a.subscriptionType:undefined,message:a.loggedIn?'claudeQuotaUnavailable':'signIn'};}
  if(id==='ollama'||id==='lmstudio'){
   const url=id==='ollama'?'http://127.0.0.1:11434/api/tags':'http://127.0.0.1:1234/v1/models';
   const res=await fetch(url,{signal:AbortSignal.any([signal,AbortSignal.timeout(3000)]),redirect:'error'});if(!res.ok)throw Error('local-offline');const json=await res.json() as any;const models=id==='ollama'?json.models:json.data;if(!Array.isArray(models))throw Error('malformed');
   return {...base,state:'ready',message:'localModels',metrics:[{id:id+':models',label:'models',used:models.length,unit:'models',source:'local',observedAt:Date.now()}]};
  }
  return {...base,message:providerId==='gemini'?'geminiQuotaUnavailable':'discoveryOnly'};
 }catch{return {...base,state:'error',message:signal.aborted?'cancelled':'collectionFailed'}}
}
