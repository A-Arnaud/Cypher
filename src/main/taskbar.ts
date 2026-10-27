import {spawn,type ChildProcessWithoutNullStreams} from 'node:child_process';
import {catalog} from '../shared/catalog';
import type {Language} from '../shared/model';import type {TaskbarItem} from '../shared/taskbar';
type Render={items:TaskbarItem[];extraCount:number;language:Language};
interface Options {executable:string;args?:string[];timeout?:number;onOpen:()=>void;onError:(code:string)=>void}
interface Session {child:ChildProcessWithoutNullStreams;ready:boolean;stopping:boolean;buffer:string;timer:ReturnType<typeof setTimeout>;resolve:()=>void;reject:(e:Error)=>void;pending?:string;lastRender?:string;blocked:boolean;done:Promise<void>}
export class TaskbarHost {
 private session?:Session;private starting?:Promise<void>;
 constructor(private options:Options){}
 isReady():boolean {const session=this.session;return !!session?.ready&&!session.stopping&&!session.child.killed&&session.child.exitCode===null}
 start():Promise<void>{
  if(this.starting)return this.starting;if(this.session?.ready)return Promise.resolve();
  this.starting=new Promise<void>((resolve,reject)=>{
   const child=spawn(this.options.executable,this.options.args??[],{windowsHide:true,stdio:'pipe'});
   const session:Session={child,ready:false,stopping:false,buffer:'',timer:setTimeout(()=>fail('taskbar-timeout'),this.options.timeout??8000),resolve,reject,blocked:false,done:new Promise<void>(done=>{child.once('close',()=>done())})};
   this.session=session;
   const fail=(code:string)=>{if(this.session!==session||session.stopping)return;session.stopping=true;clearTimeout(session.timer);this.session=undefined;if(session.ready)this.options.onError(code);else reject(Error(code));child.stdin.destroy();child.kill()};
   child.once('error',()=>fail('taskbar-unavailable'));
   child.once('close',()=>fail('taskbar-unavailable'));
   child.stderr.resume();child.stdin.on('error',()=>fail('taskbar-unavailable'));
   child.stdin.on('drain',()=>{if(this.session!==session)return;session.blocked=false;if(session.pending){const value=session.pending;session.pending=undefined;session.blocked=!child.stdin.write(value)}});
   child.stdout.setEncoding('utf8');child.stdout.on('data',(chunk:string)=>{
    if(this.session!==session||session.stopping)return;session.buffer+=chunk;if(session.buffer.length>16384){fail('taskbar-protocol');return}
    let newline:number;while((newline=session.buffer.indexOf('\n'))>=0){const line=session.buffer.slice(0,newline).replace(/^\uFEFF/,'');session.buffer=session.buffer.slice(newline+1);try{
     const message=JSON.parse(line);if(message.type==='ready'&&!session.ready){session.ready=true;clearTimeout(session.timer);resolve()}
     else if(message.type==='open'&&session.ready)this.options.onOpen();
     else if(message.type==='error')fail('taskbar-unavailable');
     else fail('taskbar-protocol');
    }catch{fail('taskbar-protocol')}}
   });
  });
  const result=this.starting;void result.finally(()=>{if(this.starting===result)this.starting=undefined}).catch(()=>{});return result;
 }
 render(value:Render):void{const session=this.session;if(!session?.ready||session.stopping)return;const items=value.items.map(item=>({...item,label:catalog.find(c=>c.id===item.providerId)?.name??'Cypher'}));const line=JSON.stringify({type:'render',...value,items})+'\n';if(Buffer.byteLength(line)>12000||line===session.lastRender)return;session.lastRender=line;if(session.blocked)session.pending=line;else session.blocked=!session.child.stdin.write(line)}
 async stop():Promise<void>{
  const session=this.session;if(!session)return;session.stopping=true;this.session=undefined;clearTimeout(session.timer);if(!session.ready)session.reject(Error('taskbar-cancelled'));
  session.child.stdin.end('{"type":"quit"}\n');const timer=setTimeout(()=>session.child.kill(),2000);try{await session.done}finally{clearTimeout(timer)}
 }
}
