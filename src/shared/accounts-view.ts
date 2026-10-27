import type {AppState} from './model';
/** Keep untouched placeholder services out of the user's account list. */
export function displayedAccountIds(state:AppState):string[]{
 return [...new Set(state.settings.pinned)].filter(id=>{
  const snapshot=state.providers.find(p=>p.id===id);
  return !!snapshot?.metrics.length||snapshot?.auth==='connected'||state.settings.consents.includes(id)||state.configuredApiProviders?.includes(id)||state.loginProfileIds?.includes(id)||!['codex','claude','gemini'].includes(id);
 });
}
export function hasSavedConnection(state:AppState):boolean{
 return !!state.settings.consents.length||!!state.configuredApiProviders?.length||state.providers.some(p=>p.auth==='connected'||p.metrics.length>0)||!!state.loginProfileIds?.length;
}
