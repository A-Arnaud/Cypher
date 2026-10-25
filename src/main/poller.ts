import type {ProviderSnapshot} from '../shared/model';
export type Collector=(id:string,signal:AbortSignal)=>Promise<ProviderSnapshot>;
export class Poller {
 private nextDue=new Map<string,number>();
 refreshDue():Promise<ProviderSnapshot[]>{
  if(this.stopped)return Promise.resolve([...this.values.values()]);
  return Promise.all(this.ids.filter(id=>this.running.has(id)||(this.nextDue.get(id)??0)<=Date.now()).map(id=>this.run(id))).then(()=>[...this.values.values()]);
 }
 private values=new Map<string,ProviderSnapshot>();private running=new Map<string,Promise<void>>();private controllers=new Map<string,AbortController>();private timers=new Map<string,ReturnType<typeof setTimeout>>();private failures=new Map<string,number>();private listeners=new Set<(s:ProviderSnapshot[])=>void>();private stopped=false;
 constructor(private ids:string[],private collector:Collector,private interval=60000,private thresholds=[20,5],private alert:(id:string,n:number)=>void=()=>{},private sent=new Set<string>(),initial:ProviderSnapshot[]=[],private repeat:(snapshot:ProviderSnapshot)=>boolean=()=>true){for(const value of initial){if(ids.includes(value.id))this.values.set(value.id,value)}}
 refresh(id?:string):Promise<ProviderSnapshot[]>{if(this.stopped)return Promise.resolve([...this.values.values()]);return Promise.all((id?[id]:this.ids).filter(x=>this.ids.includes(x)).map(x=>this.run(x))).then(()=>[...this.values.values()])}
 private run(id:string):Promise<void>{
  const existing=this.running.get(id);if(existing)return existing;
  clearTimeout(this.timers.get(id));const ctrl=new AbortController();this.controllers.set(id,ctrl);
  const promise=this.collector(id,ctrl.signal).catch(()=>({id,auth:'unknown',metrics:[],state:'error',message:'collectionFailed',observedAt:Date.now()} as ProviderSnapshot)).then(s=>{
   if(this.stopped)return;
   if(s.state==='error'){
    const previous=this.values.get(id);
    const sameAccount=(!s.identityKey||!previous?.identityKey||s.identityKey===previous.identityKey)&&(!s.account||!previous?.account||s.account===previous.account);
    if(previous?.metrics.length&&s.auth!=='required'&&sameAccount)s={...previous,state:'stale',message:s.message};
    this.failures.set(id,(this.failures.get(id)??0)+1);
   }else{this.failures.delete(id)}
   this.values.set(id,s);
   if(s.state==='ready')for(const m of s.metrics){if(m.source!=='provider'||m.unit!=='percent'||m.remainingPercent===undefined)continue;for(const threshold of this.thresholds){const key=`${id}:${s.account??''}:${m.id}:${m.resetAt??'unknown'}:${threshold}`;if(m.remainingPercent<=threshold&&!this.sent.has(key)){this.sent.add(key);this.alert(id,threshold)}}}
   for(const listener of this.listeners)listener([...this.values.values()]);
  }).finally(()=>{this.running.delete(id);this.controllers.delete(id);if(!this.stopped){const value=this.values.get(id);if(value&&!this.repeat(value)){this.nextDue.set(id,Infinity);return}const wait=Math.min(900000,this.interval*2**(this.failures.get(id)??0));this.nextDue.set(id,Date.now()+wait);this.timers.set(id,setTimeout(()=>{void this.run(id)},wait))}});
  this.running.set(id,promise);return promise;
 }
 subscribe(listener:(s:ProviderSnapshot[])=>void):()=>void{this.listeners.add(listener);return ()=>{this.listeners.delete(listener)}}
 stop():void{this.stopped=true;for(const timer of this.timers.values())clearTimeout(timer);for(const ctrl of this.controllers.values())ctrl.abort();this.listeners.clear()}
}
