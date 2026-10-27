import type {Settings} from './model';
export function defaultSettings():Settings{return {autoUpdateCheck:true,taskbarMode:true,taskbarOnboarded:false,language:'en',opacity:100,summaryMode:false,pinned:['codex','claude','gemini'],alwaysOnTop:false,startAtLogin:false,paused:false,pollSeconds:60,shortcut:'Control+Alt+Q',compact:false,alertThresholds:[20,5],consents:[]}}
