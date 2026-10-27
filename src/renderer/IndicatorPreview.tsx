import type {AppState} from '../shared/model';
import {taskbarSummary} from '../shared/taskbar';
import {ProviderLogo} from './ProviderLogo';
export function IndicatorPreview({state}:{state:AppState}){
 const fr=state.settings.language==='fr',items=taskbarSummary(state).items,example=!items.length;
 const shown=example?[{id:'example',providerId:'codex',quotas:[{label:'5h',text:'75%'},{label:'7d',text:'62%'}]}]:items;
 const label=(s:string)=>s==='session'?(fr?'Session':'Session'):s==='weekly'?(fr?'Semaine':'Weekly'):fr?s.replace(/d$/,'j'):s;
 return <div className="indicator-guide"><p className="indicator-caption">{example?(fr?'Exemple de lecture':'Reading example'):(fr?'Dans votre barre':'In your bar')}</p><div className="indicator-preview">{shown.map(item=>{
  const quotas=item.quotas??[],weeklyOnly=quotas.length===1&&['weekly','7d'].includes(quotas[0].label),rows=weeklyOnly?[undefined,quotas[0]]:[quotas[0],quotas[1]];
  return <div className="indicator-preview-item" key={item.id}><ProviderLogo providerId={item.providerId}/><div>{rows.map((q,i)=><div className="indicator-preview-row" key={i}><span>{q?label(q.label):'—'}</span><strong>{q?.text??'—'}</strong></div>)}</div></div>;
 })}</div><p className="setting-hint">{fr?'Session en haut, semaine en bas. Les pourcentages indiquent ce qu’il vous reste.':'Session on top, week below. Percentages show what remains.'}</p></div>;
}
