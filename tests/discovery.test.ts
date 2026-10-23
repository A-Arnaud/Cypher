import {describe,it,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {discoverTools} from '../src/main/discovery';
import {catalog} from '../src/shared/catalog';
describe('real installation evidence',()=>{
 it('does not turn an abandoned config directory into an installation',async()=>{
  const home=await mkdtemp(path.join(path.join(process.env.LOCALAPPDATA!,'hermes','cache','scratch'),'qg-'));
  try {await mkdir(path.join(home,'.ollama'));const rows=await discoverTools({home,path:'',appData:home,localAppData:home});
  expect(rows.find(x=>x.id==='ollama')).toMatchObject({installed:false,configPresent:true});}finally{await rm(home,{recursive:true,force:true})}
 });
 it('finds actual CLI executable without executing it',async()=>{
  const home=await mkdtemp(path.join(path.join(process.env.LOCALAPPDATA!,'hermes','cache','scratch'),'qg-'));try{await writeFile(path.join(home,'codex.cmd'),'@echo off');
  const rows=await discoverTools({home,path:home,appData:home,localAppData:home});
  expect(rows.find(x=>x.id==='codex')).toMatchObject({installed:true,executable:path.join(home,'codex.cmd')});}finally{await rm(home,{recursive:true,force:true})}
 });
 it('survives missing installation paths',async()=>{expect((await discoverTools({home:'Z:/not-a-real-user',path:'',appData:'Z:/absent',localAppData:'Z:/absent'})).length).toBeGreaterThan(10)});
 it('has unique provider surfaces and honest planned coverage',()=>{
 expect(new Set(catalog.map(x=>x.id)).size).toBe(catalog.length);
 expect(catalog.length).toBeGreaterThanOrEqual(35);
 expect(catalog.find(x=>x.id==='aider')?.billing).toBe('upstream');
 expect(catalog.find(x=>x.id==='poe')?.support).toBe('planned');
 });
});
