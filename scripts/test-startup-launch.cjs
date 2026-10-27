// Actual Electron window/IPC lifecycle with empty profiles. No OS startup entry is written.
const {_electron:electron,expect}=require('@playwright/test');const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
(async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-login-'));try{
 for(const automatic of [false,true])for(const preference of ['fresh','legacy','enabled','disabled']){
  const savedBar=preference!=='disabled';const dir=path.join(root,automatic+'-'+preference);await fs.mkdir(dir);
  if(preference!=='fresh')await fs.writeFile(path.join(dir,'settings.json'),JSON.stringify({taskbarMode:preference==='enabled',taskbarOnboarded:preference!=='legacy',summaryMode:false,startAtLogin:false}));
  const bootstrap=path.join(dir,'bootstrap.cjs');
  await fs.writeFile(bootstrap,`const electron=require('electron');electron.app.setPath('appData',${JSON.stringify(dir)});if(process.platform==='win32')require('node:os').release=()=> '10.0.26100';globalThis.windowShows=0;const show=electron.BrowserWindow.prototype.show;electron.BrowserWindow.prototype.show=function(...args){globalThis.windowShows++;return show.apply(this,args)};if(process.platform==='darwin'){const read=electron.app.getLoginItemSettings.bind(electron.app);electron.app.getLoginItemSettings=(...args)=>({...read(...args),wasOpenedAtLogin:${automatic}})};electron.app.setLoginItemSettings=()=>{throw Error('Startup registration forbidden in launch test')};require(${JSON.stringify(path.resolve('dist/main/index.cjs'))});`);
  const env={...process.env,CYPHER_DATA_DIR:dir,HOME:dir,USERPROFILE:dir,APPDATA:dir,LOCALAPPDATA:dir,PATH:process.platform==='win32'?path.join(process.env.SystemRoot,'System32'):'/usr/bin:/bin'};for(const key of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','QG_DATA_DIR','QG_DEV_URL','PORTABLE_EXECUTABLE_FILE'])delete env[key];
  const app=await electron.launch({args:[bootstrap,...(automatic&&process.platform!=='darwin'?['--cypher-startup']:[])],env,timeout:60000});try{
   const page=await app.firstWindow();await page.waitForFunction(()=>!!window.quota);await expect.poll(async()=>{const state=await page.evaluate(()=>window.quota.getState());return state.taskbarStatus}).toBe(savedBar?'ready':'off');
   await page.locator('.shell:not(.loading)').waitFor({state:'attached'});await page.waitForTimeout(300);await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(!automatic);expect(await app.evaluate(()=>globalThis.windowShows)).toBe(automatic?0:1);
   const state=await page.evaluate(()=>window.quota.getState());expect(state.settings.startAtLogin).toBe(false);expect(state.settings.taskbarMode).toBe(savedBar);
   if(process.platform==='darwin')expect(await app.evaluate(({app})=>app.dock.isVisible())).toBe(false);
   if(automatic){await app.evaluate(({app})=>app.emit('second-instance',{},[],''));await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(true)}
   if(preference==='fresh'){
    // The real Settings control removes and restores the indicator without hiding its window.
    await page.getByRole('button',{name:'Settings',exact:true}).click();const control=page.getByRole('switch',{name:process.platform==='darwin'?'Show quotas in the menu bar':'Show quotas near the clock',exact:true});
    await control.click();await expect.poll(async()=>(await page.evaluate(()=>window.quota.getState())).taskbarStatus).toBe('off');
    const saved=JSON.parse(await fs.readFile(path.join(dir,'settings.json'),'utf8'));expect(saved.taskbarMode).toBe(false);expect(saved.taskbarOnboarded).toBe(true);
    await control.click();await expect.poll(async()=>(await page.evaluate(()=>window.quota.getState())).taskbarStatus).toBe('ready');await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(true);
    await expect(page.evaluate(()=>window.quota.setTaskbarMode(true,'invalid'))).rejects.toThrow();
    await expect(page.evaluate(()=>window.quota.updateSettings({taskbarMode:false}))).rejects.toThrow();
   }
   if(process.platform==='darwin')expect(await app.evaluate(({app})=>app.dock.isVisible())).toBe(false);
  }catch(error){error.message=`Launch ${automatic?'login':'manual'}/${preference}: `+error.message;throw error}finally{await app.close()}
 }
 console.log('Launch checks passed: fresh and legacy indicators appear automatically, explicit opt-out survives manual/login launch, login has no window flash, Settings toggles keep the window visible, invalid IPC rejected, explicit reopen works, no startup registration side effects.');
}finally{await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:100})}})().catch(error=>{console.error(error.message);process.exitCode=1});
