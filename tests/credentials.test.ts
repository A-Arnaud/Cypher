import {it,expect} from 'vitest';import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {Credentials} from '../src/main/credentials';
const fakeEncryption={isEncryptionAvailable:()=>true,encryptString:(v:string)=>Buffer.from(v.split('').reverse().join('')),decryptString:(v:Buffer)=>v.toString().split('').reverse().join('')};
it('persists only ciphertext, reloads, serializes writes, and removes keys',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-credentials-'));try{const file=path.join(root,'keys.json'),vault=new Credentials(file,fakeEncryption);await vault.initialize();await Promise.all([vault.set('poe','synthetic-poe-secret'),vault.set('deepseek','synthetic-deepseek-secret')]);expect(await readFile(file,'utf8')).not.toContain('synthetic');const restored=new Credentials(file,fakeEncryption);await restored.initialize();expect(restored.get('poe')).toBe('synthetic-poe-secret');await restored.remove('poe');expect(restored.configured()).toEqual(['deepseek']);expect(restored.get('poe')).toBeUndefined()}finally{await rm(root,{recursive:true,force:true})}
});
it('rejects unknown providers, header injection and plaintext fallback',async()=>{
 const vault=new Credentials('unused',{...fakeEncryption,isEncryptionAvailable:()=>false});await expect(vault.set('poe','synthetic-secret')).rejects.toThrow('credentialStorageUnavailable');await expect(vault.set('unknown','synthetic-secret')).rejects.toThrow('invalid-api-key');await expect(vault.set('poe','header\r\ninjection')).rejects.toThrow('invalid-api-key');
});
it('refuses weak encryption backends and ciphertext moved to a different provider',async()=>{
 const weak=new Credentials('unused',{...fakeEncryption,getSelectedStorageBackend:()=> 'basic_text'});await expect(weak.set('poe','synthetic-secret')).rejects.toThrow('credentialStorageUnavailable');
 const root=await mkdtemp(path.join(os.tmpdir(),'cypher-binding-'));try{const file=path.join(root,'keys.json'),vault=new Credentials(file,fakeEncryption);await vault.set('poe','synthetic-poe-secret');const raw=JSON.parse(await readFile(file,'utf8'));await writeFile(file,JSON.stringify({deepseek:raw.poe}));const restored=new Credentials(file,fakeEncryption);await restored.initialize();expect(()=>restored.get('deepseek')).toThrow('apiKeyUnreadable')}finally{await rm(root,{recursive:true,force:true})}
});
