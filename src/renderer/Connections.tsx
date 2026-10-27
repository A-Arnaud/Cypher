import {ConnectionOptions} from './ConnectionOptions';
import {ApiConnection} from './ApiConnection';import {isApiProvider,isLocalProvider} from '../shared/connectors';
import {ProviderLogo} from './ProviderLogo';import {ArrowUpRight,Check,LogIn,Pin,RefreshCw,ShieldCheck} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';import type {CatalogEntry} from '../shared/catalog';import type {CSSProperties} from 'react';import {copy} from '../shared/i18n';
interface Props {state:AppState;entries:CatalogEntry[];bridge:QuotaBridge;busy:boolean;action:(fn:()=>Promise<void>|undefined)=>Promise<void>;pin:(id:string)=>void;consent:(id:string,allowed:boolean)=>void}
export function Connections({state,entries,bridge,busy,action,pin,consent}:Props){const t=(key:string)=>copy(state.settings.language,key,state.platform);return <><div className="connection-list">{entries.map(c=>{
 const d=state.detections.find(x=>x.id===c.id),s=state.providers.find(x=>x.id===c.id);const profileTool=['codex','claude','gemini'].includes(c.id);const profiles=state.profiles?.filter(p=>p.providerId===c.id)??[];const executable=!!d?.executable&&!d?.builtIn;const readable=!!d?.executable;const existing=profiles.filter(p=>p.configPresent||p.authFilePresent||state.loginProfileIds?.includes(p.id)||state.settings.consents.includes(p.id));
 return <article className="connection" key={c.id} style={{'--accent':c.color} as CSSProperties}>
 <div className="connection-header"><span className="provider-logo small"><ProviderLogo providerId={c.id}/></span><div><h2>{c.name}</h2><span className="connection-meta">{c.support==='planned'?t('planned'):isApiProvider(c.id)?t(state.configuredApiProviders?.includes(c.id)?'apiKeySaved':'apiKeyRequired'):d?.installed?t('installed'):d?.builtIn?t('readyToConnect'):d?.configPresent?t('config'):t('notInstalled')}</span></div>{!profileTool&&c.support!=='planned'&&<button className={'icon-button pin '+(state.settings.pinned.includes(c.id)?'pinned':'')} title={t('pin')} aria-label={t('pin')+' '+c.name} onClick={()=>pin(c.id)}><Pin size={14}/></button>}</div>
 {c.support!=='planned'&&<>{isApiProvider(c.id)?<><p>{t(s?.message??'apiKeyRequired')}</p>{state.desktop?<ApiConnection providerId={c.id} configured={state.configuredApiProviders?.includes(c.id)??false} bridge={bridge} language={state.settings.language}/>:<p>{t('desktopOnly')}</p>}</>:profileTool?<>
 <div className="automatic-connections"><h3>{t('automaticConnections')}</h3><p className="profile-help">{t('automaticConnectionsHint')}</p>{!existing.length&&<p>{t('noAutomaticSession')}</p>}
 {c.id==='claude'&&<p>{t('claudeQuotaSupport')}</p>}
 {c.id==='gemini'&&<p>{t('geminiQuotaSupport')}</p>}
 {existing.map(p=>{const snapshot=state.providers.find(s=>s.id===p.id),approved=state.settings.consents.includes(p.id),active=state.loginProfileIds?.includes(p.id);return <div className="profile-row" data-profile-id={p.id} key={p.id}>
 <div className="profile-heading"><strong>{p.label==='default'?t('profileDefault'):p.label}</strong><button className={'icon-button pin '+(state.settings.pinned.includes(p.id)?'pinned':'')} aria-label={t(state.settings.pinned.includes(p.id)?'unpin':'pin')+' '+p.label} title={t(state.settings.pinned.includes(p.id)?'unpin':'pin')} onClick={()=>pin(p.id)}><Pin size={12}/></button></div>
 <span className="profile-state">{snapshot?.auth==='connected'?[snapshot.account??t('connected'),snapshot.plan??t('planUnknown')].join(' · '):p.authFilePresent?t('profileCandidate'):t('profileEmpty')}</span>
 {snapshot?.duplicateOf&&<p>{t('duplicateAccount')}</p>}
 {snapshot&&<p>{t(snapshot.message)}</p>}
 {state.desktop&&readable&&<><button className={'consent-button '+(approved?'approved':'')} disabled={busy} onClick={()=>consent(p.id,!approved)}>{approved?<Check size={12}/>:<ShieldCheck size={12}/>} {t(approved?'revoke':'allow')}</button><button className="login-button" disabled={busy||active} onClick={()=>void action(()=>bridge.login?.(p.id))}><LogIn size={12}/>{t(active?(state.browserLoginProfileIds?.includes(p.id)?'browserLoginOpen':'loginOpen'):snapshot?.auth==='connected'?'relogin':'login')}</button></>}
 {state.loginErrors?.[p.id]&&<p role="alert">{t(state.loginErrors[p.id])}</p>}{state.browserLoginProfileIds?.includes(p.id)&&bridge.cancelLogin&&<button className="provider-link" onClick={()=>void action(()=>bridge.cancelLogin?.(p.id))}>{t('cancelLogin')}</button>}
 </div>})}</div>
 {state.desktop&&<ConnectionOptions providerId={c.id} state={state} bridge={bridge} busy={busy} executable={executable} action={action}/>}
 </>:<><p>{t(s?.message??'discoveryOnly')}</p>{isLocalProvider(c.id)&&state.desktop&&<button className="consent-button" onClick={()=>consent(c.id,!state.settings.consents.includes(c.id))}>{t(state.settings.consents.includes(c.id)?'revoke':'allow')}</button>}</>}
 </>}
 {state.desktop&&<button className="provider-link" onClick={()=>void action(()=>bridge.openProvider(c.id))}>{t('openUsage')}<ArrowUpRight size={12}/></button>}
 </article>
 })}{!entries.length&&<p className="no-results">{t('noResults')}</p>}</div><p className="privacy-note">{t('noPremiumGuess')}</p><button className="add-service" disabled={busy||state.refreshing} onClick={()=>void action(()=>bridge.refresh())}><RefreshCw size={12}/>{t('rescan')}</button></>}
