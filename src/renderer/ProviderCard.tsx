import {providerHealth} from '../shared/health';
import {healthExplanation,healthLabel,readingAge,workspaceCopy} from '../shared/workspace-copy';
import {experienceCopy} from '../shared/experience-copy';import {resetCountdown} from '../shared/friendly-time';
import type {CSSProperties} from 'react';import {ArrowUpRight,Check,ChevronDown,RefreshCw} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';import type {CatalogEntry} from '../shared/catalog';
import {copy} from '../shared/i18n';import {ProviderLogo} from './ProviderLogo';import {metricValue,metricLabel} from '../shared/metric-format';
interface Props {now?:number;entry:CatalogEntry;profileId?:string;state:AppState;bridge:QuotaBridge;onConnect:()=>void;onRetry?:()=>void;busy?:boolean}
export function ProviderCard({now=Date.now(),entry,profileId=entry.id,state,bridge,onConnect,onRetry,busy=false}:Props){
 const health=providerHealth(state,profileId,now),lang=state.settings.language,w=experienceCopy(lang),t=(key:string)=>copy(lang,key,state.platform);
 const profile=state.profiles?.find(p=>p.id===profileId),snapshot=state.providers.find(p=>p.id===profileId),metrics=snapshot?.metrics??[];
 const connected=snapshot?.auth==='connected',needsConnection=['consent','signIn','notConnected'].includes(health.reason);
 const stale=health.reason==='stale',retry=!needsConnection&&health.kind==='attention';
 const meta=[profile?.label==='default'?t('profileDefault'):profile?.label,snapshot?.plan].filter(Boolean).join(' · ');
 const status=connected&&!metrics.length?w.limited:health.kind==='fresh'?w.updated:healthLabel(lang,health.kind);
 return <article id={'profile-card-'+profileId} className={'provider-card account-card health-'+health.kind+' '+(state.settings.compact?'compact':'')} style={{'--accent':entry.color} as CSSProperties}>
  <div className="provider-heading"><div className="provider-logo"><ProviderLogo providerId={entry.id}/></div><div className="provider-identity"><h2>{entry.name}</h2>{meta&&<span>{meta}</span>}</div><span className={'account-status '+(connected?'connected':'')} title={healthExplanation(lang,health.reason)}>{connected&&<Check size={12}/>}<span>{status}</span></span></div>
  {metrics.length?<div className="account-readings">{metrics.map(m=>{
   const percent=m.unit==='percent'&&m.remainingPercent!==undefined,hasReset=m.resetAt!==undefined&&Number.isFinite(m.resetAt)&&Math.abs(m.resetAt)<=8640000000000000;
   return <div className={'metric '+(stale?'stale':'')} key={m.id}>
    <div className="metric-line"><span>{metricLabel(m,lang)}</span><strong>{percent?<>{new Intl.NumberFormat(lang,{maximumFractionDigits:0}).format(m.remainingPercent!)}<small>% {w.remaining}</small></>:<>{metricValue(m,lang)}{m.unit!=='currency'&&<small> {t(m.unit)}</small>}</>}</strong></div>
    {m.remainingPercent!==undefined&&<div className={'meter '+(m.remainingPercent<=20?'low':'')} role="progressbar" aria-label={metricLabel(m,lang)} aria-valuenow={m.remainingPercent} aria-valuemin={0} aria-valuemax={100}><i style={{width:m.remainingPercent+'%'}}/></div>}
    {hasReset&&<div className="metric-note" title={new Date(m.resetAt!).toLocaleString(lang)}>{m.resetAt!>now?w.resetIn+' '+resetCountdown(m.resetAt!,now,lang):w.resetNow}</div>}
   </div>;
  })}</div>:<div className="account-empty"><p>{connected?w.noQuota:needsConnection?t(health.reason==='consent'?'consent':'signIn'):t(snapshot?.message??'unavailable')}</p>{connected&&<button className="provider-visit" disabled={!state.desktop} onClick={()=>void bridge.openProvider(entry.id)}>{w.openProvider}<ArrowUpRight size={13}/></button>}</div>}
  {health.kind==='attention'&&<div className="account-help"><span>{healthExplanation(lang,health.reason)}</span><button disabled={busy||state.refreshing||!state.desktop} onClick={needsConnection?onConnect:()=>onRetry?onRetry():void bridge.refresh()}>{retry?<RefreshCw size={13}/>:null}{retry?w.retry:health.reason==='consent'?t('allow'):w.connect}</button></div>}
  <div className="card-bottom"><span className="reading-age">{readingAge(lang,health.observedAt,now)}</span><details className="reading-details"><summary>{w.details}<ChevronDown size={12}/></summary><div className="reading-detail-content"><p>{t(snapshot?.duplicateOf?'duplicateAccount':snapshot?.message??'unavailable')}</p>{health.source&&<p>{w.source} : {workspaceCopy(lang)[health.source]}</p>}{snapshot?.account&&<p>{snapshot.account}</p>}<button className="provider-visit" disabled={!state.desktop} onClick={()=>void bridge.openProvider(entry.id)}>{w.openProvider}<ArrowUpRight size={13}/></button></div></details></div>
 </article>;
}
