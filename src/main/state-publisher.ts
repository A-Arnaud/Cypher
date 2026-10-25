// A collection burst should paint once; hidden renderer windows catch up on show.
export class StatePublisher {
 private timer:ReturnType<typeof setTimeout>|undefined;
 private stopped=false;
 constructor(private renderTaskbar:()=>void,private sendRenderer:()=>void,private visible:()=>boolean){}
 request(){if(!this.stopped&&!this.timer)this.timer=setTimeout(()=>this.flush(),50)}
 flush(){clearTimeout(this.timer);this.timer=undefined;if(this.stopped)return;this.renderTaskbar();if(this.visible())this.sendRenderer()}
 stop(){this.stopped=true;clearTimeout(this.timer);this.timer=undefined}
}
