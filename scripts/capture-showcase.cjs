// Account-free, English documentation fixtures. No native bridge or credentials.
const {chromium}=require('playwright');const fs=require('node:fs/promises');
(async()=>{const {createServer}=await import('vite');const server=await createServer({server:{host:'127.0.0.1',port:0}});let browser;
try{await server.listen();browser=await chromium.launch({channel:'msedge'});const page=await browser.newPage({viewport:{width:430,height:704}});
 await page.addInitScript(()=>{
  const now=Date.UTC(2026,9,25,12,0);let state={settings:{taskbarMode:false,taskbarOnboarded:false,language:'en',opacity:100,summaryMode:false,pinned:['openrouter','poe','deepseek'],consents:[],alwaysOnTop:false,startAtLogin:false,paused:false,pollSeconds:60,shortcut:'Control+Alt+Q',compact:false,alertThresholds:[20,5]},detections:[],providers:[
   {id:'openrouter',state:'ready',auth:'connected',message:'keyBudgetInfo',observedAt:now,metrics:[{id:'budget',label:'keyBudgetRemaining',remaining:74.5,remainingPercent:75,unit:'currency',currency:'USD',source:'provider',observedAt:now},{id:'cost',label:'monthlyApiSpend',used:25.5,unit:'currency',currency:'USD',source:'provider',observedAt:now}]},
   {id:'poe',state:'ready',auth:'connected',message:'apiBalanceInfo',observedAt:now,metrics:[{id:'points',label:'pointsRemaining',remaining:1500,unit:'points',source:'provider',observedAt:now}]},
   {id:'deepseek',state:'ready',auth:'connected',message:'apiBalanceInfo',observedAt:now,metrics:[{id:'balance',label:'apiBalance',remaining:17.5,unit:'currency',currency:'CNY',source:'provider',observedAt:now}]}
  ],refreshing:false,desktop:true,platform:'win32',taskbarBackend:'tray',taskbarStatus:'off'};const listeners=new Set();
  window.quota={getState:async()=>state,refresh:async()=>{},updateSettings:async patch=>{state={...state,settings:{...state.settings,...patch}};for(const l of listeners)l(state)},setTaskbarMode:async()=>{},requestClose:async()=>{},openProvider:async()=>{},hide:async()=>{},quit:async()=>{},subscribe:l=>{listeners.add(l);return()=>listeners.delete(l)}};
 });
 await page.clock.install({time:new Date(Date.UTC(2026,9,25,12,0))});
 await page.goto('http://127.0.0.1:'+server.httpServer.address().port);await page.locator('.cards').waitFor();await fs.mkdir('docs/screenshots',{recursive:true});
 await page.screenshot({path:'docs/screenshots/api-details-synthetic.png',omitBackground:true});
 await page.getByRole('button',{name:'Back to widget',exact:true}).click();await page.locator('.summary-row').first().waitFor();await page.setViewportSize({width:430,height:354});await page.screenshot({path:'docs/screenshots/api-widget-synthetic.png',omitBackground:true});
 console.log('English synthetic showcase captured; no account data was accessed.');
}finally{if(browser)await browser.close();await server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
