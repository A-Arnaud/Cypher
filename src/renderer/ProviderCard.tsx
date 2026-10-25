import type {CSSProperties} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';
import type {CatalogEntry} from '../shared/catalog';
import {copy} from '../shared/i18n';
import {ProviderLogo} from './ProviderLogo';
import {metricValue,metricLabel} from '../shared/metric-format';
interface Props {entry:CatalogEntry;profileId?:string;state:AppState;bridge:QuotaBridge;onConnect:()=>void}
export function ProviderCard({entry,profileId=entry.id,state,bridge,onConnect}:Props){
 const lang=state.settings.language;const t=(key:string)=>copy(lang,key);

  const profile=state.profiles?.find(p=>p.id===profileId);const s=state.providers.find(p=>p.id===profileId);const d=state.detections.find(p=>p.id===entry.id);const metrics=s?.metrics??[];const approved=state.settings.consents.includes(profileId);
  return <article id={'profile-card-'+profileId} className={'provider-card '+(state.settings.compact?'compact':'')} style={{'--accent':entry.color} as CSSProperties}>
   <div className="provider-heading"><div className="provider-logo"><ProviderLogo providerId={entry.id}/></div><div className="provider-identity"><h2>{entry.name}</h2><span>{profile&&<>{profile.label==='default'?t('profileDefault'):profile.label} · </>}{s?.plan??(entry.kind==='local'?t('local'):t('planUnknown'))}{s?.account&&<> · {s.account}</>}</span></div><span className={'status-dot '+(s?.state==='ready'?'ready':s?.state==='stale'||s?.state==='error'?'warning':'')} title={t(s?.state==='ready'?'live':s?.state==='error'?'error':'unknown')}/></div>
   {metrics.length?metrics.map(m=><div className="metric" key={m.id}>
    <div className="metric-line"><span>{metricLabel(m,lang)}</span>{m.unit==='percent'&&m.remainingPercent!==undefined?<strong>{new Intl.NumberFormat(lang,{maximumFractionDigits:0}).format(m.remainingPercent)}<small>% {t('remaining')}</small></strong>:<strong>{metricValue(m,lang)}{m.unit!=='currency'&&<small> {t(m.unit)}</small>}</strong>}</div>
    {m.remainingPercent!==undefined&&<div className={'meter '+(m.remainingPercent<=20?'low':'')} role="progressbar" aria-label={metricLabel(m,lang)} aria-valuenow={m.remainingPercent} aria-valuemin={0} aria-valuemax={100}><i style={{width:m.remainingPercent+'%'}}/></div>}
    {m.resetAt!==undefined&&Number.isFinite(m.resetAt)&&Math.abs(m.resetAt)<=8640000000000000&&<div className="metric-note">{t('reset')} · {new Intl.DateTimeFormat(lang,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(m.resetAt)}</div>}
   </div>):<div className="quota-empty"><span>{t('noQuota')}</span><strong>—</strong><div className="empty-track"/></div>}
   {!state.settings.compact&&<p className="provider-explanation">{t(s?.duplicateOf?'duplicateAccount':s?.message??'unavailable')}</p>}
   <div className="card-bottom"><span className={'micro-badge '+(s?.state==='ready'?'success':'')}>{s?.state==='stale'?t('stale'):s?.auth==='connected'?t('connected'):d?.installed?t('installed'):d?.configPresent?t('config'):t('notInstalled')}</span><button className="text-action" title={t('openUsage')} aria-label={t('openUsage')+' '+entry.name} disabled={!state.desktop} onClick={()=>void bridge.openProvider(entry.id)}><ArrowUpRight size={14}/></button></div>
   {s?.state==='consent'&&!approved&&state.desktop&&<button className="connect-inline" onClick={()=>onConnect()}><Plus size={12}/>{t('waiting')}</button>}
  </article>
 }
