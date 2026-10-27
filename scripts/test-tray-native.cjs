// Safe native Electron tray smoke: no app entry point, provider, registry or taskbar helper.
// Run: node scripts/test-tray-native.cjs [optional path to a development Electron executable]
// This runs the tray backend on the current host; it does NOT certify Windows 11.
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {spawn}=require('node:child_process');
const {build}=require('esbuild');
(async()=>{
 const scratch=path.join(process.env.HERMES_HOME??(process.env.LOCALAPPDATA?path.join(process.env.LOCALAPPDATA,'hermes'):path.join(os.homedir(),'.hermes')),'cache','scratch');
 await fs.mkdir(scratch,{recursive:true});
 const root=await fs.mkdtemp(path.join(scratch,'cypher-native-tray-'));
 try{
  const entry=path.join(root,'smoke.cjs');
  const source=`
import {app,Tray,Menu,nativeImage,BrowserWindow} from 'electron';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createTaskbarHost} from './src/main/tray-host';
import {trayMenuTemplate} from './src/main/tray-menu';
import {Docking} from './src/main/docking';
import {defaultSettings} from './src/shared/defaults';
import {taskbarSummary} from './src/shared/taskbar';
app.setName('Cypher isolated tray smoke');app.setPath('userData',path.join(${JSON.stringify(root)},'profile'));
app.disableHardwareAcceleration();
let tray,window,host;
app.whenReady().then(async()=>{
 let settings={...defaultSettings(),taskbarMode:true,taskbarOnboarded:true,pinned:['codex','claude','gemini','openai'],consents:['codex','claude','gemini','openai'],language:'en'};
 let state={settings,profiles:[{id:'codex',providerId:'codex',label:'private@example.invalid'}],providers:[{id:'codex',state:'stale',account:'never-display-this',metrics:[{remainingPercent:23}]}]};
 let presentation,menu,tooltip,nativeCalls=0,refreshes=0,pauses=0;
 window=new BrowserWindow({show:false,width:240,height:120,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});
 // A native BrowserWindow with no navigation has not produced a first frame yet.
 // Load the isolated fixture before asserting visibility from menu callbacks.
 await window.loadURL('data:text/html,<title>Cypher isolated tray smoke</title><p>Fixture only</p>');
 const actions={toggle:()=>window.isVisible()?window.hide():window.show(),refresh:()=>refreshes++,pause:()=>{settings.paused=!settings.paused;pauses++;updateMenu()},quit:()=>{}};
 function updateMenu(){menu=Menu.buildFromTemplate(trayMenuTemplate(settings.language,settings.paused,presentation?.lines??[],actions));tray.setContextMenu(menu);tooltip=presentation?.tooltip??'Cypher';tray.setToolTip(tooltip);}
 tray=new Tray(nativeImage.createFromPath(${JSON.stringify(path.resolve('assets/icon.png'))}).resize({width:20,height:20}));
 host=createTaskbarHost('tray',()=>{nativeCalls++;throw Error('native helper forbidden')},value=>{presentation=value;updateMenu()});
 const docking=new Docking({settings:()=>settings,start:()=>host.start(),ready:()=>host.isReady(),stop:()=>host.stop(),save:async patch=>{settings={...settings,...patch}},status:()=>{},show:()=>window.show(),hide:()=>window.hide()});
 await docking.restore();host.render({...taskbarSummary(state),language:settings.language});
 assert(host.isReady());assert.equal(nativeCalls,0);assert(tooltip.length<=127);assert(tooltip.includes('23%'));assert(tooltip.includes('stale'));assert(tooltip.includes('—'));assert(tooltip.includes('+1'));
 assert(!JSON.stringify(presentation).match(/private@|never-display-this/));
 const labels=menu.items.map(item=>item.label);assert(labels.includes('Codex : 23% (stale)'));assert(labels.includes('+1'));assert(labels.includes('Show / Hide'));assert(labels.includes('Quit'));
 const click=label=>{const item=menu.items.find(item=>item.label===label);assert(item);item.click(item,window,{});};
 click('Show / Hide');assert(window.isVisible(),'first tray toggle must show the loaded fixture');click('Show / Hide');assert(!window.isVisible(),'second tray toggle must hide the fixture');click('Refresh');click('Pause');assert.equal(refreshes,1);assert.equal(pauses,1);assert(menu.items.some(item=>item.label==='Resume'));
 await docking.setEnabled(false);assert(window.isVisible());assert(!host.isReady());assert.equal(tooltip,'Cypher');assert(!menu.items.some(item=>item.label.includes('23%')));
 await docking.setEnabled(true);host.render({...taskbarSummary(state),language:'fr'});assert(host.isReady());assert(!window.isVisible());assert(tooltip.includes('ancien'));assert.equal(nativeCalls,0);
 await docking.shutdown();assert(!host.isReady());tray.destroy();assert(tray.isDestroyed());window.destroy();
 console.log(JSON.stringify({passed:true,checks:['real Electron Tray/Menu','isolated profile','persisted taskbarMode restored without native helper or registry','127-character quota tooltip, stale/unknown/+N','no account label leakage','show/hide, refresh, pause/resume retained','disable reveals window, re-enable, shutdown'],windows11DeviceValidated:false}));app.exit(0);
}).catch(error=>{console.error(error);if(tray&&!tray.isDestroyed())tray.destroy();if(window&&!window.isDestroyed())window.destroy();app.exit(1)});
`;
  await build({stdin:{contents:source,resolveDir:process.cwd(),sourcefile:'tray-native-smoke.ts',loader:'ts'},bundle:true,platform:'node',format:'cjs',external:['electron'],outfile:entry});
  if(process.argv.includes('--bundle-only')){console.log('Native tray smoke bundle compiled (Electron not launched)');return;}
  const env={...process.env};for(const key of ['ELECTRON_RUN_AS_NODE','NODE_OPTIONS','NODE_EXTRA_CA_CERTS','NODE_TLS_REJECT_UNAUTHORIZED'])delete env[key];
  // GUI fixture: SW_HIDE in STARTUPINFO can suppress its first ShowWindow on Windows.
  // Unlike console collectors this test must launch with normal GUI visibility semantics.
  const code=await new Promise((resolve,reject)=>{const child=spawn(process.argv[2]??require('electron'),[entry],{env,windowsHide:false,stdio:'inherit'});const timer=setTimeout(()=>{child.kill();reject(Error('tray smoke timed out'))},30000);child.once('error',error=>{clearTimeout(timer);reject(error)});child.once('exit',code=>{clearTimeout(timer);resolve(code)})});
  if(code!==0)throw Error('tray smoke failed: '+code);
 }finally{await fs.rm(root,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
