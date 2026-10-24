import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
const sizes=[[320,844],[360,800],[375,812],[390,844],[414,896],[430,932],[768,1024],[844,390],[1024,768],[1280,800]];
const ids=['diya','homes','blessings','sky','memories','letter','wishes','final'];
async function openBook(page:Page){await page.getByRole('button',{name:'Enter the celebration'}).click();await page.getByRole('button',{name:/Open .+Diwali album/}).click();await expect(page.locator('.book-leaf.active .scene-diya')).toBeVisible()}
for(const [width,height] of sizes){
test(`complete story without horizontal overflow at ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{name:/A little Diwali/})).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);
 await openBook(page);await page.getByRole('button',{name:'Light the diya',exact:true}).click();
 for(let i=0;i<8;i++){
  if(i){await page.getByRole('button',{name:'Next page',exact:true}).click();await expect(page.locator('.book-leaf.active .scene-'+ids[i])).toBeVisible()}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('.book-leaf.active .page-content').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 }
 await page.getByRole('button',{name:/Visit this Diwali again/}).click();await expect(page.getByRole('button',{name:'Enter the celebration'})).toBeVisible();expect(errors).toEqual([]);
});}
test('creator photo, caption, enlarged view and escape',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:/Make it yours/}).click();
 await page.getByLabel('Their name',{exact:true}).fill('Meera');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Your letter',{exact:true}).fill('A long, personal memory. '.repeat(150));await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles(path.resolve('tests/fixtures/memory.png'));await page.getByLabel('Caption for photo 1').fill('Our evening');await page.getByRole('button',{name:'Preview my Diwali'}).click();await openBook(page);
 await page.getByRole('button',{name:/Chapters/}).click();await page.getByRole('button',{name:/Moments I Wish/}).click();
 await page.getByRole('button',{name:'Enlarge photo 1: Our evening'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Next page',exact:true}).click();await page.getByRole('button',{name:'Open your letter'}).click();await expect(page.locator('.handwritten-message')).toContainText('A long, personal memory.');
});
test('WebGL entrance or deliberate fallback can enter and releases the canvas',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:/A little Diwali/})).toBeVisible();await openBook(page);await expect(page.locator('canvas')).toHaveCount(0);
 await page.goto('/?fallback');await expect(page.locator('canvas')).toHaveCount(0);await openBook(page);
});
