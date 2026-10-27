import {it,expect,vi} from 'vitest';import {mkdtemp,mkdir,writeFile,readFile,rm,symlink} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
vi.mock('electron',()=>({dialog:{}}));
const mocked=vi.hoisted(()=>({start:vi.fn()}));vi.mock('../src/main/codex-browser-login',()=>({startCodexBrowserLogin:mocked.start}));
import {Accounts} from '../src/main/accounts';
async function fixture(alias=false){
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-account-test-'));const home=path.join(root,'home');await mkdir(path.join(home,'.codex'),{recursive:true});await writeFile(path.join(home,'.codex','auth.json'),'existing-fixture-credentials');
 let success!:()=>void;let fail!:(error:Error)=>void;const completed=new Promise<void>((resolve,reject)=>{success=resolve;fail=reject});
 mocked.start.mockImplementation((_command,_env,_open,signal:AbortSignal)=>{signal.addEventListener('abort',()=>fail(Error('cancelled')),{once:true});return {opened:Promise.resolve(),completed}});
 if(alias){await mkdir(path.join(root,'physical-state'));await symlink(path.join(root,'physical-state'),path.join(root,'state'),process.platform==='win32'?'junction':'dir')}
 const grant=vi.fn(async()=>{}),publish=vi.fn();let accounts:Accounts;
 const host={home,userData:path.join(root,'state'),appData:root,localAppData:root,directExecutable:process.execPath,openAuth:async()=>{},window:()=>undefined,language:()=> 'en',grant,publish,refresh:async()=>{await accounts.discover()}};
 accounts=new Accounts(host);await accounts.initialize();
 return {root,home,accounts,grant,success,fail,async cleanup(){accounts.dispose();await new Promise(resolve=>setTimeout(resolve,25));await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:100})}};
}
it('creates an independent direct-login profile and grants reads only after successful authentication',async()=>{
 const f=await fixture();try{await f.accounts.loginDirect('codex');const direct=f.accounts.profiles.find(p=>p.source==='manual')!;expect(direct.root).toContain(path.join('state','profiles','codex'));expect(f.accounts.active.has(direct.id)).toBe(true);expect(f.grant).not.toHaveBeenCalled();expect(await readFile(path.join(f.home,'.codex','auth.json'),'utf8')).toBe('existing-fixture-credentials');f.success();await vi.waitFor(()=>expect(f.grant).toHaveBeenCalledWith(direct.id,true,true));await vi.waitFor(()=>expect(f.accounts.active.size).toBe(0))}finally{await f.cleanup()}
});
it('rediscovers a browser profile through a symlink or Windows junction without losing its identity',async()=>{
 const f=await fixture(true);try{await f.accounts.loginDirect('codex');const direct=f.accounts.profiles.find(p=>p.connectionMethod==='browser')!;expect(direct.root).toContain('physical-state');expect(f.accounts.active.has(direct.id)).toBe(true);f.accounts.cancelLogin(direct.id);await vi.waitFor(()=>expect(f.accounts.active.size).toBe(0))}finally{await f.cleanup()}
});
it('cancels a direct login without granting permission or reporting an authentication error',async()=>{
 const f=await fixture();try{await f.accounts.loginDirect('codex');const id=f.accounts.directLoginIds()[0];await expect(f.accounts.loginDirect('codex')).rejects.toThrow('login-already-open');f.accounts.cancelLogin(id);await vi.waitFor(()=>expect(f.accounts.active.size).toBe(0));expect(f.grant).not.toHaveBeenCalled();expect(f.accounts.loginErrors[id]).toBeUndefined()}finally{await f.cleanup()}
});
it('rejects unsupported providers and mismatched profiles before launching authentication',async()=>{
 const f=await fixture();try{const calls=mocked.start.mock.calls.length;await expect(f.accounts.loginDirect('claude')).rejects.toThrow('direct-login-unavailable');await expect(f.accounts.loginDirect('codex','gemini')).rejects.toThrow('invalid-profile');expect(mocked.start.mock.calls.length).toBe(calls);expect(f.grant).not.toHaveBeenCalled()}finally{await f.cleanup()}
});
