import {test,expect} from '@playwright/test';
test('shows useful content directly without slogans or their empty hero blocks in either language',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.brand')).toContainText('Cypher');
 await expect(page.locator('.hero')).toHaveCount(0);
 await expect(page.locator('.brand small')).toHaveCount(0);
 await expect(page.getByText('PERSONAL AI MONITOR',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Vos IA, en un regard.',{exact:true})).toHaveCount(0);
 await expect(page.getByText('Moins de limites surprises. Plus de clarté.',{exact:true})).toHaveCount(0);
 await expect(page.locator('.provider-card')).toHaveCount(3);
 const first=await page.locator('.provider-card').first().boundingBox();expect(first!.y).toBeLessThan(280);
 await page.getByRole('navigation').getByRole('button',{name:'Réglages',exact:true}).click();
 await expect(page.locator('.hero')).toHaveCount(0);await expect(page.getByLabel('Opacité',{exact:true})).toBeVisible();await expect(page.locator('.about')).toHaveCount(0);
 await page.getByLabel('Langue').selectOption('en');await expect(page.getByText('Make it yours.',{exact:true})).toHaveCount(0);
 await page.getByRole('navigation').getByRole('button',{name:'Connections',exact:true}).click();await expect(page.getByPlaceholder('Search a service…')).toBeVisible();await expect(page.locator('.hero')).toHaveCount(0);
 await page.getByRole('navigation').getByRole('button',{name:'Overview',exact:true}).click();await expect(page.locator('.provider-card')).toHaveCount(3);await expect(page.getByText('Your AI, at a glance.',{exact:true})).toHaveCount(0);await expect(page.getByText('Fewer surprise limits. More clarity.',{exact:true})).toHaveCount(0);
});
