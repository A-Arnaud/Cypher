import {test,expect} from '@playwright/test';
test('quota updates preserve keyboard focus and the card instead of remounting it',async({page})=>{
 await page.addInitScript(()=>{
  let state:any={desktop:true,startupAvailable:true,settings:{language:'fr',summaryMode:false,pinned:['codex'],consents:['codex'],opacity:100,alwaysOnTop:false,compact:false,pollSeconds:60,startAtLogin:true,paused:false,shortcut:'Control+Alt+Q',alertThresholds:[20,5]},detections:[{id:'codex',installed:true}],providers:[{id:'codex',auth:'connected',state:'ready',message:'providerData',observedAt:1,metrics:[{id:'session',label:'session',remainingPercent:60,unit:'percent',source:'provider',observedAt:1}]}],refreshing:false};
  const listeners=new Set<(s:any)=>void>();
  window.quota={getState:async()=>state,subscribe:l=>{listeners.add(l);return()=>{listeners.delete(l)}},refresh:async()=>{state={...state,providers:state.providers.map((s:any)=>({...s,observedAt:2,metrics:s.metrics.map((m:any)=>({...m,remainingPercent:55}))}))};listeners.forEach(l=>l(state))},updateSettings:async patch=>{state={...state,settings:{...state.settings,...patch}};listeners.forEach(l=>l(state))},openProvider:async()=>{},hide:async()=>{},quit:async()=>{}};
 });
 await page.goto('/');const link=page.locator('.reading-details summary');await link.focus();
 await page.evaluate(()=>window.quota!.refresh());await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','55');await expect(link).toBeFocused();
 await page.getByRole('navigation').getByRole('button',{name:'Réglages',exact:true}).click();
 const startup=page.getByRole('switch',{name:'Démarrer avec Windows'});await expect(startup).toBeEnabled();await expect(startup).toBeChecked();await startup.uncheck();await expect(startup).not.toBeChecked();await startup.check();await expect(startup).toBeChecked();
});
