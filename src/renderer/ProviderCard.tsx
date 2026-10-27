import {providerHealth} from '../shared/health';
import {healthExplanation,healthLabel,readingAge,workspaceCopy} from '../shared/workspace-copy';
import type {CSSProperties} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';
import type {CatalogEntry} from '../shared/catalog';
import {copy} from '../shared/i18n';
import {ProviderLogo} from './ProviderLogo';
import {metricValue,metricLabel} from '../shared/metric-format';
interface Props {now?:number;entry:CatalogEntry;profileId?:string;state:AppState;bridge:QuotaBridge;onConnect:()=>void}
export function ProviderCard({now=Date.now(),entry,profileId=entry.id,state,bridge,onConnect}:Props){
 const health=providerHealth(state,profileId,now);const lang=state.settings.language;const t=(key:string)=>copy(lang,key);

  const profile=state.profiles?.find(p=>p.id===profileId);const s=state.providers.find(p=>p.id===profileId);const d=state.detections.find(p=>p.id===entry.id);const metrics=s?.metrics??[];const approved=state.settings.consents.includes(profileId);
  return <article id={'profile-card-'+profileId} className={'provider-card health-'+health.kind+' '+(state.settings.compact?'compact':'')} style={{'--accent':entry.color} as CSSProperties}>
   <div className="provider-heading"><div className="provider-logo"><ProviderLogo providerId={entry.id}/></div><div className="provider-identity"><h2>{entry.name}</h2><span>{profile&&<>{profile.label==='default'?t('profileDefault'):profile.label} · </>}{s?.plan??(entry.kind==='local'?t('local'):t('planUnknown'))}{s?.account&&<> · {s.account}</>}</span></div><span className={'status-dot '+(health.kind==='fresh'?'ready':health.kind==='attention'?'warning':'')} title={healthExplanation(lang,health.reason)}/></div>
   {metrics.length?metrics.map(m=><div className={'metric '+(health.reason==='stale'?'stale':'')} key={m.id}>
    <div className="metric-line"><span>{metricLabel(m,lang)}</span>{m.unit==='percent'&&m.remainingPercent!==undefined?<strong>{new Intl.NumberFormat(lang,{maximumFractionDigits:0}).format(m.remainingPercent)}<small>% {t('remaining')}</small></strong>:<strong>{metricValue(m,lang)}{m.unit!=='currency'&&<small> {t(m.unit)}</small>}</strong>}</div>
    {m.remainingPercent!==undefined&&<div className={'meter '+(m.remainingPercent<=20?'low':'')} role="progressbar" aria-label={metricLabel(m,lang)} aria-valuenow={m.remainingPercent} aria-valuemin={0} aria-valuemax={100}><i style={{width:m.remainingPercent+'%'}}/></div>}
    {m.resetAt!==undefined&&Number.isFinite(m.resetAt)&&Math.abs(m.resetAt)<=8640000000000000&&<div className="metric-note">{t('reset')} · {new Intl.DateTimeFormat(lang,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(m.resetAt)}</div>}
   </div>):<div className="quota-empty"><span>{t('noQuota')}</span><strong>—</strong><div className="empty-track"/></div>}
   {!state.settings.compact&&<p className="provider-explanation">{t(s?.duplicateOf?'duplicateAccount':s?.message??'unavailable')}</p>}
   {health.kind==='attention'&&<p className="health-explanation">{healthExplanation(lang,health.reason)}</p>}
   <p className="reading-age" title={health.observedAt?new Date(health.observedAt).toLocaleString(lang):undefined}>{readingAge(lang,health.observedAt,now)}{health.source&&<> · {workspaceCopy(lang)[health.source]}</>}</p>
   <div className="card-bottom"><span className={'micro-badge '+(health.kind==='fresh'?'success':'')} title={healthExplanation(lang,health.reason)}>{healthLabel(lang,health.kind)}</span><button className="text-action" title={t('openUsage')} aria-label={t('openUsage')+' '+entry.name} disabled={!state.desktop} onClick={()=>void bridge.openProvider(entry.id)}><ArrowUpRight size={14}/></button></div>
   {health.kind==='attention'&&['consent','signIn','notConnected'].includes(health.reason)&&state.desktop&&<button className="connect-inline" onClick={()=>onConnect()}><Plus size={12}/>{t('connections')}</button>}
  </article>
 }
