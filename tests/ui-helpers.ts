import type {Page} from '@playwright/test';
export async function chooseService(page:Page,name:string,language:'fr'|'en'='en'){
 await page.getByRole('navigation').getByRole('button',{name:language==='fr'?'Comptes':'Accounts',exact:true}).click();
 const common=page.locator('.service-choice').filter({hasText:name});
 if(await common.count()){await common.click();return}
 const search=page.getByRole('searchbox');if(!await search.isVisible())await page.getByRole('button',{name:language==='fr'?'Autres services':'More services',exact:true}).click();
 await search.fill(name);await page.locator('.other-service-list').getByRole('button',{name,exact:true}).click();
}
export async function advancedOptions(page:Page){const details=page.locator('.advanced-settings');if(await details.getAttribute('open')===null)await details.locator(':scope > summary').click()}
