import {ArrowUpRight,FolderPlus,Plus} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';import {copy} from '../shared/i18n';import {ApiConnection} from './ApiConnection';
interface Props {providerId:string;state:AppState;bridge:QuotaBridge;busy:boolean;executable:boolean;action:(fn:()=>Promise<void>|undefined)=>Promise<void>}
export function ConnectionOptions({providerId,state,bridge,busy,executable,action}:Props){
 const t=(key:string)=>copy(state.settings.language,key,state.platform);
 const active=state.loginProfileIds?.some(id=>state.profiles?.some(p=>p.id===id&&p.providerId===providerId));
 const apiProvider=providerId==='codex'?'openai':providerId==='claude'?'anthropic':undefined;
 return <details className="connection-options"><summary>{t('moreConnections')}</summary><div className="connection-option-list">
  <section className="connection-option"><h4>{t('cliConnection')}</h4>{executable?<><p>{t('cliConnectionHint')}</p><button className="account-add" disabled={busy||active} onClick={()=>void action(()=>bridge.addAccount?.(providerId))}><Plus size={12}/>{t('addAccount')}</button><button className="provider-link" disabled={busy} onClick={()=>void action(()=>bridge.locateExecutable?.(providerId))}>{t('replaceCli')}</button></>:<><p>{t('cliRequired')}</p><button className="account-add" disabled={busy} onClick={()=>void action(()=>bridge.locateExecutable?.(providerId))}><FolderPlus size={12}/>{t('locate')}</button><button className="provider-link" disabled={busy} onClick={()=>void action(()=>bridge.openInstall?.(providerId))}>{t('install')}<ArrowUpRight size={12}/></button></>}
  <button className="provider-link" disabled={busy} onClick={()=>void action(()=>bridge.importProfile?.(providerId))}><FolderPlus size={12}/>{t('importProfile')}</button>{providerId==='gemini'&&<small className="permission">{t('geminiHome')}</small>}</section>
  {apiProvider&&<details className="connection-api-option"><summary>{t('apiAlternative')}</summary><p>{t('apiAlternativeHint')}</p><ApiConnection key={apiProvider} providerId={apiProvider} configured={state.configuredApiProviders?.includes(apiProvider)??false} bridge={bridge} language={state.settings.language}/></details>}
 </div></details>;
}
