// Real Electron/IPC with an empty profile. Clipboard writes are intercepted.
const {_electron:electron,expect}=require('@playwright/test');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
(async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-diagnostics-'));let app;
try{
 const bootstrap=path.join(root,'bootstrap.cjs');
 await fs.writeFile(bootstrap,`const electron=require('electron');electron.app.setPath('appData',${JSON.stringify(root)});if(process.platform==='win32')require('node:os').release=()=> '10.0.26100';globalThis.diagnosticWrites=[];electron.clipboard.writeText=text=>globalThis.diagnosticWrites.push(text);require(${JSON.stringify(path.resolve('dist/main/index.cjs'))});`);
 const env={...process.env,CYPHER_DATA_DIR:path.join(root,'state'),HOME:root,USERPROFILE:root,APPDATA:root,LOCALAPPDATA:root,PATH:process.platform==='win32'?path.join(process.env.SystemRoot,'System32'):'/usr/bin:/bin'};
 for(const key of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','QG_DATA_DIR','QG_DEV_URL','PORTABLE_EXECUTABLE_FILE'])delete env[key];
 app=await electron.launch({args:[bootstrap],env,timeout:60000});const page=await app.firstWindow();await page.waitForFunction(()=>!!window.quota);
 await app.evaluate(({BrowserWindow})=>{BrowserWindow.getAllWindows()[0].show();BrowserWindow.getAllWindows()[0].focus()});
 await page.getByRole('button',{name:'Quick actions',exact:true}).click();await page.getByRole('combobox').fill('diagnostics');await page.getByRole('combobox').press('Enter');
 expect(await app.evaluate(()=>globalThis.diagnosticWrites.length)).toBe(0);
 await page.getByRole('button',{name:'View report',exact:true}).click();await expect(page.locator('.diagnostic-report')).toContainText('cypher.diagnostics/v1');
 expect(await app.evaluate(()=>globalThis.diagnosticWrites.length)).toBe(0);
 await page.getByRole('button',{name:'Copy report',exact:true}).click();await expect.poll(()=>app.evaluate(()=>globalThis.diagnosticWrites.length)).toBe(1);
 const text=await app.evaluate(()=>globalThis.diagnosticWrites[0]);const report=JSON.parse(text);expect(report.schema).toBe('cypher.diagnostics/v1');expect(report.app.version).toBe(require('../package.json').version);expect(text).not.toContain(root);expect(report).not.toHaveProperty('settings');expect(report).not.toHaveProperty('detections');
 const rejection=await app.evaluate(async({BrowserWindow},{preload,renderer})=>{const extra=new BrowserWindow({show:false,webPreferences:{preload,contextIsolation:true,nodeIntegration:false,sandbox:true}});try{await extra.loadFile(renderer);return await extra.webContents.executeJavaScript(`window.quota.getDiagnostics().then(()=> 'unexpected-success',e=>e.message)`)}finally{extra.destroy()}},{preload:path.resolve('dist/preload/index.cjs'),renderer:path.resolve('dist/renderer/index.html')});expect(rejection).toContain('untrusted-sender');
 console.log('Native quick actions and diagnostic IPC passed: explicit reads/copy only, private paths excluded, other windows rejected, real clipboard untouched.');
}finally{if(app)await app.close();const target=path.resolve(root);if(path.dirname(target)!==path.resolve(os.tmpdir())||!path.basename(target).startsWith('cypher-diagnostics-'))throw Error('Unsafe cleanup');await fs.rm(target,{recursive:true,force:true,maxRetries:5,retryDelay:100})}
})().catch(error=>{console.error(error.message);process.exitCode=1});
