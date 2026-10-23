import type {ProviderSnapshot} from '../shared/model';
export type Collector=(id:string,signal:AbortSignal)=>Promise<ProviderSnapshot>;
export class Poller {
 private values=new Map<string,ProviderSnapshot>();private running=new Map<string,Promise<void>>();private controllers=new Map<string,AbortController>();private timers=new Map<string,ReturnType<typeof setTimeout>>();private failures=new Map<string,number>();private listeners=new Set<(s:ProviderSnapshot[])=>void>();private sent=new Set<string>();private stopped=false;
 constructor(private ids:string[],private collector:Collector,private interval=60000,private thresholds=[20,5],private alert:(id:string,n:number)=>void=()=>{}){}
 refresh(id?:string):Promise<ProviderSnapshot[]>{if(this.stopped)return Promise.resolve([...this.values.values()]);return Promise.all((id?[id]:this.ids).filter(x=>this.ids.includes(x)).map(x=>this.run(x))).then(()=>[...this.values.values()])}
 private run(id:string):Promise<void>{
  const existing=this.running.get(id);if(existing)return existing;
  clearTimeout(this.timers.get(id));const ctrl=new AbortController();this.controllers.set(id,ctrl);
  const promise=this.collector(id,ctrl.signal).catch(()=>({id,auth:'unknown',metrics:[],state:'error',message:'collectionFailed',observedAt:Date.now()} as ProviderSnapshot)).then(s=>{
   if(this.stopped)return;
   if(s.state==='error'){const previous=this.values.get(id);if(previous?.metrics.length)s={...previous,state:'stale',message:'collectionFailed'};this.failures.set(id,(this.failures.get(id)??0)+1)}else{this.failures.delete(id)}
   this.values.set(id,s);
   if(s.state==='ready')for(const m of s.metrics){if(m.source!=='provider'||m.unit!=='percent'||m.remainingPercent===undefined)continue;for(const threshold of this.thresholds){const key=`${id}:${s.account??''}:${m.id}:${m.resetAt??'unknown'}:${threshold}`;if(m.remainingPercent<=threshold&&!this.sent.has(key)){this.sent.add(key);this.alert(id,threshold)}}}
   for(const listener of this.listeners)listener([...this.values.values()]);
  }).finally(()=>{this.running.delete(id);this.controllers.delete(id);if(!this.stopped){const wait=Math.min(900000,this.interval*2**(this.failures.get(id)??0));this.timers.set(id,setTimeout(()=>{void this.run(id)},wait))}});
  this.running.set(id,promise);return promise;
 }
 subscribe(listener:(s:ProviderSnapshot[])=>void):()=>void{this.listeners.add(listener);return ()=>{this.listeners.delete(listener)}}
 stop():void{this.stopped=true;for(const timer of this.timers.values())clearTimeout(timer);for(const ctrl of this.controllers.values())ctrl.abort();this.listeners.clear()}
}
