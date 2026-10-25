// Shared across poller replacements so active CLI requests share one queue.
export class CollectionQueue {
 private busy=false;
 private waiting:Array<()=>void>=[];

 run<T>(signal:AbortSignal,collect:()=>Promise<T>):Promise<T>{
  return new Promise<T>((resolve,reject)=>{
   if(signal.aborted){reject(Error('aborted'));return}
   const abort=()=>{
    this.waiting=this.waiting.filter(entry=>entry!==start);
    reject(Error('aborted'));
   };
   const start=()=>{
    signal.removeEventListener('abort',abort);
    this.busy=true;
    void (async()=>{
     try{if(signal.aborted)throw Error('aborted');resolve(await collect())}
     catch(error){reject(error)}
     finally{this.busy=false;this.waiting.shift()?.()}
    })();
   };
   if(this.busy){this.waiting.push(start);signal.addEventListener('abort',abort,{once:true})}
   else start();
  });
 }
}
