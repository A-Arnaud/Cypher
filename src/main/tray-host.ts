import type {Language} from '../shared/model';
import type {TaskbarItem,TaskbarQuota} from '../shared/taskbar';
import {catalog} from '../shared/catalog';
import type {TaskbarBackend} from './windows-platform';
export interface TaskbarRender {items:TaskbarItem[];extraCount:number;language:Language}
export interface TaskbarHostAdapter {start():Promise<void>;isReady():boolean;render(value:TaskbarRender):void;stop():Promise<void>}
export interface IndicatorItem {providerId:string;text:string;stale:boolean;quotas:TaskbarQuota[]}
export interface TrayPresentation {tooltip:string;lines:string[];title?:string;items?:IndicatorItem[];extraCount?:number}
export function quotaLabel(label:string,language:Language){return label==='session'?(language==='fr'?'session':'session'):label==='weekly'?(language==='fr'?'semaine':'weekly'):label==='quota'?'quota':language==='fr'?label.replace(/d$/,'j'):label}
/** Uses the existing app tray, never creates a second icon or owns its action menu. */
export class TrayHost implements TaskbarHostAdapter {
 private active=false;
 constructor(private update:(value:TrayPresentation|undefined)=>void){}
 isReady(){return this.active}
 async start(){if(this.active)return;this.update({tooltip:'Cypher',lines:[],title:''});this.active=true}
 render(value:TaskbarRender){
  if(!this.active)return;
  const items:IndicatorItem[]=value.items.slice(0,3).map(item=>({providerId:catalog.some(c=>c.id===item.providerId)?item.providerId:'service',text:/^(?:(?:100|\d{1,2})%|—)$/.test(item.text)?item.text:'—',stale:!!item.stale,quotas:(item.quotas??[]).slice(0,2).map(q=>({label:/^(?:session|weekly|quota|\d{1,6}[mhd])$/.test(q.label)?q.label:'quota',text:/^(?:100|\d{1,2})%$/.test(q.text)?q.text:'—'}))}));
  const lines=items.map(item=>{
   // Profile labels and identifiers may contain account data. Only public catalog names leave here.
   const name=catalog.find(entry=>entry.id===item.providerId)?.name??'Cypher';
   const text=item.quotas.length?item.quotas.map(q=>quotaLabel(q.label,value.language)+' '+q.text).join(' / '):item.text;
   return name+' : '+text+(item.stale?(value.language==='fr'?' (ancien)':' (stale)'):'');
  });
  const extra=Math.max(0,value.extraCount)+Math.max(0,value.items.length-3);if(extra)lines.push('+'+extra);
  this.update({lines,items,extraCount:extra,title:extra?'+'+extra:'',tooltip:('Cypher\n'+(lines.length?lines.join('\n'):value.language==='fr'?'Ajoutez un compte dans Cypher':'Add an account in Cypher')).slice(0,127)});
 }
 async stop(){this.active=false;this.update(undefined)}
}
export function createTaskbarHost(backend:TaskbarBackend,native:()=>TaskbarHostAdapter,update:(value:TrayPresentation|undefined)=>void):TaskbarHostAdapter {
 return backend==='embedded'?native():new TrayHost(update);
}
