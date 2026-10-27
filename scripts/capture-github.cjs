// Public screenshots of the actual renderer. All accounts, connections and readings
// are deterministic demonstrations; this script never loads the native bridge.
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs/promises');const path=require('node:path');
const out='docs/screenshots',now=Date.UTC(2026,9,27,12,0);
const work='codex-profile-0000000000000001';
const team='codex-profile-0000000000000002';
function fixture(platform='win32'){
 const quota=(id,session,weekly)=>({id,providerId:'codex',auth:'connected',state:'ready',plan:'Plus',message:'providerData',observedAt:now,metrics:[
  {id:'session',label:'session',unit:'percent',remainingPercent:session,source:'provider',observedAt:now,resetAt:now+3*3600000},
  {id:'weekly',label:'weekly',unit:'percent',remainingPercent:weekly,source:'provider',observedAt:now,resetAt:now+3*86400000}
 ]});
 return {desktop:true,platform,taskbarBackend:platform==='darwin'?'tray':'embedded',taskbarStatus:'ready',startupAvailable:true,startupNeedsApproval:false,refreshing:false,
  settings:{autoUpdateCheck:true,taskbarMode:true,taskbarOnboarded:true,language:'en',opacity:100,summaryMode:false,pinned:['codex',work],consents:['codex',work,team,'claude','openrouter','poe','deepseek'],alwaysOnTop:false,startAtLogin:false,paused:false,pollSeconds:60,shortcut:'Control+Alt+Q',compact:false,alertThresholds:[20,5]},
  appUpdate:{active:true,automaticChecks:true,phase:'current',notice:false,mode:platform==='darwin'?'manual':'automatic',...(platform==='darwin'?{reason:'mac-signing'}:{}),lastChecked:now},
  directLoginProviders:['codex'],configuredApiProviders:['openrouter','poe','deepseek'],loginErrors:{},loginProfileIds:[],
  detections:['codex','claude'].map(id=>({id,installed:true,configPresent:true,executable:'detected',evidence:[]})),
  profiles:[{id:'codex',providerId:'codex',label:'Personal',connectionMethod:'browser'},{id:work,providerId:'codex',label:'Work'},{id:team,providerId:'codex',label:'Team'},{id:'claude',providerId:'claude',label:'Demo workspace'}].map(p=>({...p,source:'manual',configPresent:true,authFilePresent:true})),
  providers:[quota('codex',75,62),quota(work,48,37),{...quota(team,84,54),plan:'Team'},{id:'claude',providerId:'claude',auth:'connected',state:'unavailable',plan:'Pro',message:'claudeQuotaUnavailable',observedAt:now,metrics:[]},
   {id:'openrouter',auth:'connected',state:'ready',message:'keyBudgetInfo',observedAt:now,metrics:[{id:'budget',label:'keyBudgetRemaining',remaining:74.5,remainingPercent:75,unit:'currency',currency:'USD',source:'provider',observedAt:now},{id:'cost',label:'monthlyApiSpend',used:25.5,unit:'currency',currency:'USD',source:'provider',observedAt:now}]},
   {id:'poe',auth:'connected',state:'ready',message:'apiBalanceInfo',observedAt:now,metrics:[{id:'points',label:'pointsRemaining',remaining:1500,unit:'points',source:'provider',observedAt:now}]},
   {id:'deepseek',auth:'connected',state:'ready',message:'apiBalanceInfo',observedAt:now,metrics:[{id:'balance',label:'apiBalance',remaining:17.5,unit:'currency',currency:'CNY',source:'provider',observedAt:now}]}]
 };
}
async function open(context,url,state,viewport={width:430,height:704}){
 const page=await context.newPage();await page.setViewportSize(viewport);
 // Any future accidental network call from a screenshot fixture must fail closed.
 await page.route('**/*',route=>new URL(route.request().url()).origin===url?route.continue():route.abort());
 await page.clock.install({time:new Date(now)});
 await page.addInitScript(initial=>{
  let state=initial;const listeners=new Set();const publish=()=>listeners.forEach(l=>l(state));
  const patch=p=>{state={...state,settings:{...state.settings,...p}};publish()};
  const unavailable=async()=>{throw Error('Demonstration only')};
  window.quota={getState:async()=>state,subscribe:l=>{listeners.add(l);return()=>listeners.delete(l)},updateSettings:async p=>patch(p),refresh:async()=>{},
   setTaskbarMode:async enabled=>{state={...state,taskbarStatus:enabled?'ready':'off'};patch({taskbarMode:enabled,taskbarOnboarded:true})},
   setConsent:async(id,allowed)=>patch({consents:allowed?[...new Set([...state.settings.consents,id])]:state.settings.consents.filter(x=>x!==id)}),
   loginDirect:unavailable,login:unavailable,addAccount:unavailable,importProfile:unavailable,locateExecutable:unavailable,openInstall:unavailable,
   openApiKeys:unavailable,saveApiKey:unavailable,removeApiKey:unavailable,getDiagnostics:unavailable,copyDiagnostics:unavailable,checkForUpdates:async()=>{},requestUpdate:unavailable,requestClose:async()=>{},openProvider:async()=>{},hide:async()=>{},quit:async()=>{}};
 },state);
 await page.goto(url);await expect(page.locator('.shell')).toBeVisible();await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()))});return page;
}
async function shot(page,name){await page.screenshot({path:path.join(out,name),omitBackground:true,animations:'disabled'});await page.close()}
(async()=>{
 const {createServer}=await import('vite');const server=await createServer({server:{host:'127.0.0.1',port:0}});let browser;
 try{
  await server.listen();const url='http://127.0.0.1:'+server.httpServer.address().port;browser=await chromium.launch({channel:'msedge'});
  const context=await browser.newContext({deviceScaleFactor:2,locale:'en-US',timezoneId:'UTC',reducedMotion:'reduce'});await fs.mkdir(out,{recursive:true});
  let page=await open(context,url,fixture());await expect(page.getByRole('button',{name:'Minimize to taskbar',exact:true})).toBeEnabled();await shot(page,'widget.png');
  let state=fixture();state.settings.summaryMode=true;state.settings.pinned=['codex',work,team];page=await open(context,url,state,{width:380,height:340});await shot(page,'widget-windows.png');
  state=fixture();state.settings.pinned=['openrouter','poe','deepseek'];page=await open(context,url,state);await shot(page,'api-details-synthetic.png');
  state.settings.summaryMode=true;page=await open(context,url,state,{width:380,height:340});await shot(page,'api-widget-synthetic.png');
  for(const platform of ['win32','darwin']){
   page=await open(context,url,fixture(platform));await page.getByRole('button',{name:'Settings',exact:true}).click();
   await expect(page.getByRole('switch',{name:platform==='darwin'?'Show quotas in the menu bar':'Show quotas in the taskbar',exact:true})).toBeChecked();
   await expect(page.getByRole('switch',{name:platform==='darwin'?'Open at login':'Start with Windows',exact:true})).not.toBeChecked();
   await shot(page,platform==='darwin'?'settings-macos.png':'settings.png');
  }
  page=await open(context,url,fixture());await page.getByRole('navigation').getByRole('button',{name:'Connections',exact:true}).click();await page.getByRole('searchbox').fill('Claude');await page.getByRole('searchbox').blur();
  await expect(page.locator('.profile-state')).toContainText('Connected');await expect(page.locator('.profile-state')).toContainText('Pro');await shot(page,'connections.png');
  state=fixture('darwin');state.settings.pinned=['codex',work];state.settings.compact=true;
  for(const id of state.settings.pinned){const provider=state.providers.find(p=>p.id===id);provider.metrics=provider.metrics.slice(0,1);delete provider.metrics[0].resetAt}
  state.providers.find(p=>p.id===work).state='stale';state.providers.find(p=>p.id===work).metrics.forEach(m=>m.observedAt=now-600000);
  page=await open(context,url,state);await shot(page,'profile-status-synthetic.png');
  page=await open(context,url,fixture('darwin'));await page.getByRole('button',{name:'Quick actions',exact:true}).click();await page.getByRole('combobox').fill('codex');await shot(page,'quick-actions-synthetic.png');
  page=await open(context,url,fixture());await page.getByRole('button',{name:'Settings',exact:true}).click();await page.locator('.scroll-area').evaluate(el=>{el.scrollTop=el.scrollHeight});await expect(page.locator('.update-settings')).toContainText('Cypher is up to date');await expect(page.locator('.topbar')).toBeInViewport();await shot(page,'updates.png');
  state=fixture();state.settings.language='fr';page=await open(context,url,state);await page.getByRole('button',{name:'Réglages',exact:true}).click();await shot(page,'settings-fr.png');
  state.settings.summaryMode=true;state.settings.pinned=['codex',work,team];page=await open(context,url,state,{width:380,height:340});await shot(page,'widget-fr.png');
  await context.close();console.log('Captured twelve 2x screenshots of the actual renderer. Demonstration accounts/readings only; all external requests blocked.');
 }finally{if(browser)await browser.close();await server.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
