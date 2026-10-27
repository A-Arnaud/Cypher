import {useState} from 'react';
import {Power,Activity,Palette,Command} from 'lucide-react';
import type {AppState,QuotaBridge,SettingsPatch} from '../shared/model';
import {copy} from '../shared/i18n';
import {OpacityControl} from './OpacityControl';
import {validShortcut} from '../shared/shortcut';

interface Props {state:AppState;bridge:QuotaBridge;update:(patch:SettingsPatch)=>Promise<void>;shortcut:string;setShortcut:(value:string)=>void}
export function SettingsPanel({state,bridge,update,shortcut,setShortcut}:Props){
 const t=(key:string)=>copy(state.settings.language,key,state.platform);const [savingStartup,setSavingStartup]=useState(false);const [savingShortcut,setSavingShortcut]=useState(false);
 const toggle=(label:string,key:'alwaysOnTop'|'compact',disabled=false)=><label className="setting-row"><span>{t(label)}</span><input type="checkbox" role="switch" checked={state.settings[key]} disabled={disabled} onChange={e=>void update({[key]:e.target.checked})}/><i className="switch"/></label>;
 const setStartup=async(enabled:boolean)=>{setSavingStartup(true);try{await update({startAtLogin:enabled})}finally{setSavingStartup(false)}};
 const saveShortcut=async()=>{setSavingShortcut(true);try{await update({shortcut})}finally{setSavingShortcut(false)}};
 return <div className="settings-panel">
  <section className="settings-group startup-group" aria-labelledby="startup-heading">
   <h2 id="startup-heading" className="settings-heading"><Power size={14}/>{state.platform==='darwin'?'macOS':'Windows'}<span className={'setting-status '+(state.settings.startAtLogin&&!state.startupNeedsApproval?'enabled':'')}>{t(savingStartup?'saving':state.startupNeedsApproval?'startupApproval':state.settings.startAtLogin?'enabled':'disabled')}</span></h2>
   <label className="setting-row"><span>{t('startup')}</span><input type="checkbox" role="switch" aria-label={t('startup')} checked={state.settings.startAtLogin} disabled={!state.desktop||!state.startupAvailable||savingStartup} onChange={e=>void setStartup(e.target.checked)}/><i className="switch"/></label>
   <p className="setting-hint">{t(state.startupNeedsApproval?'startupApprovalHint':state.startupAvailable?'startupEnabledHint':'startupHint')}</p>
  </section>
  <section className="settings-group" aria-labelledby="collection-heading">
   <h2 id="collection-heading" className="settings-heading"><Activity size={14}/>{t('collectionSettings')}</h2>
   <label className="setting-row"><span>{t('poll')}</span><select aria-label={t('poll')} value={state.settings.pollSeconds} onChange={e=>void update({pollSeconds:Number(e.target.value)})}>{[...new Set([30,60,120,300,900,state.settings.pollSeconds])].sort((a,b)=>a-b).map(n=><option key={n} value={n}>{n<60?`${n} s`:n%60===0?`${n/60} min`:`${n} s`}</option>)}</select></label>
   <p className="setting-hint">{t('pollHint')}</p>
   <label className="setting-row"><span>{t('alerts')}</span><select aria-label={t('alerts')} value={state.settings.alertThresholds.length?'on':'off'} onChange={e=>void update({alertThresholds:e.target.value==='on'?[20,5]:[]})}><option value="on">20% / 5%</option><option value="off">{t('disabled')}</option></select></label>
  </section>
  <section className="settings-group" aria-labelledby="appearance-heading">
   <h2 id="appearance-heading" className="settings-heading"><Palette size={14}/>{t('appearanceSettings')}</h2>
   <OpacityControl opacity={state.settings.opacity??100} label={t('opacity')} bridge={bridge} save={value=>update({opacity:value})}/>
   <label className="setting-row"><span>{t('language')}</span><select aria-label={t('language')} value={state.settings.language} onChange={e=>void update({language:e.target.value as 'fr'|'en'})}><option value="fr">Français</option><option value="en">English</option></select></label>
   {toggle('top','alwaysOnTop',!state.desktop)}{toggle('compact','compact')}
  </section>
  <section className="settings-group" aria-labelledby="shortcut-heading">
   <h2 id="shortcut-heading" className="settings-heading"><Command size={14}/>{t('shortcutSettings')}</h2>
   <label className="field-label" htmlFor="shortcut">{t('shortcut')}</label><form className="shortcut-editor" onSubmit={e=>{e.preventDefault();if(state.desktop&&validShortcut(shortcut)&&!savingShortcut&&shortcut!==state.settings.shortcut)void saveShortcut()}}><input id="shortcut" value={shortcut} onChange={e=>setShortcut(e.target.value)} spellCheck={false} maxLength={40} aria-invalid={!validShortcut(shortcut)} aria-describedby="shortcut-hint" disabled={savingShortcut}/><button type="submit" disabled={!state.desktop||!validShortcut(shortcut)||savingShortcut||shortcut===state.settings.shortcut}>{t(savingShortcut?'saving':'save')}</button></form>
   <p id="shortcut-hint" className="setting-hint">{t(validShortcut(shortcut)?'shortcutHint':'invalidShortcut')}</p>
  </section>
 </div>;
}
