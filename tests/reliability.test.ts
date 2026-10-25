import {it,expect,vi} from 'vitest';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {Poller} from '../src/main/poller';
import {ShortcutBinding} from '../src/main/shortcut';
import {readSettings,validatePatch,defaultSettings} from '../src/main/settings';
import {metricValue,metricLabel} from '../src/shared/metric-format';
import {latestObservation} from '../src/shared/observation';
import type {AppState,Metric,ProviderSnapshot} from '../src/shared/model';

const metric:Metric={id:'balance',label:'apiBalance',remaining:24.5,unit:'currency',currency:'USD',source:'provider',observedAt:100};
const snapshot:ProviderSnapshot={id:'codex',auth:'connected',state:'ready',message:'providerData',observedAt:100,identityKey:'account-one',metrics:[metric]};

it('formats balances, zeroes, large points, and actual quota window lengths',()=>{
 expect(metricValue(metric,'en')).toBe('$24.50');
 expect(metricValue({...metric,remaining:0},'en')).toBe('$0.00');
 expect(metricValue({...metric,remaining:NaN},'en')).toBe('—');
 expect(metricValue({...metric,remaining:1500,unit:'points'},'en')).toBe('1,500');
 expect(metricLabel({...metric,label:'30m'},'fr')).toBe('30 min');
 expect(metricLabel({...metric,label:'300m'},'en')).toBe('5 h');
 expect(metricLabel({...metric,label:'10080m'},'fr')).toBe('7 jours');
 expect(metricLabel({...metric,label:'90m'},'en')).toBe('90 min');
});

it('uses actual pinned metric observations instead of catalogue and failed-read timestamps',()=>{
 const state={settings:{...defaultSettings(),pinned:['codex']},providers:[snapshot,{...snapshot,id:'other',observedAt:99999,metrics:[{...metric,observedAt:99999}]},{...snapshot,id:'planned',metrics:[],observedAt:88888}]} as AppState;
 expect(latestObservation(state)).toBe(100);
 expect(latestObservation({...state,providers:state.providers.map(p=>({...p,metrics:[]}))})).toBe(0);
 expect(latestObservation({...state,providers:[{...snapshot,metrics:[{...metric,observedAt:Infinity}]}]})).toBe(0);
});

it('keeps valid preferences while rejecting malformed consent and unknown future fields',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-settings-recovery-'));
 try{
  const file=path.join(root,'settings.json');
  await writeFile(file,JSON.stringify({language:'en',opacity:75,pollSeconds:-1,consents:['invalid'],futureSetting:true,pinned:['poe']}));
  expect(await readSettings(file)).toMatchObject({language:'en',opacity:75,pollSeconds:60,consents:[],pinned:['poe']});
  await writeFile(file,JSON.stringify({language:'en',consents:['poe'],futureSetting:true}));
  expect(await readSettings(file)).toMatchObject({language:'en',consents:['poe']});
  // Leniency is limited to disk recovery; incoming IPC remains strict.
  expect(()=>validatePatch(defaultSettings(),{futureSetting:true})).toThrow();
 }finally{await rm(root,{recursive:true,force:true})}
});

it('keeps the existing shortcut registered when a replacement is occupied or throws',()=>{
 const held=new Set<string>();
 const api={register:vi.fn((key:string)=>{if(key==='Control+Alt+X')return false;if(key==='Control+Alt+Z')throw Error('OS failure');held.add(key);return true}),unregister:vi.fn((key:string)=>{held.delete(key)})};
 const binding=new ShortcutBinding(api,()=>{});
 expect(binding.replace('Control+Alt+Q')).toBe(true);
 expect(binding.replace('Control+Alt+X')).toBe(false);
 expect(binding.replace('Control+Alt+Z')).toBe(false);
 expect([...held]).toEqual(['Control+Alt+Q']);
 expect(api.unregister).not.toHaveBeenCalled();
 expect(binding.replace('Control+Alt+W')).toBe(true);
 expect([...held]).toEqual(['Control+Alt+W']);
 expect(binding.replace('Control+Alt+W')).toBe(true);
 expect(api.register).toHaveBeenCalledTimes(4);
 expect(()=>validatePatch(defaultSettings(),{shortcut:'Ctrl+Control+Q'})).toThrow();
 expect(()=>validatePatch(defaultSettings(),{shortcut:'Alt+Alt+Q'})).toThrow();
});

it('retains stale metrics and the actionable failure reason after transient errors',async()=>{
 const poller=new Poller(['codex'],async()=>({...snapshot,metrics:[],state:'error',auth:'unknown',message:'apiRateLimited'}),60000,[],()=>{},new Set(),[snapshot]);
 try{expect((await poller.refresh())[0]).toMatchObject({state:'stale',message:'apiRateLimited',observedAt:100,metrics:[metric]})}finally{poller.stop()}
});

it('discards previous account metrics after authentication rejection or identity changes',async()=>{
 for(const failure of [{auth:'required' as const,message:'sessionExpired'},{auth:'connected' as const,message:'quotaReadFailed',identityKey:'account-two'}]){
  const poller=new Poller(['codex'],async()=>({...snapshot,...failure,metrics:[],state:'error'}),60000,[],()=>{},new Set(),[snapshot]);
  try{expect((await poller.refresh())[0]).toMatchObject({state:'error',metrics:[],message:failure.message})}finally{poller.stop()}
 }
});
