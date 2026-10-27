import {it,expect} from 'vitest';import {TaskbarHost} from '../src/main/taskbar';
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const render={items:[{id:'codex',providerId:'codex',label:'Codex',text:'25%',stale:false}],extraCount:0,language:'fr' as const};
it('sends only changed renders and sends the initial render again after restart',async()=>{
 const f=host(`console.log(JSON.stringify({type:'ready'}));require('node:readline').createInterface({input:process.stdin}).on('line',line=>{const message=JSON.parse(line);if(message.type==='render')console.log(JSON.stringify({type:'open'}));if(message.type==='quit')process.exit()})`);
 try{
  await f.host.start();f.host.render(render);f.host.render({...render});f.host.render({...render,extraCount:1});await wait(150);
  expect(f.events).toEqual(['open','open']);
  await f.host.stop();await f.host.start();f.host.render({...render,extraCount:1});await wait(150);expect(f.events).toEqual(['open','open','open']);
 }finally{await f.host.stop()}
});
function host(source:string,timeout=1000){const events:string[]=[];return {events,host:new TaskbarHost({executable:process.execPath,args:['-e',source],timeout,onOpen:()=>events.push('open'),onError:code=>events.push(code)})}}
it('does not send a private account label to the native tooltip painter',async()=>{
 const f=host(`console.log(JSON.stringify({type:'ready'}));require('node:readline').createInterface({input:process.stdin}).on('line',line=>{const message=JSON.parse(line);if(message.type==='render'){if(message.items[0].label==='Codex'&&!line.includes('private@example.invalid'))console.log(JSON.stringify({type:'open'}));else console.log(JSON.stringify({type:'error'}))}if(message.type==='quit')process.exit()})`);
 try{await f.host.start();f.host.render({...render,items:[{...render.items[0],label:'private@example.invalid'}]});await wait(150);expect(f.events).toEqual(['open'])}finally{await f.host.stop()}
});
it('waits for native ready and carries latest render without spawning more processes',async()=>{const f=host(`console.log(JSON.stringify({type:'ready'}));process.stdin.on('data',d=>{if(d.toString().includes('render'))console.log(JSON.stringify({type:'open'}));if(d.toString().includes('quit'))process.exit()})`);try{await f.host.start();f.host.render(render);await wait(60);expect(f.events).toEqual(['open']);await f.host.stop();expect(f.events).toEqual(['open'])}finally{await f.host.stop()}});
it('rejects helper exit before ready and never treats spawn as attachment',async()=>{const f=host('process.exit(1)');await expect(f.host.start()).rejects.toThrow('taskbar-unavailable')});
it('bounds ready wait and cleans up a helper that never attaches',async()=>{const f=host('setInterval(()=>{},1000)',80);await expect(f.host.start()).rejects.toThrow('taskbar-timeout');await f.host.stop()});
it('rejects malformed and oversized helper output',async()=>{for(const output of ['not json','x'.repeat(18000)]){const f=host('console.log('+JSON.stringify(output)+');setInterval(()=>{},1000)');await expect(f.host.start()).rejects.toThrow('taskbar-protocol');await f.host.stop()}});
it('surfaces loss after ready, and stop cancels a pending start',async()=>{const f=host(`console.log('{"type":"ready"}');setTimeout(()=>process.exit(2),80)`);await f.host.start();await wait(160);expect(f.events).toEqual(['taskbar-unavailable']);const pending=host('setInterval(()=>{},1000)');const ready=pending.host.start();const result=expect(ready).rejects.toThrow('taskbar-cancelled');await pending.host.stop();await result});
