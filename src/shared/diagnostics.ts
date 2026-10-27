import {catalog} from './catalog';
import type {AppState} from './model';
import {providerHealth,pinnedHealth} from './health';

/** Explicit allowlist: no spread of runtime state, error text, detections or settings. */
export function diagnosticReport(state:AppState,runtime:{version:string;platform:string;arch:string;osVersion:string},now=Date.now()){
 const enumValue=<T extends string>(value:unknown,allowed:readonly T[]):T|null=>allowed.includes(value as T)?value as T:null;
 const health=pinnedHealth(state,now),counts={fresh:0,attention:0,waiting:0,limited:0,paused:0,duplicate:0};
 for(const item of health)counts[item.kind]++;
 return {
  schema:'cypher.diagnostics/v1',generatedAt:new Date(now).toISOString(),
  app:{version:/^\d+\.\d+\.\d+$/.test(runtime.version)?runtime.version:'unknown',platform:enumValue(runtime.platform,['win32','darwin','linux']),arch:enumValue(runtime.arch,['x64','arm64','ia32']),osVersion:/^\d+(?:\.\d+){0,3}$/.test(runtime.osVersion)?runtime.osVersion:null,desktop:state.desktop===true},
  collection:{paused:state.settings.paused===true,refreshing:state.refreshing===true,pollSeconds:state.settings.pollSeconds,pinned:health.length,status:counts},
  indicator:{backend:enumValue(state.taskbarBackend,['embedded','tray']),status:enumValue(state.taskbarStatus,['off','starting','ready','error']),enabled:state.settings.taskbarMode===true},
  startup:{available:state.startupAvailable===true,enabled:state.settings.startAtLogin===true,needsApproval:state.startupNeedsApproval===true},
  updates:{active:state.appUpdate?.active===true,automaticChecks:state.settings.autoUpdateCheck!==false,phase:enumValue(state.appUpdate?.phase,['idle','checking','current','available','downloading','installing','manual','error']),mode:enumValue(state.appUpdate?.mode,['automatic','manual'])},
  connectors:catalog.filter(c=>state.settings.pinned.includes(c.id)||state.settings.consents.includes(c.id)||state.configuredApiProviders?.includes(c.id)||state.profiles?.some(p=>p.providerId===c.id)).map(c=>{
   const profiles=state.profiles?.filter(p=>p.providerId===c.id)??[];const ids=profiles.length?profiles.map(p=>p.id):[c.id];const detection=state.detections.find(d=>d.id===c.id);
   return {provider:c.id,installed:detection?.installed===true,bundled:detection?.builtIn===true,configured:state.configuredApiProviders?.includes(c.id)===true,profiles:ids.map(id=>{const status=providerHealth(state,id,now);return {authorized:state.settings.consents.includes(id),pinned:state.settings.pinned.includes(id),status:status.kind,reason:status.reason,source:status.source??null,lastReadingAgeSeconds:status.observedAt===undefined?null:Math.max(0,Math.floor((now-status.observedAt)/1000))}})};
  })
 };
}
export type DiagnosticReport=ReturnType<typeof diagnosticReport>;
