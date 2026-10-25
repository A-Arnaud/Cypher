import {metricValue} from './metric-format';
import type {AppState} from './model';import {catalog} from './catalog';
export interface TaskbarItem {id:string;providerId:string;label:string;text:string;stale:boolean}
export function taskbarSummary(state:AppState):{items:TaskbarItem[];extraCount:number}{
 const values:TaskbarItem[]=[];
 for(const id of state.settings.pinned){
  const profile=state.profiles?.find(p=>p.id===id),snapshot=state.providers.find(p=>p.id===id);if(snapshot?.duplicateOf)continue;
  const providerId=profile?.providerId??snapshot?.providerId??id,entry=catalog.find(c=>c.id===providerId);if(!entry)continue;
  const metrics=snapshot&&(snapshot.state==='ready'||snapshot.state==='stale')?snapshot.metrics:[];
  const numbers=metrics.map(m=>m.remainingPercent).filter((n):n is number=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100);
  values.push({id,providerId,label:entry.name+(profile?' · '+(profile.label==='default'?(state.settings.language==='fr'?'Principal':'Default'):profile.label):''),text:numbers.length?Math.round(Math.min(...numbers))+'%':'—',stale:snapshot?.state==='stale'});
 }
 return {items:values.slice(0,3),extraCount:Math.max(0,values.length-3)};
}
