import {BarPlacement} from './BarPlacement';import {windowCopy} from '../shared/window-copy';
import {SettingsPanel} from './SettingsPanel';
import {ProviderCard} from './ProviderCard';
import {useEffect,useMemo,useState} from 'react';
import {ArrowUpRight,ChevronLeft,Layers3,Link2,LoaderCircle,Pause,Play,Plus,RefreshCw,Search,Settings2,Sparkles,X} from 'lucide-react';
import {latestObservation} from '../shared/observation';
import {version} from '../../package.json';
import type {AppState,SettingsPatch} from '../shared/model';
import {catalog} from '../shared/catalog';
import {SummaryWidget} from './SummaryWidget';import {moveProfileOrder} from '../shared/widget';import {Connections} from './Connections';import logo from '../../assets/icon.svg';import {copy} from '../shared/i18n';import {browserBridge} from './preview';
const bridge=window.quota??browserBridge();
export function App(){
 const [state,setState]=useState<AppState>();const [tab,setTab]=useState<'overview'|'connections'|'settings'>('overview');const [query,setQuery]=useState('');const [filter,setFilter]=useState<'all'|'detected'>('all');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [shortcut,setShortcut]=useState('');const [focusProfile,setFocusProfile]=useState('');const [loadAttempt,setLoadAttempt]=useState(0);
 useEffect(()=>{let alive=true,receivedUpdate=false;setError('');const stop=bridge.subscribe(s=>{if(alive){receivedUpdate=true;setState(s)}});bridge.getState().then(s=>{if(alive&&!receivedUpdate)setState(s)}).catch(()=>{if(alive&&!receivedUpdate)setError('loadError')});return()=>{alive=false;stop()}},[loadAttempt]);
 useEffect(()=>{if(state)setShortcut(state.settings.shortcut)},[state?.settings.shortcut]);
 const lang=state?.settings.language??'en';const t=(key:string)=>copy(lang,key==='taskbarError'&&state?.taskbarBackend==='tray'?'trayError':key,state?.platform);useEffect(()=>{document.documentElement.lang=lang;document.body.classList.toggle('desktop',!!state?.desktop);document.documentElement.classList.toggle('desktop',!!state?.desktop)},[lang,state?.desktop]);
 const update=async(p:SettingsPatch)=>{try{setError('');await bridge.updateSettings(p)}catch{setError(p.shortcut!==undefined?'shortcutError':'settingsError')}};
 const dock=async(enabled:boolean)=>{setBusy(true);try{setError('');await bridge.setTaskbarMode?.(enabled)}catch{setError('taskbarError')}finally{setBusy(false)}};
 const refresh=async()=>{setBusy(true);setError('');try{await bridge.refresh()}catch{setError('collectionFailed')}finally{setBusy(false)}};
 const action=async(fn:()=>Promise<void>|undefined)=>{setBusy(true);setError('');try{await fn()}catch{setError('actionFailed')}finally{setBusy(false)}};
 const consent=(id:string,allowed:boolean)=>{void action(()=>bridge.setConsent?bridge.setConsent(id,allowed):update({consents:allowed?[...(state?.settings.consents??[]),id]:(state?.settings.consents??[]).filter(x=>x!==id)}))};
 const pinned=state?.settings.pinned??[];const pin=(id:string)=>update({pinned:pinned.includes(id)?pinned.filter(x=>x!==id):[...pinned,id]});
 const filtered=useMemo(()=>catalog.filter(c=>(c.name+' '+c.id).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())&&(filter==='all'||state?.detections.find(d=>d.id===c.id)?.installed)),[query,filter,state?.detections]);
 useEffect(()=>{if(state?.settings.summaryMode===false&&focusProfile&&tab==='overview')document.getElementById('profile-card-'+focusProfile)?.scrollIntoView({block:'start'})},[state?.settings.summaryMode,focusProfile,tab]);
 const time=(value:number)=>new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'en-GB',{hour:'2-digit',minute:'2-digit'}).format(value);
 if(!state)return <main className="shell loading" aria-busy={!error}>{!error&&<LoaderCircle className="spin"/>}<span>Cypher</span>{error?<><p role="alert">{t(error)}</p><button className="retry-button" onClick={()=>setLoadAttempt(n=>n+1)}>{t('retry')}</button></>:<p role="status">{t('loading')}</p>}</main>;
 const detected=state.detections.filter(d=>d.installed).length;const live=state.providers.filter(s=>s.state==='ready'&&!s.duplicateOf).length;
 const latest=latestObservation(state);
 const details=(id?:string,target:'overview'|'settings'|'connections'='overview')=>{setFocusProfile(id??'');setTab(target);void update({summaryMode:false})};
 if(state.settings.summaryMode!==false)return <SummaryWidget dock={enabled=>void dock(enabled)} close={()=>void action(()=>bridge.requestClose?.())} state={state} bridge={bridge} busy={busy} error={error||state.error||''} details={id=>details(id)} settings={()=>details(undefined,'settings')} connections={()=>details(undefined,'connections')} move={(from,to)=>void action(()=>bridge.moveProfile?bridge.moveProfile(from,to):update({pinned:moveProfileOrder(state.settings.pinned,from,to)}))} refresh={()=>void refresh()} pause={()=>void update({paused:!state.settings.paused})}/>;
 return <main className={'shell '+(tab!=='overview'?'expanded':'')}>
  <header className="topbar"><div className="brand"><img className="brand-logo" src={logo} alt="Cypher"/><span>Cypher</span></div><div className="window-actions"><button className="back-widget" aria-label={t('backWidget')} title={t('backWidget')} onClick={()=>void update({summaryMode:true})}><ChevronLeft size={13}/><span>Widget</span></button><button aria-label={windowCopy(lang,state.platform,state.taskbarBackend).close} title={windowCopy(lang,state.platform,state.taskbarBackend).close} onClick={()=>void action(()=>bridge.requestClose?.())} disabled={!state.desktop||!bridge.requestClose}><X size={15}/></button></div></header>
  <BarPlacement state={state} available={!!bridge.setTaskbarMode} busy={busy} place={enabled=>void dock(enabled)}/>
  <nav className="tabs" aria-label="Navigation">{(['overview','connections','settings'] as const).map(k=><button key={k} className={tab===k?'selected':''} aria-current={tab===k?'page':undefined} onClick={()=>setTab(k)}>{k==='overview'?<Layers3 size={13}/>:k==='connections'?<Link2 size={13}/>:<Settings2 size={13}/>}<span>{t(k)}</span></button>)}</nav>
  <section className="scroll-area">
  {!state.desktop&&<aside className="preview-notice"><span>{t('preview')}</span><p>{t('previewInfo')}</p></aside>}
  {error||state.error?<div className="error-notice" role="alert">{t(error||state.error!)}{error&&<button aria-label={t('dismiss')} onClick={()=>setError('')}><X size={12}/></button>}</div>:null}
  {tab==='overview'&&<>
   <div className="overview-bar"><span>{String(detected).padStart(2,'0')} <small>{t('detected').toLowerCase()}</small><i/> {String(live).padStart(2,'0')} <small>{t('live').toLowerCase()}</small></span><button className={'icon-button '+(busy||state.refreshing?'spinning':'')} aria-label={t('refresh')} title={t('refresh')} onClick={()=>void refresh()} disabled={busy||state.refreshing}><RefreshCw size={14}/></button></div>
   <div className="cards">{pinned.length?pinned.map(id=>{const profile=state.profiles?.find(p=>p.id===id);const entry=catalog.find(c=>c.id===(profile?.providerId??id));return entry?<ProviderCard key={id} entry={entry} profileId={id} state={state} bridge={bridge} onConnect={()=>setTab('connections')}/>:null}):<div className="empty-state"><Sparkles size={24}/><h2>{t('empty')}</h2><p>{t('emptyHint')}</p></div>}</div>
   <button className="add-service" onClick={()=>setTab('connections')}><Plus size={14}/>{t('connections')}<ArrowUpRight size={13}/></button>
   </>}
  {tab==='connections'&&<><label className="search"><Search size={15}/><input type="search" aria-label={t('search')} placeholder={t('search')} value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="filters"><button className={filter==='all'?'active':''} aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>{t('all')} <span>{catalog.length}</span></button><button className={filter==='detected'?'active':''} aria-pressed={filter==='detected'} onClick={()=>setFilter('detected')}>{t('detected')} <span>{detected}</span></button></div>
   <Connections state={state} entries={filtered} bridge={bridge} busy={busy} action={action} pin={id=>void pin(id)} consent={consent}/></>}
  {tab==='settings'&&<SettingsPanel state={state} bridge={bridge} update={update} shortcut={shortcut} setShortcut={setShortcut}/>}
  </section>
  <footer><span title={t(state.settings.paused?'paused':'updated')}><span className={'pulse '+(state.settings.paused?'off':'')}/>{latest?time(latest):'—'} <small> / {state.settings.pollSeconds}s</small></span><button aria-label={t(state.settings.paused?'resume':'pause')} title={t(state.settings.paused?'resume':'pause')} onClick={()=>void update({paused:!state.settings.paused})}>{state.settings.paused?<Play size={12}/>:<Pause size={12}/>}</button><span className="footer-copy">v{version}</span></footer>
 </main>
}
