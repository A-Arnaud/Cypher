import {CircleCheck,TriangleAlert} from 'lucide-react';
import type {AppState} from '../shared/model';
import {pinnedHealth} from '../shared/health';
import {workspaceCopy} from '../shared/workspace-copy';
export function HealthOverview({state,now,attentionOnly,setAttentionOnly}:{state:AppState;now:number;attentionOnly:boolean;setAttentionOnly:(value:boolean)=>void}){
 const health=pinnedHealth(state,now),t=workspaceCopy(state.settings.language),attention=health.filter(h=>h.kind==='attention').length,fresh=health.filter(h=>h.kind==='fresh').length;
 if(!health.length)return null;
 return <div className="health-overview" aria-label={t.overview}><button className={!attentionOnly?'selected':''} aria-pressed={!attentionOnly} onClick={()=>setAttentionOnly(false)}>{t.all}<span>{health.length}</span></button><button className={'health-attention '+(attentionOnly?'selected':'')} aria-pressed={attentionOnly} onClick={()=>setAttentionOnly(true)}><TriangleAlert size={12}/>{t.attention}<span>{attention}</span></button><span className="health-fresh"><CircleCheck size={12}/>{fresh} {t.fresh.toLocaleLowerCase()}</span></div>;
}
