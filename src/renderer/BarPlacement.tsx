import {ArrowDownToLine,ArrowUpToLine,Check,LoaderCircle} from 'lucide-react';import type {AppState} from '../shared/model';import {windowCopy,barDestination} from '../shared/window-copy';
interface Props {state:AppState;available:boolean;busy:boolean;place:(enabled:boolean)=>void}
export function BarPlacement({state,available,busy,place}:Props){
 const t=windowCopy(state.settings.language,state.platform,state.taskbarBackend);const ready=state.taskbarStatus==='ready',starting=state.taskbarStatus==='starting';
 const Icon=starting?LoaderCircle:ready?Check:barDestination(state.platform,state.taskbarBackend)==='menu'?ArrowUpToLine:ArrowDownToLine;
 return <section className={'bar-placement '+(ready?'is-placed':'')} aria-label={t.move}>
  <div className="bar-placement-actions"><button className="bar-place-button" title={t.hint} disabled={!state.desktop||!available||busy||starting} onClick={()=>place(true)}><Icon size={15} className={starting?'spin':undefined}/><span>{starting?t.starting:ready?t.minimize:t.move}</span></button>
  </div>
  <p>{t.hint}</p>
 </section>;
}
