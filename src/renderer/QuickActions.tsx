import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {ArrowRight,Command,Search,X} from 'lucide-react';
import {catalog} from '../shared/catalog';
import type {AppState} from '../shared/model';
import {providerHealth,providerId} from '../shared/health';
import {healthLabel,workspaceCopy} from '../shared/workspace-copy';
export interface QuickAction {id:string;label:string;detail?:string;group:'actions'|'profiles'|'services';keywords?:string;disabled?:boolean;run:()=>void}
function normalize(value:string){return value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase().trim()}
export function profileActions(state:AppState,now:number,open:(id:string)=>void,connect:(id:string)=>void):QuickAction[]{
 const t=workspaceCopy(state.settings.language);
 const profiles=[...new Set(state.settings.pinned)].flatMap(id=>{const provider=providerId(state,id),entry=catalog.find(c=>c.id===provider);if(!entry)return [];const profile=state.profiles?.find(p=>p.id===id),health=providerHealth(state,id,now);const label=profile?.label==='default'?undefined:profile?.label;return [{id:'profile:'+id,label:entry.name+(label?' · '+label:''),detail:healthLabel(state.settings.language,health.kind),group:'profiles' as const,keywords:entry.name+' '+(label??'')+' '+healthLabel(state.settings.language,health.kind),run:()=>open(id)}]});
 return [...profiles,...catalog.map(c=>({id:'connect:'+c.id,label:c.name,detail:t.connectProfile,group:'services' as const,keywords:c.id,run:()=>connect(c.id)}))];
}
export function QuickActionsButton({language,platform,open}:{language:'en'|'fr';platform?:string;open:()=>void}){const label=workspaceCopy(language).commands;return <button className="quick-actions-button" aria-label={label} title={label+' · '+(platform==='darwin'?'⌘K':'Ctrl+K')} onClick={open}><Command size={14}/></button>}
export function QuickActions({state,open,onClose,actions}:{state:AppState;open:boolean;onClose:()=>void;actions:QuickAction[]}){
 const t=workspaceCopy(state.settings.language),id=useId(),dialog=useRef<HTMLDialogElement>(null),input=useRef<HTMLInputElement>(null),restore=useRef<HTMLElement|null>(null);
 const [query,setQuery]=useState(''),[selected,setSelected]=useState('');
 const filtered=useMemo(()=>{const words=normalize(query).split(/\s+/).filter(Boolean);return actions.filter(a=>words.every(w=>normalize(a.label+' '+(a.detail??'')+' '+(a.keywords??'')).includes(w)))},[actions,query]);
 const selectable=filtered.filter(a=>!a.disabled),active=selectable.find(a=>a.id===selected)??selectable[0];
 useEffect(()=>{if(!open)return;restore.current=document.activeElement as HTMLElement;setQuery('');setSelected('');const element=dialog.current!;element.showModal();input.current?.focus();return()=>{element.close();if(restore.current?.isConnected)restore.current.focus()}},[open]);
 useEffect(()=>{if(open&&active)document.getElementById(id+'-'+active.id)?.scrollIntoView({block:'nearest'})},[open,active?.id,id]);
 const choose=(a:QuickAction)=>{if(a.disabled)return;onClose();a.run()};
 return <dialog ref={dialog} className="quick-dialog" aria-labelledby={id+'-title'} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget){const box=e.currentTarget.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)onClose()}}}>
  <header><Command size={15}/><h2 id={id+'-title'}>{t.commands}</h2><kbd>{state.platform==='darwin'?'⌘':'Ctrl+'}K</kbd><button aria-label={t.close} onClick={onClose}><X size={15}/></button></header>
  <label className="quick-search"><Search size={16}/><input ref={input} role="combobox" aria-label={t.searchCommands} aria-controls={id+'-list'} aria-expanded={open} aria-autocomplete="list" aria-activedescendant={active?id+'-'+active.id:undefined} autoComplete="off" placeholder={t.searchCommands} value={query} onChange={e=>{setQuery(e.target.value);setSelected('')}} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=selectable.findIndex(a=>a.id===active?.id);if(selectable.length)setSelected(selectable[(i+(e.key==='ArrowDown'?1:-1)+selectable.length)%selectable.length].id)}else if(e.key==='Enter'){e.preventDefault();if(active)choose(active)}}}/></label>
  <div className="quick-list" id={id+'-list'} role="listbox" aria-label={t.commands}>{filtered.length?(['actions','profiles','services'] as const).map(group=>{const items=filtered.filter(a=>a.group===group);return items.length?<div role="group" aria-label={t[group]} key={group}><h3>{t[group]}</h3>{items.map(a=><div role="option" id={id+'-'+a.id} key={a.id} aria-selected={a.id===active?.id} aria-disabled={a.disabled===true} className={'quick-option '+(a.id===active?.id?'selected':'')} onPointerMove={()=>{if(!a.disabled)setSelected(a.id)}} onClick={()=>choose(a)}><span><strong>{a.label}</strong>{a.detail&&<small>{a.detail}</small>}</span><ArrowRight size={13}/></div>)}</div>:null}):<p className="quick-empty">{t.noCommands}</p>}</div>
  <p className="quick-hint">{t.commandHint}</p>
 </dialog>;
}
