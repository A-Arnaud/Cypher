import type {Metric} from '../shared/model';
export function parseCodexLimits(data:unknown,now=Date.now()):Metric[]{
 if(!data||typeof data!=='object')return [];
 const d=data as Record<string,any>;
 const buckets=d.rateLimitsByLimitId && typeof d.rateLimitsByLimitId==='object' && Object.keys(d.rateLimitsByLimitId).length?Object.entries(d.rateLimitsByLimitId):[['codex',d.rateLimits]];
 const result:Metric[]=[];
 for(const [id,raw] of buckets){if(!raw||typeof raw!=='object')continue;const bucket=raw as Record<string,any>;
  for(const key of ['primary','secondary']){
   const w=bucket[key];if(!w||typeof w.usedPercent!=='number'||!Number.isFinite(w.usedPercent)||w.usedPercent<0||w.usedPercent>100)continue;
   const mins=typeof w.windowDurationMins==='number'&&w.windowDurationMins>0?w.windowDurationMins:undefined;
   result.push({id:`${id}:${key}`,label:mins?`${mins}m`:(key==='primary'?'session':'weekly'),used:w.usedPercent,limit:100,remainingPercent:100-w.usedPercent,unit:'percent',resetAt:typeof w.resetsAt==='number'&&Number.isFinite(w.resetsAt)&&w.resetsAt>0?w.resetsAt*1000:undefined,source:'provider',observedAt:now});
  }
 }
 return result;
}
export function maskAccount(s:unknown):string|undefined{if(typeof s!=='string'||!s)return undefined;const parts=s.split('@');return parts.length===2?parts[0].slice(0,1)+'•••@'+parts[1]:'•••'}
