import {createHash} from 'node:crypto';
import type {ProfileRecord} from './profiles';
import {catalog} from '../shared/catalog';
import type {ProviderSnapshot} from '../shared/model';
import type {Detection} from './discovery';
import {codexStatus,claudeStatus} from './cli';
import {parseCodexLimits,maskAccount} from './metrics';
import {isApiProvider,isLocalProvider,localProviderUrls,type ApiProvider} from '../shared/connectors';
import {collectApiProvider} from './api-providers';
import {readJson} from './read-json';
import {CollectionQueue} from './collection-queue';
const cliCollections=new CollectionQueue();
export function shouldPollProvider(snapshot:ProviderSnapshot):boolean{
 const provider=snapshot.providerId??snapshot.id;
 return !['planned','consent'].includes(snapshot.state)&&!['notInstalled','configOnly','cliMissing'].includes(snapshot.message)&&(['codex','claude'].includes(provider)||isApiProvider(provider)||isLocalProvider(provider));
}
export interface Context {detections:Detection[];consents:string[];profiles?:ProfileRecord[];apiKey?:(id:ApiProvider)=>string|undefined}
export function dedupeSnapshots(values:ProviderSnapshot[]):ProviderSnapshot[]{const seen=new Map<string,string>();const duplicates=new Map<string,string>();for(const s of [...values].sort((a,b)=>a.id.localeCompare(b.id))){if(s.auth!=='connected'||!s.identityKey)continue;const previous=seen.get(s.identityKey);if(previous)duplicates.set(s.id,previous);else seen.set(s.identityKey,s.id)}return values.map(s=>({...s,duplicateOf:duplicates.get(s.id)}))}
export async function collectProvider(id:string,ctx:Context,signal:AbortSignal):Promise<ProviderSnapshot>{
 const profile=ctx.profiles?.find(p=>p.id===id);const providerId=profile?.providerId??id;const entry=catalog.find(c=>c.id===providerId);const d=ctx.detections.find(x=>x.id===providerId);
 const base:ProviderSnapshot={id,providerId,profileLabel:profile?.label,auth:'unknown',metrics:[],state:'unavailable',message:'unavailable',observedAt:Date.now()};
 if(isApiProvider(providerId)){if(!ctx.consents.includes(id))return {...base,state:'consent',message:'apiKeyRequired'};try{return await collectApiProvider(providerId,ctx.apiKey?.(providerId),signal)}catch(e){return {...base,state:'error',message:e instanceof Error&&e.message==='credentialStorageUnavailable'?'credentialStorageUnavailable':'apiKeyUnreadable'}}}
 if(!entry||entry.support==='planned')return {...base,state:'planned',message:'planned'};
 if(entry.billing==='upstream')return {...base,message:'upstream'};
 if(!d?.installed&&!isLocalProvider(providerId))return {...base,message:d?.configPresent?'configOnly':'notInstalled'};
 if(['codex','claude','gemini'].includes(providerId)&&!d?.executable)return {...base,message:'cliMissing'};
 if((['codex','claude'].includes(providerId)||isLocalProvider(providerId))&&!ctx.consents.includes(id))return {...base,state:'consent',message:'consent'};
 try{
  if(providerId==='codex'&&d?.executable){const data=await cliCollections.run(signal,()=>codexStatus(d.executable!,signal,profile?.env));const a=data.account;
   if(!a)return {...base,auth:'required',message:'signIn'};
   if(data.limitsError)return {...base,auth:data.limitsError==='session-required'?'required':'connected',account:maskAccount(a.email),plan:typeof a.planType==='string'?a.planType:undefined,state:'error',message:data.limitsError==='session-required'?'sessionExpired':'quotaReadFailed'};
   const metrics=parseCodexLimits(data.limits);return {...base,auth:'connected',account:maskAccount(a.email),plan:a.type==='chatgpt'&&typeof a.planType==='string'?a.planType:a.type==='apiKey'?'API':undefined,identityKey:typeof data.limits?.accountId==='string'?createHash('sha256').update('codex:'+data.limits.accountId).digest('hex'):undefined,metrics,state:metrics.length?'ready':'unavailable',message:metrics.length?'providerData':a.type==='apiKey'?'apiSeparate':'quotaUnavailable'};
  }
  if(providerId==='claude'&&d?.executable){const a=await cliCollections.run(signal,()=>claudeStatus(d.executable!,signal,profile?.env));return {...base,auth:a.loggedIn?'connected':'required',account:maskAccount(a.email),plan:typeof a.subscriptionType==='string'?a.subscriptionType:undefined,message:a.loggedIn?'claudeQuotaUnavailable':'signIn'};}
  if(isLocalProvider(id)){
   const url=localProviderUrls[id];
   const res=await fetch(url,{signal:AbortSignal.any([signal,AbortSignal.timeout(3000)]),redirect:'error'});if(!res.ok)throw Error('local-offline');const json=await readJson(res);const models=id==='ollama'?json.models:json.data;if(!Array.isArray(models))throw Error('malformed');
   return {...base,state:'ready',message:'localModels',metrics:[{id:id+':models',label:'models',used:models.length,unit:'models',source:'local',observedAt:Date.now()}]};
  }
  return {...base,message:providerId==='gemini'?'geminiQuotaUnavailable':'discoveryOnly'};
 }catch(e){const reason=e instanceof Error?e.message:'';return {...base,auth:reason==='session-required'?'required':'unknown',state:'error',message:signal.aborted?'cancelled':isLocalProvider(providerId)?'localOffline':reason==='session-required'?'sessionExpired':reason==='timeout'?'cliTimeout':'collectionFailed'}}
}
