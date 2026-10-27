import {useState} from 'react';
import {Clipboard,FileJson2} from 'lucide-react';
import type {AppState,QuotaBridge} from '../shared/model';
import type {DiagnosticReport} from '../shared/diagnostics';
import {workspaceCopy} from '../shared/workspace-copy';
export function DiagnosticsPanel({state,bridge}:{state:AppState;bridge:QuotaBridge}){
 const t=workspaceCopy(state.settings.language);const [report,setReport]=useState<DiagnosticReport>(),[busy,setBusy]=useState(false),[status,setStatus]=useState<'copied'|'reportError'|'reportReady'>();
 const prepare=async(copy=false)=>{if(busy)return;setBusy(true);setStatus(undefined);try{const next=copy?await bridge.copyDiagnostics?.():await bridge.getDiagnostics?.();if(!next)throw Error('unavailable');setReport(next);setStatus(copy?'copied':'reportReady')}catch{setStatus('reportError')}finally{setBusy(false)}};
 return <section id="diagnostics" className="settings-group diagnostics-panel" aria-labelledby="diagnostics-heading"><h2 id="diagnostics-heading" className="settings-heading"><FileJson2 size={14}/>{t.diagnostics}</h2><p className="setting-hint">{t.reportHint}</p><div className="update-actions"><button disabled={busy||!state.desktop||!bridge.getDiagnostics} onClick={()=>void prepare()}>{t.viewReport}</button><button disabled={busy||!state.desktop||!bridge.copyDiagnostics} onClick={()=>void prepare(true)}><Clipboard size={12}/>{t.copyReport}</button></div>{status&&<p role="status" className={'diagnostic-status '+(status==='reportError'?'warning':'')}>{t[status]}</p>}{report&&<pre className="diagnostic-report" tabIndex={0} aria-label={t.diagnostics}>{JSON.stringify(report,null,2)}</pre>}</section>;
}
