import {test,expect} from '@playwright/test';
import {advancedOptions} from './ui-helpers';
import {defaultSettings} from '../src/shared/defaults';

test('failed initial loading can be retried without restarting the app',async({page})=>{
 await page.addInitScript(settings=>{
  let available=false;
  window.quota={getState:async()=>{if(!available)throw Error('unavailable');return {settings,detections:[],providers:[],refreshing:false,desktop:false}},subscribe:()=>()=>{},refresh:async()=>{available=true},updateSettings:async()=>{},hide:async()=>{},quit:async()=>{},openProvider:async()=>{}};
 },{...defaultSettings(),language:'fr' as const});
 await page.goto('/');
 await expect(page.getByRole('alert')).toHaveText('Could not load Cypher. Try again.');
 await expect(page.locator('.spin')).toHaveCount(0);
 await page.evaluate(()=>window.quota!.refresh());
 await page.getByRole('button',{name:'Try again',exact:true}).click();
 await expect(page.getByRole('navigation')).toBeVisible();
 await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a late initial response cannot overwrite a newer subscription update',async({page})=>{
 await page.addInitScript(settings=>{
  const stale={settings,detections:[],providers:[],refreshing:false,desktop:false};
  window.quota={getState:async()=>new Promise(resolve=>setTimeout(()=>resolve(stale),200)),subscribe:listener=>{const timer=setTimeout(()=>listener({...stale,settings:{...settings,language:'en'}}),10);return()=>clearTimeout(timer)},refresh:async()=>{},updateSettings:async()=>{},hide:async()=>{},quit:async()=>{},openProvider:async()=>{}};
 },{...defaultSettings(),language:'fr' as const});
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Settings',exact:true})).toBeVisible();
 await page.evaluate(()=>window.quota!.getState());
 await expect(page.getByRole('button',{name:'Settings',exact:true})).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('lang','en');
});

test('balances, points, quota windows and last observation remain accurate in both views',async({page})=>{
 await page.addInitScript(settings=>{
  let state:any={settings:{...settings,pinned:['poe','deepseek','codex']},detections:[],providers:[
   {id:'poe',state:'ready',auth:'connected',message:'apiBalanceInfo',observedAt:1000,metrics:[{id:'points',label:'pointsRemaining',remaining:1500,unit:'points',source:'provider',observedAt:1000}]},
   {id:'deepseek',state:'ready',auth:'connected',message:'apiBalanceInfo',observedAt:1000,metrics:[{id:'usd',label:'apiBalance',remaining:24.5,unit:'currency',currency:'USD',source:'provider',observedAt:1000},{id:'cny',label:'apiBalance',remaining:0,unit:'currency',currency:'CNY',source:'provider',observedAt:1000}]},
   {id:'codex',state:'stale',auth:'connected',message:'quotaReadFailed',observedAt:1000,metrics:[{id:'short',label:'30m',remainingPercent:60,unit:'percent',source:'provider',observedAt:1000},{id:'long',label:'10080m',remainingPercent:20,unit:'percent',source:'provider',observedAt:1000}]},
   {id:'planned',state:'planned',auth:'unknown',message:'planned',observedAt:Date.now(),metrics:[]}
  ],refreshing:false,desktop:true};
  const listeners=new Set<(s:any)=>void>();const publish=()=>listeners.forEach(l=>l(state));
  window.quota={getState:async()=>state,subscribe:l=>{listeners.add(l);return()=>{listeners.delete(l)}},updateSettings:async patch=>{state={...state,settings:{...state.settings,...patch}};publish()},refresh:async()=>{},hide:async()=>{},quit:async()=>{},openProvider:async()=>{}};
 },{...defaultSettings(),language:'en'});
 await page.goto('/');
 await expect(page.locator('#profile-card-poe .metric-line')).toContainText('1,500');
 await expect(page.locator('#profile-card-deepseek .metric-line').first()).toContainText('$24.50');
 await expect(page.locator('#profile-card-deepseek .metric-line').last()).toContainText('CN¥0.00');
 await expect(page.locator('#profile-card-codex .metric-line').first()).toContainText('30 min');
 await expect(page.locator('#profile-card-codex .metric-line').last()).toContainText('7 days');
 const expectedTime=await page.evaluate(()=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(1000));
 await expect(page.locator('footer')).toContainText(expectedTime);
 await page.getByRole('button',{name:'Compact view',exact:true}).click();
 const codex=page.locator('.summary-row[data-profile-id="codex"]');
 await expect(codex).toContainText('30 min');await expect(codex).toContainText('7 days');
 await expect(codex.locator('.stale')).toHaveCount(2);
 await page.getByRole('button',{name:'Details',exact:true}).click();
 await page.getByRole('navigation').getByRole('button',{name:'Accounts',exact:true}).click();
 await page.getByRole('button',{name:'More services',exact:true}).click();await page.getByRole('searchbox').fill('  DEEPSEEK  ');
 await expect(page.locator('.other-service-list button')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'DeepSeek API',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'DeepSeek Chat Planned',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation').getByRole('button',{name:'Accounts',exact:true})).toHaveAttribute('aria-current','page');
});

test('shortcut editor prevents duplicate modifiers and submits valid changes with Enter',async({page})=>{
 await page.addInitScript(settings=>{
  let state:any={settings,detections:[],providers:[],refreshing:false,desktop:true};const listeners=new Set<(s:any)=>void>();
  window.quota={getState:async()=>state,subscribe:l=>{listeners.add(l);return()=>{listeners.delete(l)}},updateSettings:async patch=>{state={...state,settings:{...state.settings,...patch}};listeners.forEach(l=>l(state))},refresh:async()=>{},hide:async()=>{},quit:async()=>{},openProvider:async()=>{}};
 },{...defaultSettings(),language:'fr' as const});
 await page.goto('/');await page.getByRole('button',{name:'Réglages',exact:true}).click();
 await advancedOptions(page);const editor=page.getByLabel('Raccourci afficher / masquer');const save=page.getByRole('button',{name:'Enregistrer',exact:true});
 await expect(save).toBeDisabled();await editor.fill('Ctrl+Control+Q');await expect(editor).toHaveAttribute('aria-invalid','true');await expect(save).toBeDisabled();
 await editor.fill('Control+Alt+W');await expect(editor).toHaveAttribute('aria-invalid','false');await expect(save).toBeEnabled();await editor.press('Enter');await expect(save).toBeDisabled();
 await expect.poll(()=>page.evaluate(async()=>(await window.quota!.getState()).settings.shortcut)).toBe('Control+Alt+W');
});
