import type {Settings} from './model';
export function defaultSettings():Settings{return {language:'fr',opacity:100,summaryMode:true,pinned:['codex','claude','gemini'],alwaysOnTop:false,startAtLogin:false,paused:false,pollSeconds:60,shortcut:'Control+Alt+Q',compact:false,alertThresholds:[20,5],consents:[]}}
