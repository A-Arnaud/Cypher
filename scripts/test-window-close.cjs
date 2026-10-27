// Native Electron/IPC lifecycle check with scripted native-dialog answers.
// Windows uses the notification-area backend; this never manipulates Explorer.
const {_electron:electron,expect}=require('@playwright/test');const fs=require('node:fs/promises');const os=require('node:os');const path=require('node:path');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-close-'));let app,closed=false;
 try{
  const bootstrap=path.join(root,'bootstrap.cjs');
  await fs.writeFile(bootstrap,`const electron=require('electron');electron.app.setPath('appData',${JSON.stringify(root)});if(process.platform==='win32')require('node:os').release=()=> '10.0.26100';globalThis.closeAnswers=[];globalThis.closeOptions=[];electron.dialog.showMessageBox=async(_window,options)=>{globalThis.closeOptions.push(options);return {response:globalThis.closeAnswers.length?globalThis.closeAnswers.shift():2,checkboxChecked:false}};require(${JSON.stringify(path.resolve('dist/main/index.cjs'))});`);
  const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root,USERPROFILE:root,APPDATA:root,LOCALAPPDATA:root,PATH:process.platform==='win32'?path.join(process.env.SystemRoot,'System32'):'/usr/bin:/bin'};
  for(const key of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','QG_DATA_DIR','QG_DEV_URL','PORTABLE_EXECUTABLE_FILE'])delete env[key];
  app=await electron.launch({args:[bootstrap],env,timeout:60000});const page=await app.firstWindow();await page.waitForFunction(()=>!!window.quota);
  await app.evaluate(({BrowserWindow})=>{BrowserWindow.getAllWindows()[0].show();BrowserWindow.getAllWindows()[0].focus()});
  if(process.platform==='darwin')await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isFocused()),{timeout:15000}).toBe(true);
  await page.getByRole('button',{name:'Close window',exact:true}).click();
  await expect.poll(()=>app.evaluate(()=>globalThis.closeOptions.length)).toBe(1);
  expect(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(true);
  const first=await app.evaluate(()=>globalThis.closeOptions[0]);expect(first.cancelId).toBe(2);expect(first.defaultId).toBe(0);expect(first.buttons[1]).toBe('Quit Cypher');expect(first.buttons[2]).toBe('Cancel');expect(first.detail).toContain(process.platform==='darwin'?'top right':'clock');
  await app.evaluate(()=>globalThis.closeAnswers.push(0));await page.getByRole('button',{name:'Close window',exact:true}).click();
  await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(false);
  const state=await page.evaluate(()=>window.quota.getState());expect(state.taskbarStatus).toBe('ready');expect(state.settings.taskbarMode).toBe(true);
  await app.evaluate(({BrowserWindow})=>{BrowserWindow.getAllWindows()[0].show();BrowserWindow.getAllWindows()[0].focus()});
  await page.evaluate(()=>window.quota.updateSettings({language:'fr'}));
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].close());
  await expect.poll(()=>app.evaluate(()=>globalThis.closeOptions.length)).toBe(3);
  expect(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(true);
  const french=await app.evaluate(()=>globalThis.closeOptions[2]);expect(french.buttons[1]).toBe('Quitter Cypher');expect(french.buttons[2]).toBe('Annuler');
  await app.evaluate(()=>globalThis.closeAnswers.push(1));const exit=app.waitForEvent('close',{timeout:15000});
  // Windows can terminate Electron before Playwright acknowledges the successful click.
  // Only accept the expected closed-target race, and still require the real exit event.
  const quitClick=page.getByRole('button',{name:'Fermer la fenêtre',exact:true}).click().catch(error=>{if(!error.message.includes('Target page, context or browser has been closed'))throw error});
  await Promise.all([quitClick,exit]);closed=true;
  console.log('Native close choices passed: cancel stays visible, keep enables the bar before hiding, native window close asks too, explicit quit exits. EN/FR dialog options checked.');
 }finally{if(app&&!closed)await app.close();await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:100})}
})().catch(error=>{console.error(error.message);process.exitCode=1});
