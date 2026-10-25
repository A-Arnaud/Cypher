import {expect,it} from 'vitest';
import {CollectionQueue} from '../src/main/collection-queue';

it('runs expensive collections one at a time and releases the queue after failure',async()=>{
 const queue=new CollectionQueue();const signal=new AbortController().signal;const started:string[]=[];
 let release!:()=>void;
 const first=queue.run(signal,async()=>{started.push('first');await new Promise<void>(r=>release=r);throw Error('failed')});
 const failed=expect(first).rejects.toThrow('failed');
 const second=queue.run(signal,async()=>{started.push('second');return 42});
 await Promise.resolve();expect(started).toEqual(['first']);release();await failed;
 expect(await second).toBe(42);expect(started).toEqual(['first','second']);
});

it('cancels queued work without starting it and leaves the next request usable',async()=>{
 const queue=new CollectionQueue();let release!:()=>void;const cancelled=new AbortController();let started=false;
 const first=queue.run(new AbortController().signal,()=>new Promise<void>(r=>release=r));
 const second=queue.run(cancelled.signal,async()=>{started=true});
 const rejected=expect(second).rejects.toThrow('aborted');cancelled.abort();await rejected;
 expect(started).toBe(false);release();await first;
 expect(await queue.run(new AbortController().signal,async()=>7)).toBe(7);
});
