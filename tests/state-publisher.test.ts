import {it,expect,vi} from 'vitest';
import {StatePublisher} from '../src/main/state-publisher';
it('coalesces a burst and sends the latest value, with no renderer work while hidden',async()=>{
 vi.useFakeTimers();let value=0,visible=false;const taskbar:number[]=[],renderer:number[]=[];
 const p=new StatePublisher(()=>taskbar.push(value),()=>renderer.push(value),()=>visible);
 try{for(let i=0;i<40;i++){value=i;p.request()}
 await vi.advanceTimersByTimeAsync(50);expect(taskbar).toEqual([39]);expect(renderer).toEqual([]);
 visible=true;p.flush();expect(renderer).toEqual([39]);
 value=40;p.request();p.stop();await vi.advanceTimersByTimeAsync(100);expect(renderer).toEqual([39]);
 }finally{p.stop();vi.useRealTimers()}
});
it('flush cancels a queued duplicate publication',async()=>{
 vi.useFakeTimers();let sends=0;const p=new StatePublisher(()=>{},()=>sends++,()=>true);
 try{p.request();p.flush();await vi.advanceTimersByTimeAsync(100);expect(sends).toBe(1)}finally{p.stop();vi.useRealTimers()}
});
