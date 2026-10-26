// Account-free Electron smoke test on a real macOS runner, using isolated state.
const { _electron: electron, expect }=require('@playwright/test');
const fs=require('node:fs/promises');const os=require('node:os');const path=require('node:path');
(async()=>{
 if(process.platform!=='darwin')throw Error('macOS runner required');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-smoke-'));let app;
 try{
  const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root};delete env.ELECTRON_RUN_AS_NODE;
  app=await electron.launch({args:['.'],env,timeout:60000});const page=await app.firstWindow();
  await page.waitForFunction(()=>!!window.quota);const state=await page.evaluate(()=>window.quota.getState());
  expect(state.platform).toBe('darwin');expect(state.taskbarBackend).toBe('tray');
  await expect(page.getByRole('button',{name:'Show quotas in menu bar',exact:true})).toBeVisible();
  await page.evaluate(()=>window.quota.setTaskbarMode(true));
  expect((await page.evaluate(()=>window.quota.getState())).taskbarStatus).toBe('ready');
  expect(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].isVisible())).toBe(false);
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].show());
  await page.evaluate(()=>window.quota.setTaskbarMode(false));
  expect((await page.evaluate(()=>window.quota.getState())).taskbarStatus).toBe('off');
  await page.evaluate(()=>window.quota.updateSettings({language:'fr'}));
  await expect(page.getByRole('button',{name:'Afficher les quotas dans la barre des menus',exact:true})).toBeVisible();
  console.log('macOS native Electron launch, IPC, menu bar docking, hide/restore and EN/FR smoke passed.');
 }finally{if(app)await app.close();await fs.rm(root,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
