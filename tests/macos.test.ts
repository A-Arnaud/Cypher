import {expect,it} from 'vitest';
import {mkdtemp,mkdir,writeFile,rm,chmod} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import {spawnSync} from 'node:child_process';
import {buildMacLoginScript,shellQuote} from '../src/main/login';
import {cliCommand,codexStatus} from '../src/main/cli';
import {discoverTools} from '../src/main/discovery';
import {readRegistry,saveRegistry} from '../src/main/registry';
import {copy} from '../src/shared/i18n';
import {TrayHost,type TrayPresentation} from '../src/main/tray-host';

it('uses macOS menu bar wording in both languages while preserving Windows copy',()=>{
 expect(copy('en','trayDock','darwin')).toBe('Show quotas in menu bar');
 expect(copy('fr','trayDock','darwin')).toContain('barre des menus');
 expect(copy('en','startup','darwin')).toBe('Open at login');
 expect(copy('en','trayDock','win32')).toBe('Show quotas in notification area');
 expect(copy('en','dock','win32')).toBe('Put in taskbar');
});
it('shows bounded public quota text beside the native menu bar icon',async()=>{
 let shown:TrayPresentation|undefined;const host=new TrayHost(value=>shown=value);await host.start();
 host.render({items:[{id:'private-profile',providerId:'codex',label:'private@example.com',text:'42%',stale:false},{id:'another-private',providerId:'claude',label:'secret',text:'—',stale:true}],extraCount:2,language:'en'});
 expect(shown?.title).toBe('Codex : 42% · Claude Code : — (stale) · +2');
 expect(shown?.title).not.toMatch(/private|secret/);await host.stop();expect(shown).toBeUndefined();
});
it('quotes shell metacharacters and restricts sign-in to one profile',()=>{
 expect(shellQuote("a'b $(id)")).toBe("'a'\\''b $(id)'");
 const root=path.resolve('synthetic profile');const script=buildMacLoginScript({providerId:'codex',file:path.join(root,'codex'),prefixArgs:[],cwd:root,profileEnv:{CODEX_HOME:root}},{PATH:'/usr/bin:/bin',OPENAI_API_KEY:'synthetic-secret',NODE_OPTIONS:'--require injected'});
 expect(script).toContain('/usr/bin/env -i');expect(script).toContain(shellQuote('CODEX_HOME='+root));expect(script).toContain(' login');expect(script).not.toMatch(/synthetic-secret|NODE_OPTIONS/);
 expect(()=>buildMacLoginScript({providerId:'codex',file:path.join(root,'codex'),prefixArgs:[],cwd:root,profileEnv:{CLAUDE_CONFIG_DIR:root}},{})).toThrow('invalid-profile-env');
});
it.skipIf(process.platform!=='darwin')('discovers executable CLIs, restores their paths and reads synthetic quota responses on macOS',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-mac-'));try{
  const bin=path.join(root,'bin');await mkdir(bin);const cli=path.join(bin,'codex');const entry=path.join(root,'fixture.cjs');
  await writeFile(entry,`require('node:readline').createInterface({input:process.stdin}).on('line',line=>{const q=JSON.parse(line);if(!q.id)return;console.log(JSON.stringify({id:q.id,result:q.method==='account/read'?{account:{type:'chatgpt',planType:'synthetic',profile:process.env.CODEX_HOME}}:q.method==='account/rateLimits/read'?{rateLimits:{primary:{usedPercent:35}}}:{}}))});`);
  await writeFile(cli,'#!/bin/sh\nexec '+shellQuote(process.execPath)+' '+shellQuote(entry)+' "$@"\n');await chmod(cli,0o700);
  const detected=await discoverTools({home:root,path:bin,appData:root,localAppData:root});expect(detected.find(x=>x.id==='codex')?.executable).toBe(cli);
  expect((await cliCommand(cli,'codex')).args).toEqual([]);
  const registry=path.join(root,'registry.json');await saveRegistry(registry,{profiles:[],executables:{codex:cli}});expect((await readRegistry(registry)).executables.codex).toBe(cli);
  const result=await codexStatus(cli,new AbortController().signal,{CODEX_HOME:root});expect(result.account.profile).toBe(root);expect(result.limits.rateLimits.primary.usedPercent).toBe(35);
  await chmod(cli,0o600);await expect(cliCommand(cli,'codex')).rejects.toThrow();
 }finally{await rm(root,{recursive:true,force:true})}
});
it.skipIf(process.platform!=='darwin')('executes a quoted login script without shell injection or inherited secrets',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),"cypher-'$-"));try{
  const cli=path.join(root,'codex');const out=path.join(root,'result.json');const entry=path.join(root,'fixture.cjs');
  await writeFile(entry,`require('node:fs').writeFileSync(${JSON.stringify(out)},JSON.stringify({home:process.env.CODEX_HOME,key:process.env.OPENAI_API_KEY,args:process.argv.slice(2)}));`);
  await writeFile(cli,'#!/bin/sh\nexec '+shellQuote(process.execPath)+' '+shellQuote(entry)+' "$@"\n',{mode:0o700});
  const content=buildMacLoginScript({providerId:'codex',file:cli,prefixArgs:[],profileEnv:{CODEX_HOME:root},cwd:root},{PATH:'/usr/bin:/bin',OPENAI_API_KEY:'synthetic-secret'});const file=path.join(root,'login.command');await writeFile(file,content);
  const result=spawnSync('/bin/sh',[file],{encoding:'utf8'});expect(result.status,result.stderr).toBe(0);
  const {readFile}=await import('node:fs/promises');expect(JSON.parse(await readFile(out,'utf8'))).toEqual({home:root,args:['login']});
 }finally{await rm(root,{recursive:true,force:true})}
});
