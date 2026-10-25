import type {AppState} from './model';

// Static catalogue entries and failed reads are not successful quota updates.
export function latestObservation(state:AppState):number{
 const pinned=new Set(state.settings.pinned);
 return Math.max(0,...state.providers.filter(p=>pinned.has(p.id)).flatMap(p=>p.metrics.map(m=>m.observedAt)).filter(n=>Number.isFinite(n)&&n>0&&n<=8640000000000000));
}
