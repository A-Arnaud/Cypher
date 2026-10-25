// Simulated first run: no user CLI, profiles, Node installation or saved consent.
// This is not a substitute for testing on a second physical Windows machine.
const {_electron:electron}=require('playwright');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'cypher-clean-machine-'));
 const home=path.join(root,'Utilisateur sans outils');
 const appData=path.join(home,'AppData','Roaming');
 const localAppData=path.join(home,'AppData','Local');
 await Promise.all([fs.mkdir(appData,{recursive:true}),fs.mkdir(localAppData,{recursive:true})]);
 const env={...process.env,USERPROFILE:home,HOME:home,APPDATA:appData,LOCALAPPDATA:localAppData,QG_DATA_DIR:path.join(root,'preferences'),PATH:path.join(process.env.SystemRoot,'System32')};
 for(const key of ['ELECTRON_RUN_AS_NODE','CODEX_HOME','CLAUDE_CONFIG_DIR','GEMINI_CLI_HOME','CYPHER_DATA_DIR','QG_DEV_URL','PORTABLE_EXECUTABLE_FILE'])delete env[key];
 const app=await electron.launch({executablePath:path.resolve(process.argv[2]??'.local-builds/electron-test/win-unpacked/Cypher.exe'),env,timeout:30000});
 try{
  const page=await app.firstWindow();
  await page.waitForFunction(async()=>window.quota&&!(await window.quota.getState()).refreshing);
  const state=await page.evaluate(()=>window.quota.getState());
  const isolation=await app.evaluate(({BrowserWindow})=>{const p=BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences();return {sandbox:p.sandbox,nodeIntegration:p.nodeIntegration,contextIsolation:p.contextIsolation,webviewTag:p.webviewTag}});
  assert.deepEqual(isolation,{sandbox:true,nodeIntegration:false,contextIsolation:true,webviewTag:false});
  let rendererRequests=0;const witness=require('node:http').createServer((_req,res)=>{rendererRequests++;res.writeHead(200,{'Access-Control-Allow-Origin':'*'});res.end('{}')});
  await new Promise(resolve=>witness.listen(0,'127.0.0.1',resolve));
  try{const target='http://127.0.0.1:'+witness.address().port+'/renderer-leak-test';assert.equal(await page.evaluate(async url=>{try{await fetch(url);return false}catch{return true}},target),true);assert.equal(await page.evaluate(url=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(false);img.onerror=()=>resolve(true);img.src=url}),target),true);assert.equal(rendererRequests,0)}finally{await new Promise(resolve=>witness.close(resolve))}
  assert.equal(await page.evaluate(()=>typeof window.require),'undefined');
  assert.equal(state.desktop,true);
  assert.equal(state.settings.consents.length,0);
  assert.equal(state.detections.some(d=>d.installed||d.configPresent),false);
  assert.equal(state.profiles.some(p=>p.configPresent||p.authFilePresent),false);
  assert.equal(state.providers.some(p=>p.metrics.length||p.auth==='connected'),false);
  await page.evaluate(()=>window.quota.updateSettings({shortcut:'Control+Alt+Shift+9'}));
  await page.getByRole('navigation').getByRole('button',{name:'Connexions',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Installer le CLI',exact:true}).count(),3);
  assert.equal(await page.getByRole('button',{name:'Se connecter',exact:true}).count(),0);
  const local=page.locator('.connection').filter({has:page.getByRole('heading',{name:'Ollama',exact:true})});
  assert.equal(await local.getByRole('button',{name:'Autoriser la lecture seule',exact:true}).count(),1);
  // Synthetic HTTP responses exercise real IPC, DPAPI and the packaged collectors.
  // No request leaves this process and no real API key is used.
  await app.evaluate(()=>{globalThis.fetch=async(url,options)=>{
   const address=String(url);if(options?.method!=='GET'||options?.redirect!=='error')throw Error('read-only required');
   const data=address.startsWith('https://api.poe.com/')?{current_point_balance:1500}:address.startsWith('https://api.deepseek.com/')?{balance_infos:[{currency:'CNY',total_balance:'17.50'}]}:address.startsWith('https://openrouter.ai/')?{data:{limit:100,limit_remaining:74.5,usage_monthly:25.5}}:address.startsWith('https://api.openai.com/')?{data:[{results:[{amount:{currency:'usd',value:1.23}}]}],has_more:false}:address.startsWith('https://api.anthropic.com/')?{data:[{results:[{currency:'USD',amount:'123.45'}]}],has_more:false}:address.startsWith('https://api.fal.ai/')?{credits:{current_balance:24.5,currency:'USD'}}:address.startsWith('https://api.together.ai/')?{currency:'USD',data:[{line_items:[{cost:'3.75'}]}],next_cursor:null}:null;
   if(!data)throw Error('unexpected URL');return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
  }});
  for(const id of ['poe','deepseek','openrouter','openai','anthropic','fal','together'])await page.evaluate(async id=>{await window.quota.saveApiKey(id,'synthetic-test-key-'+id)},id);
  const apiState=await page.evaluate(()=>window.quota.getState());
  for(const id of ['poe','deepseek','openrouter','openai','anthropic','fal','together'])assert.equal(apiState.providers.find(p=>p.id===id).state,'ready');
  const encrypted=await fs.readFile(path.join(root,'preferences','credentials.enc.json'),'utf8');assert(!encrypted.includes('synthetic-test-key'));
  assert(!JSON.stringify(apiState).includes('synthetic-test-key'));
  assert.equal(apiState.providers.find(p=>p.id==='poe').metrics[0].remaining,1500);
  await page.evaluate(()=>window.quota.updateSettings({pinned:['openrouter','poe','deepseek']}));
  await page.getByRole('navigation').getByRole('button',{name:'Vue d’ensemble',exact:true}).click();
  const amounts=(await page.locator('.metric-line strong').allTextContents()).join(' ').normalize('NFKC');
  for(const amount of ['74,50','25,50','1 500','17,50'])assert(amounts.includes(amount),'missing rendered amount '+amount);
  await page.screenshot({path:path.join(root,'api-details.png')});
  await page.getByRole('button',{name:'Retour au widget',exact:true}).click();
  await page.locator('.summary-row').first().waitFor();await page.screenshot({path:path.join(root,'api-widget.png')});
  await page.getByRole('button',{name:'Réglages',exact:true}).click();
  await page.locator('.settings-panel').waitFor();await page.screenshot({path:path.join(root,'api-settings.png')});
  // Replacing a key must never attribute the previous account's balance to it.
  await app.evaluate(()=>{const original=globalThis.fetch;globalThis.fetch=async(url,options)=>options?.headers?.Authorization==='Bearer synthetic-replacement-key'?new Response('{}',{status:429}):original(url,options)});
  await page.evaluate(()=>window.quota.saveApiKey('poe','synthetic-replacement-key'));
  const replacement=(await page.evaluate(()=>window.quota.getState())).providers.find(p=>p.id==='poe');
  assert.equal(replacement.state,'error');assert.equal(replacement.message,'apiRateLimited');assert.deepEqual(replacement.metrics,[]);
  await page.evaluate(()=>window.quota.updateSettings({shortcut:'Control+Alt+Shift+9'}));
  assert.equal(await app.evaluate(({globalShortcut})=>globalShortcut.register('Control+Alt+Shift+8',()=>{})),true);
  try{
   assert.equal(await page.evaluate(async()=>{try{await window.quota.updateSettings({shortcut:'Control+Alt+Shift+8'});return false}catch{return true}}),true);
   assert.equal((await page.evaluate(()=>window.quota.getState())).settings.shortcut,'Control+Alt+Shift+9');
   assert.equal(await app.evaluate(({globalShortcut})=>globalShortcut.isRegistered('Control+Alt+Shift+9')),true);
  }finally{await app.evaluate(({globalShortcut})=>globalShortcut.unregister('Control+Alt+Shift+8'))}
  for(const id of ['poe','deepseek','openrouter','openai','anthropic','fal','together'])await page.evaluate(async id=>{await window.quota.removeApiKey(id)},id);
  assert.deepEqual((await page.evaluate(()=>window.quota.getState())).configuredApiProviders,[]);
  assert.equal(await fs.readFile(path.join(root,'preferences','credentials.enc.json'),'utf8'),'{}');
  await page.screenshot({path:path.join(root,'first-run.png')});
  console.log(JSON.stringify({passed:true,root,checks:['separate packaged test build without Node or CLI on PATH','sandbox, context isolation, no Node or webview','renderer fetch and image exfiltration attempts reach no HTTP server','empty user profile with spaces','no inherited consent or account','installation links instead of broken login','local server access without CLI','seven API collectors via real IPC and synthetic HTTP responses','Windows DPAPI storage without plaintext keys or IPC leakage','replacing an API key clears the previous balance even when the new read fails','shortcut conflicts preserve the current binding and saved preference','disconnect removes saved keys']},null,2));
 }finally{await app.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
