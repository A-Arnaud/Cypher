import {it,expect} from 'vitest';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
import {defaultSettings,readSettings,saveSettings,validatePatch} from '../src/main/settings';

it('defaults the indicator on without enabling startup or account access',()=>{
 const settings=defaultSettings();expect(settings.taskbarMode).toBe(true);expect(settings.startAtLogin).toBe(false);expect(settings.consents).toEqual([]);
});
it('migrates the old unchosen default but retains an explicit removal through saving and reopening',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-indicator-settings-'));
 try{
  const file=path.join(root,'settings.json');
  for(const raw of [{},{taskbarMode:false},{taskbarMode:false,taskbarOnboarded:false}]){
   await writeFile(file,JSON.stringify({...raw,language:'fr',summaryMode:true,consents:['codex']}));
   const settings=await readSettings(file);expect(settings.taskbarMode).toBe(true);expect(settings.summaryMode).toBe(true);expect(settings.language).toBe('fr');expect(settings.consents).toEqual(['codex']);
  }
  await saveSettings(file,validatePatch(defaultSettings(),{taskbarMode:false,taskbarOnboarded:true}));
  expect((await readSettings(file)).taskbarMode).toBe(false);
  await saveSettings(file,{...await readSettings(file),language:'fr'});
  expect((await readSettings(file)).taskbarMode).toBe(false);
 }finally{await rm(root,{recursive:true,force:true})}
});
