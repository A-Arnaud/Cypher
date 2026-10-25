interface ShortcutAPI {register(value:string,callback:()=>void):boolean;unregister(value:string):void}

export class ShortcutBinding {
 private active:string|undefined;
 constructor(private api:ShortcutAPI,private callback:()=>void){}
 replace(value:string):boolean{
  if(value===this.active)return true;
  try{if(!this.api.register(value,this.callback))return false}catch{return false}
  const previous=this.active;
  this.active=value;
  if(previous)this.api.unregister(previous);
  return true;
 }
}
