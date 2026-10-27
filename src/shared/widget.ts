import type {Settings,PublicProfile} from './model';
export function pinConnectedProfile(settings:Settings,profiles:PublicProfile[],id:string):string[]{
 const profile=profiles.find(p=>p.id===id);
 if(profile?.connectionMethod==='browser'&&settings.pinned.includes(profile.providerId)&&!settings.consents.includes(profile.providerId)&&!profiles.find(p=>p.id===profile.providerId)?.authFilePresent){
  return [...new Set(settings.pinned.map(p=>p===profile.providerId?id:p))];
 }
 return [...new Set([...settings.pinned,id])];
}
export interface WorkArea{x:number;y:number;width:number;height:number}
export interface WidgetOptions{summaryMode?:boolean;pinned:string[];bounds?:{x:number;y:number;width:number;height:number}}
export function moveProfileOrder(ids:string[],from:string,to:string):string[]{const result=[...ids],source=result.indexOf(from),target=result.indexOf(to);if(source<0||target<0||source===target)return result;result.splice(source,1);result.splice(target,0,from);return result}
export function widgetBounds(settings:WidgetOptions,work:WorkArea){const summary=settings.summaryMode!==false;const maxHeight=Math.max(100,work.height-24);const capacity=Math.max(1,Math.floor((maxHeight-190)/50));const columns=summary&&settings.pinned.length>capacity&&work.width>=720?2:1;const width=Math.min(work.width,summary?(columns===2?720:380):430);const height=summary?Math.min(maxHeight,Math.max(180,190+Math.ceil(Math.max(1,settings.pinned.length)/columns)*50)):Math.min(704,work.height);const saved=settings.bounds;const x=Number.isFinite(saved?.x)?saved!.x:work.x+work.width-width-24,y=Number.isFinite(saved?.y)?saved!.y:work.y+40;return {x:Math.round(Math.max(work.x,Math.min(x,work.x+work.width-width))),y:Math.round(Math.max(work.y,Math.min(y,work.y+work.height-height))),width,height}}
