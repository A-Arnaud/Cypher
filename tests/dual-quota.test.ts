import {it,expect} from 'vitest';
import type {Metric} from '../src/shared/model';
import {taskbarQuotas} from '../src/shared/taskbar';
import {TrayHost,type TrayPresentation} from '../src/main/tray-host';
const metric=(label:string,remainingPercent:number,id=label):Metric=>({id,label,remainingPercent,unit:'percent',source:'provider',observedAt:1});
it('shows the real 5h and 7d windows separately even when returned in reverse order',()=>{
 expect(taskbarQuotas([metric('10080m',62),metric('300m',0)])).toEqual([{label:'5h',text:'0%'},{label:'7d',text:'62%'}]);
});
it('preserves actual window durations and never turns spending into a percentage',()=>{
 expect(taskbarQuotas([metric('30m',100,'codex:primary'),metric('1440m',42,'codex:secondary'),{...metric('cost',20),unit:'currency'}])).toEqual([{label:'30m',text:'100%'},{label:'1d',text:'42%'}]);
});
it('keeps an invalid short window unknown without substituting the weekly value',()=>{
 expect(taskbarQuotas([metric('300m',NaN),metric('10080m',24)])).toEqual([{label:'5h',text:'—'},{label:'7d',text:'24%'}]);
 expect(taskbarQuotas([metric('10080m',24)])).toEqual([{label:'7d',text:'24%'}]);
});
it('renders both windows in native menus with public names and bounded safe numeric images',async()=>{
 let result:TrayPresentation|undefined;const host=new TrayHost(value=>result=value);await host.start();
 host.render({language:'fr',extraCount:0,items:[{id:'private-id',providerId:'codex',label:'private@example.invalid',text:'0%',stale:true,quotas:[{label:'5h',text:'0%'},{label:'7d',text:'62%'}]}]});
 expect(result?.lines).toEqual(['Codex : 5h 0% / 7j 62% (ancien)']);expect(result?.title).toBe('');expect(result?.items?.[0].quotas).toEqual([{label:'5h',text:'0%'},{label:'7d',text:'62%'}]);expect(JSON.stringify(result)).not.toMatch(/private/);
 host.render({language:'en',extraCount:0,items:[{id:'x',providerId:'codex',label:'unused',text:'0%',stale:false,quotas:[{label:'SECRET',text:'SECRET'},{label:'7d',text:'999%'}]}]});expect(JSON.stringify(result)).not.toMatch(/SECRET|999/);await host.stop();
});
