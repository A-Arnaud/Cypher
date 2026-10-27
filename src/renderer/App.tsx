import {useEffect,useMemo,useState} from 'react';import {ChevronLeft,Layers3,Link2,LoaderCircle,Pause,Play,Plus,RefreshCw,Settings2,X} from 'lucide-react';
import {UpdateNotice} from './UpdateNotice';import {QuickActions,QuickActionsButton,profileActions,type QuickAction} from './QuickActions';import {HealthOverview} from './HealthOverview';import {BarPlacement} from './BarPlacement';import {SettingsPanel} from './SettingsPanel';import {ProviderCard} from './ProviderCard';import {SummaryWidget} from './SummaryWidget';import {Connections} from './Connections';import {Welcome} from './Welcome';
import {ProviderLogo} from './ProviderLogo';
import {providerHealth} from '../shared/health';import {workspaceCopy} from '../shared/workspace-copy';import {experienceCopy} from '../shared/experience-copy';import {windowCopy} from '../shared/window-copy';import {displayedAccountIds,hasSavedConnection} from '../shared/accounts-view';import {latestObservation} from '../shared/observation';import {moveProfileOrder} from '../shared/widget';import {version} from '../../package.json';
import type {AppState,SettingsPatch} from '../shared/model';import {catalog} from '../shared/catalog';import {copy} from '../shared/i18n';import {browserBridge} from './preview';import logo from '../../assets/icon.svg';
const bridge=window.quota??browserBridge();
function revealInPane(element:HTMLElement|null){
 if(!element)return;for(let parent=element.parentElement;parent;parent=parent.parentElement)if(parent instanceof HTMLDetailsElement)parent.open=true;
 const pane=element.closest('.scroll-area');if(pane)pane.scrollTop+=element.getBoundingClientRect().top-pane.getBoundingClientRect().top-12;
}
export function App(){
 const [state,setState]=useState<AppState>(),[tab,setTab]=useState<'overview'|'connections'|'settings'>('overview'),[query,setQuery]=useState(''),[selectedProvider,setSelectedProvider]=useState(''),[overviewProvider,setOverviewProvider]=useState('');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[shortcut,setShortcut]=useState(''),[focusProfile,setFocusProfile]=useState(''),[loadAttempt,setLoadAttempt]=useState(0);
 const [quickOpen,setQuickOpen]=useState(false),[attentionOnly,setAttentionOnly]=useState(false),[focusSection,setFocusSection]=useState(''),[now,setNow]=useState(Date.now);
 const lang=state?.settings.language??'en',t=(key:string)=>copy(lang,key==='taskbarError'&&state?.taskbarBackend==='tray'?'trayError':key,state?.platform);
 useEffect(()=>{let alive=true,receivedUpdate=false;setError('');const stop=bridge.subscribe(s=>{if(alive){receivedUpdate=true;setState(s)}});bridge.getState().then(s=>{if(alive&&!receivedUpdate)setState(s)}).catch(()=>{if(alive&&!receivedUpdate)setError('loadError')});return()=>{alive=false;stop()}},[loadAttempt]);
 useEffect(()=>{if(state)setShortcut(state.settings.shortcut)},[state?.settings.shortcut]);
 useEffect(()=>{document.documentElement.lang=lang;document.body.classList.toggle('desktop',!!state?.desktop);document.documentElement.classList.toggle('desktop',!!state?.desktop)},[lang,state?.desktop]);
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)'),apply=()=>{document.documentElement.dataset.theme=state?.settings.theme==='light'||state?.settings.theme==='dark'?state.settings.theme:media.matches?'dark':'light'};apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply)},[state?.settings.theme]);
 useEffect(()=>{const tick=()=>{if(!document.hidden)setNow(Date.now())};const timer=setInterval(tick,30000);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick)}},[]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(event.defaultPrevented||event.isComposing||event.repeat||event.altKey||event.shiftKey)return;const mac=state?.platform==='darwin'||!state?.platform&&/Mac/.test(navigator.platform);if((mac?event.metaKey&&!event.ctrlKey:event.ctrlKey&&!event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setQuickOpen(value=>!value)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[state?.platform]);
 useEffect(()=>{if(focusSection&&tab==='settings'&&state?.settings.summaryMode===false){revealInPane(document.getElementById(focusSection));setFocusSection('')}},[focusSection,tab,state?.settings.summaryMode]);
 useEffect(()=>{if(state?.settings.summaryMode===false&&focusProfile&&tab==='overview')revealInPane(document.getElementById('profile-card-'+focusProfile))},[state?.settings.summaryMode,focusProfile,tab]);
 const update=async(p:SettingsPatch)=>{try{setError('');await bridge.updateSettings(p)}catch{setError(p.shortcut!==undefined?'shortcutError':p.startAtLogin!==undefined?'startupError':'settingsError')}};
 const action=async(fn:()=>Promise<void>|undefined)=>{setBusy(true);setError('');try{await fn()}catch{setError('actionFailed')}finally{setBusy(false)}};
 const dock=async(enabled:boolean)=>{setBusy(true);try{setError('');await bridge.setTaskbarMode?.(enabled)}catch{setError('taskbarError')}finally{setBusy(false)}};
 const refresh=async()=>{setBusy(true);setError('');try{await bridge.refresh()}catch{setError('collectionFailed')}finally{setBusy(false)}};
 const consent=(id:string,allowed:boolean)=>void action(()=>bridge.setConsent?bridge.setConsent(id,allowed):update({consents:allowed?[...(state?.settings.consents??[]),id]:(state?.settings.consents??[]).filter(x=>x!==id)}));
 const pinned=state?.settings.pinned??[],pin=(id:string)=>void update({pinned:pinned.includes(id)?pinned.filter(x=>x!==id):[...pinned,id]});
 const filtered=useMemo(()=>catalog.filter(c=>(c.name+' '+c.id).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),[query]);
 if(!state)return <main className="shell loading" aria-busy={!error}>{!error&&<LoaderCircle className="spin"/>}<span>Cypher</span>{error?<><p role="alert">{t(error)}</p><button className="retry-button" onClick={()=>setLoadAttempt(n=>n+1)}>{t('retry')}</button></>:<p role="status">{t('loading')}</p>}</main>;
 const ux=experienceCopy(lang),w=workspaceCopy(lang),visiblePinned=displayedAccountIds(state),viewState={...state,settings:{...state.settings,pinned:visiblePinned}},latest=latestObservation(state);
 const details=(id?:string,target:'overview'|'settings'|'connections'='overview')=>{setFocusProfile(id??'');setTab(target);if(state.settings.summaryMode!==false)void update({summaryMode:false})};
 const openConnection=(id?:string)=>{setQuery('');setSelectedProvider(id??'');details(undefined,'connections')};
 const openProfile=(id:string)=>{setOverviewProvider('');setAttentionOnly(false);details(id)};
 const commands:QuickAction[]=[
  ...(['overview','connections','settings'] as const).map(target=>({id:target,label:t(target),group:'actions' as const,run:()=>target==='connections'?openConnection():details(undefined,target)})),
  {id:'widget',label:ux.compact,group:'actions',run:()=>void update({summaryMode:true})},
  {id:'refresh',label:w.refresh,group:'actions',disabled:busy||state.refreshing,run:()=>void refresh()},
  {id:'pause',label:state.settings.paused?w.resume:w.pause,group:'actions',run:()=>void update({paused:!state.settings.paused})},
  {id:'bar',label:windowCopy(lang,state.platform,state.taskbarBackend)[state.taskbarStatus==='ready'?'minimize':'move'],group:'actions',disabled:!state.desktop||!bridge.setTaskbarMode||busy||state.taskbarStatus==='starting',run:()=>void dock(true)},
  {id:'updates',label:w.updates,group:'actions',disabled:!state.desktop||!state.appUpdate?.active||!bridge.checkForUpdates,run:()=>{details(undefined,'settings');setFocusSection('updates-heading');void action(()=>bridge.checkForUpdates?.())}},
  {id:'diagnostics',label:w.diagnostics,group:'actions',run:()=>{details(undefined,'settings');setFocusSection('diagnostics')}},...profileActions(viewState,now,openProfile,openConnection)
 ];
 const palette=<QuickActions state={viewState} open={quickOpen} onClose={()=>setQuickOpen(false)} actions={commands}/>;
 const quickButton=<QuickActionsButton language={lang} platform={state.platform} open={()=>setQuickOpen(true)}/>;
 if(state.settings.summaryMode!==false)return <><SummaryWidget now={now} quickActions={quickButton} dock={enabled=>void dock(enabled)} close={()=>void action(()=>bridge.requestClose?.())} state={viewState} bridge={bridge} busy={busy} error={error||state.error||''} details={id=>details(id)} settings={()=>details(undefined,'settings')} connections={()=>openConnection()} move={(from,to)=>void action(()=>bridge.moveProfile?bridge.moveProfile(from,to):update({pinned:moveProfileOrder(state.settings.pinned,from,to)}))} refresh={()=>void refresh()} pause={()=>void update({paused:!state.settings.paused})}/>{palette}</>;
 const providerOf=(id:string)=>state.profiles?.find(p=>p.id===id)?.providerId??state.providers.find(p=>p.id===id)?.providerId??id;
 const railProviders=[...new Set(visiblePinned.map(providerOf))].map(id=>catalog.find(c=>c.id===id)).filter(c=>!!c);
 const activeProvider=railProviders.some(c=>c.id===overviewProvider)?overviewProvider:'';
 const visibleAccounts=activeProvider?visiblePinned.filter(id=>providerOf(id)===activeProvider):visiblePinned;
 const overviewState={...viewState,settings:{...viewState.settings,pinned:visibleAccounts}};
 return <><main className={'shell simple-shell panel-shell '+(tab!=='overview'?'expanded':'')}>
  <header className="topbar"><div className="brand"><img className="brand-logo" src={logo} alt="Cypher"/><span>Cypher</span></div><div className="window-actions">{quickButton}<button className="back-widget" aria-label={t('backWidget')} title={t('backWidget')} onClick={()=>void update({summaryMode:true})}><ChevronLeft size={13}/><span>{ux.compact}</span></button><button aria-label={windowCopy(lang,state.platform,state.taskbarBackend).close} title={windowCopy(lang,state.platform,state.taskbarBackend).close} onClick={()=>void action(()=>bridge.requestClose?.())} disabled={!state.desktop||!bridge.requestClose}><X size={16}/></button></div></header>
  <div className="panel-workspace"><nav className="tabs panel-rail" aria-label="Navigation">
   <button className={tab==='overview'&&!activeProvider?'selected':''} aria-current={tab==='overview'&&!activeProvider?'page':undefined} onClick={()=>{setOverviewProvider('');setAttentionOnly(false);setTab('overview')}} title={t('overview')}><Layers3 size={19}/><span>{t('overview')}</span></button>
   <div className="rail-services">{railProviders.map(entry=><button key={entry.id} className={tab==='overview'&&activeProvider===entry.id?'selected':''} aria-label={(lang==='fr'?'Afficher ':'Show ')+entry.name} aria-pressed={tab==='overview'&&activeProvider===entry.id} title={entry.name} onClick={()=>{setOverviewProvider(entry.id);setAttentionOnly(false);setTab('overview')}}><ProviderLogo providerId={entry.id}/><span className="rail-tooltip">{entry.name}</span></button>)}</div>
   <button className={tab==='connections'?'selected':''} aria-current={tab==='connections'?'page':undefined} title={t('connections')} onClick={()=>openConnection()}><Link2 size={19}/><span>{t('connections')}</span></button>
   <button className={'rail-settings '+(tab==='settings'?'selected':'')} aria-current={tab==='settings'?'page':undefined} title={t('settings')} onClick={()=>setTab('settings')}><Settings2 size={19}/><span>{t('settings')}</span></button>
  </nav><div className="panel-content">
  <section className="scroll-area">
   {!state.desktop&&<aside className="preview-notice"><span>{t('preview')}</span><p>{t('previewInfo')}</p></aside>}
   {(error||state.error)&&<div className="error-notice" role="alert">{t(error||state.error!)}{error&&<button aria-label={t('dismiss')} onClick={()=>setError('')}><X size={12}/></button>}</div>}
   {tab==='overview'&&<>{visiblePinned.length>0&&<><div className="page-intro account-list-heading"><div><h1>{activeProvider?catalog.find(c=>c.id===activeProvider)?.name:t('overview')}</h1><p>{visibleAccounts.length} {visibleAccounts.length===1?ux.count:ux.counts}</p></div><div className="account-heading-actions"><button className="add-account-link" title={ux.add} aria-label={ux.add} onClick={()=>openConnection()}><Plus size={15}/>{ux.add}</button><button className={'refresh-account-list '+(busy||state.refreshing?'spinning':'')} aria-label={t('refresh')} title={t('refresh')} onClick={()=>void refresh()} disabled={busy||state.refreshing}><RefreshCw size={15}/></button></div></div>{(attentionOnly||visibleAccounts.some(id=>providerHealth(state,id,now).kind==='attention'))&&<div className="overview-bar with-health"><HealthOverview state={overviewState} now={now} attentionOnly={attentionOnly} setAttentionOnly={setAttentionOnly}/></div>}</>}
    <div className="cards">{visiblePinned.length?visibleAccounts.filter(id=>!attentionOnly||providerHealth(state,id,now).kind==='attention').map(id=>{const profile=state.profiles?.find(p=>p.id===id),entry=catalog.find(c=>c.id===(profile?.providerId??id));return entry?<ProviderCard key={id} now={now} entry={entry} profileId={id} state={state} bridge={bridge} busy={busy} onConnect={()=>openConnection(entry.id)} onRetry={()=>void refresh()}/>:null}):<Welcome state={state} open={openConnection} empty={hasSavedConnection(state)}/>}</div>
    {attentionOnly&&visiblePinned.length>0&&!visiblePinned.some(id=>providerHealth(state,id,now).kind==='attention')&&<div className="health-empty">{w.noAttention}<button onClick={()=>setAttentionOnly(false)}>{w.showAll}</button></div>}
   </>}
   {tab==='connections'&&<Connections state={state} entries={filtered} bridge={bridge} busy={busy} action={action} pin={pin} consent={consent} provider={selectedProvider} select={setSelectedProvider} query={query} search={setQuery}/>}
   {tab==='settings'&&<SettingsPanel state={state} bridge={bridge} update={update} shortcut={shortcut} setShortcut={setShortcut}/>}
  </section>
  <BarPlacement state={state} available={!!bridge.setTaskbarMode} busy={busy} place={enabled=>void dock(enabled)}/>
  </div></div>
  <footer><span title={t(state.settings.paused?'paused':'updated')}><span className={'pulse '+(state.settings.paused?'off':'')}/>{latest?new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'en-GB',{hour:'2-digit',minute:'2-digit'}).format(latest):ux.localHint}</span><button aria-label={t(state.settings.paused?'resume':'pause')} title={t(state.settings.paused?'resume':'pause')} onClick={()=>void update({paused:!state.settings.paused})}>{state.settings.paused?<Play size={12}/>:<Pause size={12}/>}</button><UpdateNotice state={state} bridge={bridge}/><span className="footer-copy">v{version}</span></footer>
 </main>{palette}</>;
}
