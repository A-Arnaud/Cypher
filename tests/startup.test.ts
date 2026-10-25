import {it,expect} from 'vitest';import {createStartup,startupSupported,type LoginAdapter} from '../src/main/startup';
it('allows a packaged stable extracted copy but never a portable, development or temporary executable',()=>{
 const input={platform:'win32',packaged:true,portable:false,executable:'C:/Users/me/AppData/Local/Programs/Cypher/Cypher.exe',temp:'C:/Users/me/AppData/Local/Temp'};
 expect(startupSupported(input)).toBe(true);
 expect(startupSupported({...input,packaged:false})).toBe(false);
 expect(startupSupported({...input,portable:true})).toBe(false);
 expect(startupSupported({...input,platform:'linux'})).toBe(false);
 expect(startupSupported({...input,executable:'C:/Users/me/AppData/Local/TEMP/unpacked/Cypher.exe'})).toBe(false);
 expect(startupSupported({...input,executable:'C:/Users/me/AppData/Local/Temporary/Cypher.exe'})).toBe(true);
});
function fixture(available=true){let item={openAtLogin:false,launchItems:[] as {name:string;path:string;args:string[];enabled:boolean}[]};let reject=false;const writes:any[]=[];const api:LoginAdapter={getLoginItemSettings:()=>item,setLoginItemSettings:o=>{writes.push(o);if(!reject)item={openAtLogin:o.openAtLogin,launchItems:o.openAtLogin?[{name:o.name,path:o.path,args:o.args,enabled:o.enabled}]:[]}}};return {startup:createStartup(api,'C:/Program Files/Cypher/Cypher.exe',available),writes,block:()=>{reject=true},disable:()=>{item.launchItems[0].enabled=false}}}
it('registers a stable executable and explicit startup argument, then reads actual launch item back',async()=>{const f=fixture();await f.startup.configureStartup(true);expect(f.startup.startupStatus()).toBe(true);expect(f.writes[0]).toEqual({name:'Cypher',path:'C:/Program Files/Cypher/Cypher.exe',args:['--cypher-startup'],openAtLogin:true,enabled:true});await f.startup.configureStartup(false);expect(f.startup.startupStatus()).toBe(false)});
it('never registers dev or portable extraction paths',async()=>{const f=fixture(false);await expect(f.startup.configureStartup(true)).rejects.toThrow('startup-install-required');expect(f.writes).toEqual([])});
it('respects Windows-disabled startup instead of inferring enabled from registration',async()=>{const f=fixture();await f.startup.configureStartup(true);f.disable();expect(f.startup.startupStatus()).toBe(false)});
it('rejects readback failure and restores previous enabled state',async()=>{const f=fixture();f.block();await expect(f.startup.configureStartup(true)).rejects.toThrow('startup-failed');expect(f.writes.map(w=>w.openAtLogin)).toEqual([true,false])});
it('verifies exact registry command when Electron returns empty parsed arguments',()=>{const api:LoginAdapter={setLoginItemSettings:()=>{},getLoginItemSettings:()=>({openAtLogin:false,launchItems:[{name:'Cypher',path:'C:\\Apps\\Cypher.exe',args:[],enabled:true}]})};expect(createStartup(api,'C:\\Apps\\Cypher.exe',true,()=>'"C:\\Apps\\Cypher.exe" --cypher-startup').startupStatus()).toBe(true);expect(createStartup(api,'C:\\Apps\\Cypher.exe',true,()=>'"C:\\Apps\\Cypher.exe" --wrong-argument').startupStatus()).toBe(false)});
