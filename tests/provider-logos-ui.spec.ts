import {test,expect} from '@playwright/test';
test('uses loaded provider logos rather than letters in details, connections and summary',async({page})=>{
 await page.goto('/');
 const detailed=page.locator('.provider-logo .provider-image');await expect(detailed).toHaveCount(3);
 for(const id of ['codex','claude','gemini'])await expect(page.locator('.provider-card .provider-image[data-provider="'+id+'"]')).toHaveCount(1);
 expect(await page.locator('.provider-logo').allTextContents()).toEqual(['','','']);
 await expect.poll(()=>detailed.evaluateAll(es=>es.every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0))).toBe(true);
 await page.getByRole('navigation').getByRole('button',{name:'Connexions',exact:true}).click();
 const connections=page.locator('.connection .provider-image');expect(await connections.count()).toBe(await page.locator('.connection').count());
 await expect.poll(()=>connections.evaluateAll(es=>es.every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0))).toBe(true);
 expect(await connections.evaluateAll(es=>es.filter(e=>(e as HTMLImageElement).src.includes('service.svg')).map(e=>e.getAttribute('data-provider')))).toEqual([]);
 await expect(page.locator('.connection .provider-logo').filter({hasText:/^[A-Za-z]{1,2}$/})).toHaveCount(0);
 await page.getByRole('button',{name:'Retour au widget',exact:true}).click();await expect(page.locator('.summary-logo .provider-image')).toHaveCount(3);expect(await page.locator('.summary-logo').allTextContents()).toEqual(['','','']);
});
