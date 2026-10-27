import {Tray,type Menu,type NativeImage} from 'electron';
import type {TrayPresentation} from './tray-host';
import {indicatorImage} from './indicator-image';
/** One combined macOS menu item; up to three small two-line Windows tray readings. */
export class NativeIndicators {
 private extra:Tray[]=[];private key='';
 constructor(private base:Tray,private original:NativeImage,private mac:boolean,private numeric:boolean,private click:()=>void){}
 render(value:TrayPresentation|undefined,menu:Menu){
  const items=value?.items??[],enabled=(this.mac||this.numeric)&&items.length>0;
  const key=JSON.stringify([enabled,items]);
  if(key!==this.key){
   this.key=key;
   if(!enabled){this.extra.splice(0).forEach(tray=>tray.destroy());this.base.setImage(this.original)}
   else if(this.mac)this.base.setImage(indicatorImage(items,true));
   else{
    this.base.setImage(indicatorImage(items.slice(0,1),false));
    while(this.extra.length>Math.max(0,items.length-1))this.extra.pop()!.destroy();
    for(let index=1;index<items.length;index++){
     const image=indicatorImage([items[index]],false);
     if(this.extra[index-1])this.extra[index-1].setImage(image);
     else{const tray=new Tray(image);tray.on('click',this.click);this.extra.push(tray)}
    }
   }
  }
  this.extra.forEach((tray,index)=>{tray.setContextMenu(menu);tray.setToolTip(('Cypher · '+(value?.lines[index+1]??'')).slice(0,127))});
 }
 destroy(){this.extra.splice(0).forEach(tray=>tray.destroy())}
}
