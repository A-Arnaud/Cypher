import {catalog} from './catalog';
import type {AppState} from './model';

export type HealthKind='fresh'|'attention'|'waiting'|'limited'|'paused'|'duplicate';
export type HealthReason='fresh'|'stale'|'signIn'|'consent'|'readError'|'lowQuota'|'notConnected'|'waiting'|'limited'|'paused'|'duplicate';
export interface ProviderHealth {kind:HealthKind;reason:HealthReason;observedAt?:number;source?:'provider'|'local'|'mixed'}
export function providerId(state:AppState,id:string){return state.profiles?.find(p=>p.id===id)?.providerId??id}
export function providerHealth(state:AppState,id:string,now=Date.now()):ProviderHealth {
 const entry=catalog.find(c=>c.id===providerId(state,id)),snapshot=state.providers.find(p=>p.id===id);
 const metrics=snapshot?.metrics??[];
 const times=metrics.map(m=>m.observedAt).filter(n=>Number.isFinite(n)&&n>0&&n<=now+60000);
 const observedAt=times.length?Math.min(...times):undefined;
 const sources=new Set(metrics.map(m=>m.source));
 const base={observedAt,source:sources.size>1?'mixed' as const:sources.has('local')?'local' as const:sources.has('provider')?'provider' as const:undefined};
 const result=(kind:HealthKind,reason:HealthReason):ProviderHealth=>({...base,kind,reason});
 if(snapshot?.duplicateOf)return result('duplicate','duplicate');
 if(!entry||entry.support==='planned'||snapshot?.state==='planned')return result('limited','limited');
 if(snapshot?.state==='consent')return result('attention',snapshot.message==='apiKeyRequired'?'notConnected':'consent');
 if(snapshot?.auth==='required')return result('attention','signIn');
 if(snapshot?.state==='error')return result('attention','readError');
 if(snapshot?.state==='stale')return result('attention','stale');
 if(state.settings.paused)return result('paused','paused');
 if(snapshot?.state==='ready'&&observedAt!==undefined){
  if(metrics.length!==times.length||now-observedAt>Math.max(180000,state.settings.pollSeconds*3000))return result('attention','stale');
  const threshold=Math.max(-1,...state.settings.alertThresholds);
  if(metrics.some(m=>m.source==='provider'&&m.unit==='percent'&&m.remainingPercent!==undefined&&Number.isFinite(m.remainingPercent)&&m.remainingPercent>=0&&m.remainingPercent<=threshold))return result('attention','lowQuota');
  return result('fresh','fresh');
 }
 if(snapshot?.message==='claudeQuotaUnavailable'||snapshot?.message==='geminiQuotaUnavailable'||snapshot?.message==='discoveryOnly')return result('limited','limited');
 if(state.refreshing||snapshot?.auth==='connected'||state.settings.consents.includes(id))return result('waiting','waiting');
 return result('attention','notConnected');
}
export function pinnedHealth(state:AppState,now=Date.now()){
 return [...new Set(state.settings.pinned)].filter(id=>catalog.some(c=>c.id===providerId(state,id))).map(id=>({id,...providerHealth(state,id,now)}));
}
