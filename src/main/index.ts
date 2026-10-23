import {app,BrowserWindow,Tray,Menu,nativeImage,ipcMain,globalShortcut,screen,shell,Notification,type IpcMainInvokeEvent} from 'electron';
import path from 'node:path';import os from 'node:os';
import {catalog} from '../shared/catalog';import {copy} from '../shared/i18n';import type {AppState,Settings} from '../shared/model';import {discoverTools,type Detection} from './discovery';import {collectProvider} from './providers';import {Poller} from './poller';import {readSettings,saveSettings,validatePatch,safeBounds} from './settings';import {providerUrl,trustedSender} from './security';
app.setName('Quota Glass');app.setAppUserModelId('local.quotaglass.desktop');
if(process.env.QG_DATA_DIR)app.setPath('userData',process.env.QG_DATA_DIR);
const ownsLock=app.requestSingleInstanceLock();if(!ownsLock)app.quit();
let window:BrowserWindow|undefined,tray:Tray|undefined,poller:Poller|undefined,quitting=false;
let state:AppState;let detections:Detection[]=[];let settingsFile='';const alertHistory=new Set<string>();
const renderer=path.join(__dirname,'../renderer/index.html');const devUrl=app.isPackaged?undefined:process.env.QG_DEV_URL;
function publish(){if(window&&!window.isDestroyed())window.webContents.send('qg:update',state)}
function toggle(){if(!window)return;window.isVisible()?window.hide():(window.show(),window.focus())}
function trayMenu(){if(!tray||!state)return;const t=(k:string)=>copy(state.settings.language,k);tray.setContextMenu(Menu.buildFromTemplate([{label:'Quota Glass',enabled:false},{type:'separator'},{label:state.settings.language==='fr'?'Afficher / Masquer':'Show / Hide',click:toggle},{label:t('refresh'),click:()=>{void refresh()}},{label:t(state.settings.paused?'resume':'pause'),click:()=>{void changeSettings({paused:!state.settings.paused})}},{type:'separator'},{label:t('quit'),click:()=>app.quit()}]));tray.setToolTip('Quota Glass — '+t(state.settings.paused?'paused':'active'))}
function bindShortcut(value:string){globalShortcut.unregisterAll();try{if(!globalShortcut.register(value,toggle))state.error='shortcutError';else if(state.error==='shortcutError')state.error=undefined}catch{state.error='shortcutError'}}
function newPoller(){
 poller?.stop();poller=undefined;if(state.settings.paused){publish();return}
 const p=new Poller(catalog.map(c=>c.id),(id,signal)=>collectProvider(id,{detections,consents:state.settings.consents},signal),state.settings.pollSeconds*1000,state.settings.alertThresholds,(id,n)=>{if(Notification.isSupported()){const name=catalog.find(c=>c.id===id)?.name??id;new Notification({title:'Quota Glass · '+name,body:state.settings.language==='fr'?`Quota restant : ${n}% ou moins`:`Remaining quota: ${n}% or less`,silent:false}).show()}},alertHistory);
 poller=p;p.subscribe(values=>{state.providers=values;publish()});void refresh();
}
async function refresh(){if(!poller||state.settings.paused)return;state.refreshing=true;publish();try{await poller.refresh()}finally{state.refreshing=false;publish()}}
async function changeSettings(input:unknown){const next=validatePatch(state.settings,input);if(next.startAtLogin)throw Error('portable-startup-disabled');const old=state.settings;await saveSettings(settingsFile,next);state.settings=next;window?.setAlwaysOnTop(next.alwaysOnTop);if(next.shortcut!==old.shortcut)bindShortcut(next.shortcut);if(JSON.stringify(next.consents)!==JSON.stringify(old.consents)){state.providers=state.providers.filter(p=>next.consents.includes(p.id)||!['codex','claude','ollama','lmstudio'].includes(p.id))}
 if(next.paused!==old.paused||next.pollSeconds!==old.pollSeconds||JSON.stringify(next.consents)!==JSON.stringify(old.consents)||JSON.stringify(next.alertThresholds)!==JSON.stringify(old.alertThresholds))newPoller();trayMenu();publish();}
function verify(event:IpcMainInvokeEvent){if(!window||event.sender!==window.webContents||event.senderFrame!==window.webContents.mainFrame||!trustedSender(event.senderFrame.url,renderer,devUrl))throw Error('untrusted-sender')}
function handlers(){ipcMain.handle('qg:state',e=>{verify(e);return state});ipcMain.handle('qg:refresh',async e=>{verify(e);await refresh()});ipcMain.handle('qg:settings',async(e,input)=>{verify(e);await changeSettings(input)});ipcMain.handle('qg:open',async(e,id)=>{verify(e);const url=providerUrl(id);if(!url)throw Error('invalid-provider');await shell.openExternal(url)});ipcMain.handle('qg:hide',e=>{verify(e);window?.hide()});ipcMain.handle('qg:quit',e=>{verify(e);app.quit()});}
if(ownsLock){app.whenReady().then(async()=>{
 settingsFile=path.join(app.getPath('userData'),'settings.json');const settings=await readSettings(settingsFile);settings.startAtLogin=false;
 detections=await discoverTools({home:os.homedir(),path:process.env.PATH??'',appData:app.getPath('appData'),localAppData:process.env.LOCALAPPDATA??app.getPath('appData')});
 state={settings,detections:detections.map(({executable,...d})=>({...d,executable:executable?'detected':undefined})),providers:[],refreshing:false,desktop:true};
 const area=settings.bounds?screen.getDisplayMatching(settings.bounds).workArea:screen.getPrimaryDisplay().workArea;const bounds=safeBounds(settings.bounds,area);
 window=new BrowserWindow({...bounds,title:'Quota Glass',frame:false,transparent:true,backgroundColor:'#00000000',resizable:false,maximizable:false,fullscreenable:false,show:false,hasShadow:true,alwaysOnTop:settings.alwaysOnTop,skipTaskbar:false,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'../preload/index.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,devTools:!app.isPackaged}});
 if(process.platform==='win32')try{window.setBackgroundMaterial('acrylic')}catch{}
 window.webContents.setWindowOpenHandler(()=>({action:'deny'}));window.webContents.on('will-navigate',e=>e.preventDefault());window.webContents.session.setPermissionRequestHandler((_web, _permission,callback)=>callback(false));
 window.on('close',e=>{if(!quitting){e.preventDefault();window?.hide()}});
 let moveTimer:ReturnType<typeof setTimeout>|undefined;window.on('moved',()=>{clearTimeout(moveTimer);moveTimer=setTimeout(()=>{if(window&&!window.isDestroyed()){state.settings.bounds=window.getBounds();void saveSettings(settingsFile,state.settings).catch(()=>{})}},300)});
 window.once('ready-to-show',()=>window?.show());
 tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'../assets/icon.png')).resize({width:20,height:20}));tray.on('click',toggle);tray.on('double-click',()=>window?.show());trayMenu();handlers();bindShortcut(settings.shortcut);
 if(devUrl)await window.loadURL(devUrl);else await window.loadFile(renderer);newPoller();publish();
}).catch(()=>{app.exit(1)});
 app.on('second-instance',()=>{window?.show();window?.focus()});app.on('activate',()=>window?.show());app.on('before-quit',()=>{quitting=true;poller?.stop();globalShortcut.unregisterAll();tray?.destroy()});app.on('window-all-closed',()=>{if(quitting)app.quit()});
}
