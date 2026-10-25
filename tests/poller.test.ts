import {it,expect,vi} from 'vitest';import {Poller} from '../src/main/poller';import type {ProviderSnapshot} from '../src/shared/model';
it('focus refresh reuses fresh values and respects error backoff',async()=>{
 vi.useFakeTimers();let calls=0;
 const p=new Poller(['codex'],async()=>{calls++;return {...snapshot(0),state:'error',metrics:[]}});
 try{await p.refresh();await p.refreshDue();expect(calls).toBe(1);
 await vi.advanceTimersByTimeAsync(60000);await p.refreshDue();expect(calls).toBe(1);
 await vi.advanceTimersByTimeAsync(60000);expect(calls).toBe(2);
 }finally{p.stop();vi.useRealTimers()}
});
it('focus joins a pending read instead of launching another',async()=>{
 let release!:(s:ProviderSnapshot)=>void;let calls=0;
 const p=new Poller(['codex'],()=>{calls++;return new Promise(r=>release=r)});
 try{const first=p.refresh();const focus=p.refreshDue();expect(calls).toBe(1);release(snapshot(50));await first;await focus;await p.refreshDue();expect(calls).toBe(1)}finally{p.stop()}
});
function snapshot(n:number):ProviderSnapshot{return {id:'codex',auth:'connected',state:'ready',message:'providerData',observedAt:Date.now(),metrics:[{id:'codex:primary',label:'session',remainingPercent:n,unit:'percent',source:'provider',observedAt:Date.now(),resetAt:9999999999999}]}}
it('collects static entries once but still supports explicit refresh',async()=>{
 vi.useFakeTimers();let calls=0;const p=new Poller(['codex'],async()=>{calls++;return {...snapshot(0),state:'consent',metrics:[]}},60000,[],()=>{},new Set(),[],()=>false);
 try{await p.refresh();await vi.advanceTimersByTimeAsync(180000);await p.refreshDue();expect(calls).toBe(1);await p.refresh();expect(calls).toBe(2)}finally{p.stop();vi.useRealTimers()}
});
it('serializes overlapping refresh and publishes collection',async()=>{let calls=0;let release!:(v:ProviderSnapshot)=>void;const p=new Poller(['codex'],async()=>{calls++;return new Promise(res=>release=res)});const first=p.refresh();const second=p.refresh();expect(calls).toBe(1);release(snapshot(68));expect((await first)[0].metrics[0].remainingPercent).toBe(68);await second;p.stop()});
it('keeps last good values stale on failure and obeys backoff',async()=>{vi.useFakeTimers();let fail=false,calls=0;const p=new Poller(['codex'],async()=>{calls++;return fail?{...snapshot(0),state:'error',metrics:[]}:snapshot(68)});await p.refresh();fail=true;const s=await p.refresh();expect(s[0].state).toBe('stale');expect(s[0].metrics[0].remainingPercent).toBe(68);await vi.advanceTimersByTimeAsync(60000);expect(calls).toBe(2);p.stop();vi.useRealTimers()});
it('notifies once per threshold and reset window',async()=>{const notices:number[]=[];let n=19;const p=new Poller(['codex'],async()=>snapshot(n),60000,[20,5],(_id,x)=>notices.push(x));await p.refresh();await p.refresh();n=4;await p.refresh();expect(notices).toEqual([20,5]);p.stop()});
it('does not repeat alerts after pause and settings recreation',async()=>{const sent=new Set<string>();const notices:number[]=[];const make=()=>new Poller(['codex'],async()=>snapshot(19),60000,[20,5],(_id,n)=>notices.push(n),sent);const p=make();await p.refresh();p.stop();const q=make();await q.refresh();q.stop();expect(notices).toEqual([20])});
it('retains last successful values across poller recreation if the next request fails',async()=>{const p=new Poller(['codex'],async()=>snapshot(68));const previous=await p.refresh();p.stop();const q=new Poller(['codex'],async()=>({...snapshot(0),state:'error',metrics:[]}),60000,[20,5],()=>{},new Set(),previous);const result=await q.refresh();q.stop();expect(result[0].state).toBe('stale');expect(result[0].metrics[0].remainingPercent).toBe(68)});
it('aborts running collection on stop',async()=>{let aborted=false;const p=new Poller(['codex'],async(_id,sig)=>new Promise(res=>sig.addEventListener('abort',()=>{aborted=true;res(snapshot(50))})));const result=p.refresh();p.stop();await result;expect(aborted).toBe(true)});
