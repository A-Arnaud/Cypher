import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {isApiProvider,type ApiProvider} from '../shared/connectors';
import {serializeChanges} from './settings';
export interface Encryption {isEncryptionAvailable():boolean;getSelectedStorageBackend?():string;encryptString(value:string):Buffer;decryptString(value:Buffer):string}
// Encryption is provided by Electron safeStorage (Windows DPAPI). No plaintext fallback.
export class Credentials {
 private values:Partial<Record<ApiProvider,string>>={};
 private write=serializeChanges(async(input:{id:ApiProvider;value:string|null})=>{
  const next={...this.values};if(input.value===null)delete next[input.id];else next[input.id]=input.value;
  await mkdir(path.dirname(this.file),{recursive:true});await writeFile(this.file+'.tmp',JSON.stringify(next),'utf8');await rename(this.file+'.tmp',this.file);this.values=next;
 });
 constructor(private file:string,private encryption:Encryption){}
 private available(){return this.encryption.isEncryptionAvailable()&&this.encryption.getSelectedStorageBackend?.()!=='basic_text'}
 async initialize(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.values=Object.fromEntries(Object.entries(raw).filter(([id,value])=>isApiProvider(id)&&typeof value==='string'&&value.length<=20000))}catch{this.values={}}}
 configured(){return Object.keys(this.values)}
 get(id:ApiProvider){const value=this.values[id];if(!value)return undefined;if(!this.available())throw Error('credentialStorageUnavailable');try{const data=JSON.parse(this.encryption.decryptString(Buffer.from(value,'base64')));if(data.version!==1||data.provider!==id||typeof data.key!=='string')throw Error('invalid-envelope');return data.key as string}catch{throw Error('apiKeyUnreadable')}}
 async set(id:unknown,value:unknown){if(!isApiProvider(id)||typeof value!=='string'||value.length<8||value.length>4096||/[\s\x00-\x1f\x7f]/.test(value))throw Error('invalid-api-key');if(!this.available())throw Error('credentialStorageUnavailable');await this.write({id,value:this.encryption.encryptString(JSON.stringify({version:1,provider:id,key:value})).toString('base64')})}
 async remove(id:unknown){if(!isApiProvider(id))throw Error('unsupported-api-provider');await this.write({id,value:null})}
}
