import type {Settings,SettingsPatch,AppState} from '../shared/model';
interface Host {settings:()=>Settings;start:()=>Promise<void>;ready:()=>boolean;stop:()=>Promise<void>;save:(p:SettingsPatch)=>Promise<void>;status:(s:NonNullable<AppState['taskbarStatus']>)=>void;show:()=>void;hide:()=>void}
export class Docking {
 private queue=Promise.resolve();private generation=0;private stopped=false;
 constructor(private host:Host){}
 setEnabled(enabled:boolean):Promise<void>{const generation=++this.generation;const result=this.queue.then(()=>{if(this.stopped)throw Error('taskbar-cancelled');return this.apply(enabled,generation)});this.queue=result.catch(()=>{});return result}
 recover(attempts=15,delay=1000):Promise<void>{const generation=++this.generation;const result=this.queue.then(async()=>{for(let i=0;i<attempts;i++){await new Promise(r=>setTimeout(r,delay));if(this.stopped||generation!==this.generation||!this.host.settings().taskbarMode)return;this.host.status('starting');try{await this.host.start();this.check(generation);this.host.status('ready');return}catch{if(!this.stopped&&generation===this.generation){this.host.status('error');this.host.show()}}}});this.queue=result.catch(()=>{});return result}
 async shutdown(){this.stopped=true;this.generation++;await this.host.stop()}
 async restore():Promise<void>{const generation=++this.generation;this.host.status('starting');try{await this.host.start();this.check(generation);this.host.status('ready')}catch(e){if(!this.stopped){this.host.status('error');this.host.show()}throw e}}
 private check(generation:number){if(this.stopped||generation!==this.generation||!this.host.ready())throw Error('taskbar-cancelled')}
 private async apply(enabled:boolean,generation:number){
  const h=this.host;if(!enabled){await h.stop();await h.save({taskbarMode:false});h.status('off');h.show();return}
  const previous={taskbarMode:h.settings().taskbarMode,taskbarOnboarded:h.settings().taskbarOnboarded};let saved=false;
  h.status('starting');try{
   await h.start();this.check(generation);
   await h.save({taskbarMode:true,taskbarOnboarded:true});saved=true;this.check(generation);h.status('ready');h.hide();
  }catch(e){await h.stop();if(saved)await h.save(previous).catch(()=>{});if(!this.stopped){h.status('error');h.show()}throw e}
 }
}
