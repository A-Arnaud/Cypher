import type {AppState,QuotaBridge} from '../shared/model';import {defaultSettings} from '../shared/defaults';import {catalog} from '../shared/catalog';
export function browserBridge():QuotaBridge {
 let language:'fr'|'en'='fr';try{if(localStorage.getItem('qg-language')==='en')language='en'}catch{}
 let state:AppState={settings:{...defaultSettings(),language},detections:[],providers:catalog.map(c=>({id:c.id,auth:'unknown',metrics:[],state:c.support==='planned'?'planned':'unavailable',message:c.support==='planned'?'planned':'notInstalled',observedAt:0})),refreshing:false,desktop:false};const listeners=new Set<(s:AppState)=>void>();
 return {getState:async()=>state,refresh:async()=>{},updateSettings:async patch=>{state={...state,settings:{...state.settings,...patch}};try{localStorage.setItem('qg-language',state.settings.language)}catch{}for(const l of listeners)l(state)},openProvider:async()=>{},hide:async()=>{},quit:async()=>{},subscribe:l=>{listeners.add(l);return ()=>{listeners.delete(l)}}};
}
