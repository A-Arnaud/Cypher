import type {Language} from '../shared/model';
import type {TaskbarItem} from '../shared/taskbar';
import {catalog} from '../shared/catalog';
import type {TaskbarBackend} from './windows-platform';
export interface TaskbarRender {items:TaskbarItem[];extraCount:number;language:Language}
export interface TaskbarHostAdapter {start():Promise<void>;isReady():boolean;render(value:TaskbarRender):void;stop():Promise<void>}
export interface TrayPresentation {tooltip:string;lines:string[];title?:string}
/** Uses the existing app tray, never creates a second icon or owns its action menu. */
export class TrayHost implements TaskbarHostAdapter {
 private active=false;
 constructor(private update:(value:TrayPresentation|undefined)=>void){}
 isReady(){return this.active}
 async start(){if(this.active)return;this.update({tooltip:'Cypher —',lines:[],title:'—'});this.active=true}
 render(value:TaskbarRender){
  if(!this.active)return;
  const lines=value.items.slice(0,3).map(item=>{
   // Profile labels and identifiers may contain account data. Only public catalog names leave here.
   const name=catalog.find(entry=>entry.id===item.providerId)?.name??'Cypher';
   const text=/^(?:\d{1,3}%|—)$/.test(item.text)?item.text:'—';
   return name+' : '+text+(item.stale?(value.language==='fr'?' (ancien)':' (stale)'):'');
  });
  const extra=Math.max(0,value.extraCount)+Math.max(0,value.items.length-3);if(extra)lines.push('+'+extra);
  this.update({lines,title:lines.length?lines.join(' · '):'—',tooltip:('Cypher\n'+(lines.length?lines.join('\n'):'—')).slice(0,127)});
 }
 async stop(){this.active=false;this.update(undefined)}
}
export function createTaskbarHost(backend:TaskbarBackend,native:()=>TaskbarHostAdapter,update:(value:TrayPresentation|undefined)=>void):TaskbarHostAdapter {
 return backend==='embedded'?native():new TrayHost(update);
}
