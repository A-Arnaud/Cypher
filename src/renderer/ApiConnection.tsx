import {useState,type FormEvent} from 'react';
import type {QuotaBridge,Language} from '../shared/model';
import {copy} from '../shared/i18n';
export function ApiConnection({providerId,configured,bridge,language}:{providerId:string;configured:boolean;bridge:QuotaBridge;language:Language}){
 const [key,setKey]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');const t=(s:string)=>copy(language,s);
 async function save(e:FormEvent){e.preventDefault();if(!bridge.saveApiKey||busy)return;const value=key.trim();setKey('');setBusy(true);setError('');try{await bridge.saveApiKey(providerId,value)}catch{setError('apiConnectionFailed')}finally{setBusy(false)}}
 async function remove(){if(!bridge.removeApiKey)return;setBusy(true);setError('');try{await bridge.removeApiKey(providerId)}catch{setError('apiConnectionFailed')}finally{setBusy(false)}}
 return <form className="api-connection" onSubmit={e=>void save(e)}>
 <p>{t('apiKeyHint')}</p>{['openai','anthropic'].includes(providerId)&&<p>{t('adminKeyHint')}</p>}{providerId==='fal'&&<p>{t('falKeyHint')}</p>}<label>{t(configured?'replaceApiKey':'apiKey')}<input type="password" autoComplete="off" spellCheck={false} value={key} maxLength={4096} onChange={e=>setKey(e.target.value)} disabled={busy} /></label>
 <button className="consent-button" type="submit" disabled={busy||key.trim().length<8||!bridge.saveApiKey}>{t('connectApi')}</button>
 <button className="provider-link" type="button" disabled={busy||!bridge.openApiKeys} onClick={()=>void bridge.openApiKeys?.(providerId)}>{t('getApiKey')}</button>
 {configured&&<button className="provider-link" type="button" disabled={busy} onClick={()=>void remove()}>{t('removeApiKey')}</button>}
 {error&&<p role="alert">{t(error)}</p>}
 </form>
}
