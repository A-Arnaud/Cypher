import {displayedAccountIds} from './accounts-view';
import type {AppState,Metric} from './model';import {catalog} from './catalog';
export interface TaskbarQuota {label:string;text:string}
export interface TaskbarItem {id:string;providerId:string;label:string;text:string;stale:boolean;quotas?:TaskbarQuota[]}
function shortLabel(metric:Metric):string {
 if(metric.label==='session')return 'session';if(metric.label==='weekly')return 'weekly';
 const minutes=/^(\d+(?:\.\d+)?)m$/.exec(metric.label);if(!minutes)return 'quota';const n=Number(minutes[1]);
 if(!Number.isFinite(n)||n<=0||n>525600)return 'quota';
 return n%1440===0?n/1440+'d':n%60===0?n/60+'h':Math.round(n)+'m';
}
/** Keep the actual short/weekly windows separate. Never label an arbitrary limit as 5h or 7d. */
export function taskbarQuotas(metrics:Metric[]):TaskbarQuota[]{
 const percent=metrics.filter(m=>m.unit==='percent');
 const weekly=percent.find(m=>m.label==='weekly'||m.label==='10080m');
 const short=percent.find(m=>m!==weekly&&(m.label==='session'||m.label==='300m'||m.id.endsWith(':primary')));
 const ordered=[short,weekly,...percent].filter((m,index,all):m is Metric=>!!m&&all.indexOf(m)===index).slice(0,2);
 return ordered.map(m=>({label:shortLabel(m),text:typeof m.remainingPercent==='number'&&Number.isFinite(m.remainingPercent)&&m.remainingPercent>=0&&m.remainingPercent<=100?Math.round(m.remainingPercent)+'%':'—'}));
}
export function taskbarSummary(state:AppState):{items:TaskbarItem[];extraCount:number}{
 const values:TaskbarItem[]=[];
 for(const id of displayedAccountIds(state)){
  const profile=state.profiles?.find(p=>p.id===id),snapshot=state.providers.find(p=>p.id===id);if(snapshot?.duplicateOf)continue;
  const providerId=profile?.providerId??snapshot?.providerId??id,entry=catalog.find(c=>c.id===providerId);if(!entry)continue;
  const metrics=snapshot&&(snapshot.state==='ready'||snapshot.state==='stale')?snapshot.metrics:[];
  const numbers=metrics.map(m=>m.remainingPercent).filter((n):n is number=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100);
  values.push({id,providerId,label:entry.name+(profile?' · '+(profile.label==='default'?(state.settings.language==='fr'?'Principal':'Default'):profile.label):''),text:numbers.length?Math.round(Math.min(...numbers))+'%':'—',stale:snapshot?.state==='stale',quotas:taskbarQuotas(metrics)});
 }
 return {items:values.slice(0,3),extraCount:Math.max(0,values.length-3)};
}
