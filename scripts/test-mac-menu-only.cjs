// Native Mac agent behavior: real windows, Dock state and actual tray menu callbacks.
const {_electron:electron,expect}=require('@playwright/test');const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
(async()=>{if(process.platform!=='darwin')throw Error('macOS runner required');const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-menu-only-'));let app,closed=false;try{
 const bootstrap=path.join(root,'bootstrap.cjs');await fs.writeFile(bootstrap,`const electron=require('electron');electron.app.setPath('appData',${JSON.stringify(root)});const menu=electron.Tray.prototype.setContextMenu;electron.Tray.prototype.setContextMenu=function(value){globalThis.cypherMenu=value;return menu.call(this,value)};electron.dialog.showMessageBox=async()=>({response:2,checkboxChecked:false});require(${JSON.stringify(path.resolve('dist/main/index.cjs'))});`);
 const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root,PATH:'/usr/bin:/bin'};for(const key of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','QG_DATA_DIR','QG_DEV_URL'])delete env[key];app=await electron.launch({args:[bootstrap],env,timeout:60000});const page=await app.firstWindow();await page.waitForFunction(()=>!!window.quota);
 const noDock=async()=>{await expect.poll(()=>app.evaluate(({app})=>app.dock.isVisible())).toBe(false)};
 const visible=async value=>{await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(value);await noDock()};
 const menuClick=label=>app.evaluate((_electron,label)=>{const item=globalThis.cypherMenu.items.find(item=>item.label===label);if(!item)throw Error('Missing native menu action: '+label);item.click()},label);
 await visible(true);await expect.poll(()=>app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isFocused()),{timeout:15000}).toBe(true);
 await page.getByRole('button',{name:'Move to menu bar',exact:true}).click();await visible(false);
 await menuClick('Show / Hide');await visible(true);
 await page.getByRole('button',{name:'Settings',exact:true}).click();const input=page.getByLabel('Show / hide shortcut', {exact:true});await input.fill('Control+Alt+Shift+8');await expect(input).toHaveValue('Control+Alt+Shift+8');await noDock();
 await menuClick('Pause');await expect.poll(async()=>(await page.evaluate(()=>window.quota.getState())).settings.paused).toBe(true);await menuClick('Resume');await noDock();
 await page.getByRole('button',{name:'Close window',exact:true}).click();await visible(true);
 await page.getByRole('button',{name:'Minimize to menu bar',exact:true}).click();await visible(false);
 await app.evaluate(({app})=>app.emit('second-instance',{},[],''));await visible(true);
 const exit=app.waitForEvent('close',{timeout:15000});await Promise.all([exit,menuClick('Quit').catch(error=>{if(!error.message.includes('Target page, context or browser has been closed'))throw error})]);closed=true;
 console.log('Mac menu-only checks passed: no Dock entry while open/hidden/reopened, native menu restores the window, settings accept input, pause/resume and explicit quit work.');
}finally{if(app&&!closed)await app.close();await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:100})}})().catch(error=>{console.error(error.message);process.exitCode=1});
