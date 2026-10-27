export type CloseChoice='keep'|'quit'|'cancel';
interface Host {choose:()=>Promise<CloseChoice>;keep:()=>Promise<void>;quit:()=>void;quitting:()=>boolean;failed:(stage:'dialog'|'bar')=>void}
/** Serializes repeated close requests without turning Escape/cancel into a hide or quit. */
export class WindowClose {
 private pending:Promise<void>|undefined;
 constructor(private host:Host){}
 request():Promise<void>{
  if(this.host.quitting())return Promise.resolve();if(this.pending)return this.pending;
  this.pending=this.run().finally(()=>{this.pending=undefined});return this.pending;
 }
 private async run(){let stage:'dialog'|'bar'='dialog';try{const choice=await this.host.choose();if(this.host.quitting())return;if(choice==='keep'){stage='bar';await this.host.keep()}else if(choice==='quit')this.host.quit()}catch{if(!this.host.quitting())this.host.failed(stage)}}
}
