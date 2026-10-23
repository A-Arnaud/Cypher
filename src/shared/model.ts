import type {Detection} from '../main/discovery';
export type Language='fr'|'en';
export interface Metric {id:string;label:string;used?:number;limit?:number;remainingPercent?:number;unit:'percent'|'models'|'credits';resetAt?:number;source:'provider'|'local';observedAt:number}
export interface PublicProfile {id:string;providerId:'codex'|'claude'|'gemini';label:string;configPresent:boolean;authFilePresent:boolean;source:'default'|'auto'|'environment'|'manual'}
export interface ProviderSnapshot {id:string;providerId?:string;profileLabel?:string;identityKey?:string;duplicateOf?:string;auth:'unknown'|'connected'|'required';plan?:string;account?:string;metrics:Metric[];state:'ready'|'consent'|'unavailable'|'planned'|'error'|'stale';message:string;observedAt:number}
export interface Settings {language:Language;pinned:string[];alwaysOnTop:boolean;startAtLogin:boolean;paused:boolean;pollSeconds:number;shortcut:string;compact:boolean;alertThresholds:number[];consents:string[];bounds?:{x:number;y:number;width:number;height:number}}
export interface AppState {settings:Settings;detections:Detection[];providers:ProviderSnapshot[];refreshing:boolean;error?:string;desktop:boolean;profiles?:PublicProfile[];loginProfileIds?:string[]}
export type SettingsPatch=Partial<Omit<Settings,'bounds'>>;
export interface QuotaBridge {getState():Promise<AppState>;refresh():Promise<void>;updateSettings(patch:SettingsPatch):Promise<void>;openProvider(id:string):Promise<void>;login?(profileId:string):Promise<void>;addAccount?(providerId:string):Promise<void>;importProfile?(providerId:string):Promise<void>;locateExecutable?(providerId:string):Promise<void>;hide():Promise<void>;quit():Promise<void>;subscribe(listener:(state:AppState)=>void):()=>void}
declare global {interface Window {quota?:QuotaBridge}}
