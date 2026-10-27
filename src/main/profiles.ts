import {readdir,realpath,stat} from 'node:fs/promises';
import path from 'node:path';import {createHash} from 'node:crypto';
export type ProfileProvider='codex'|'claude'|'gemini';
export interface ProfileRecord {connectionMethod?:'browser';id:string;providerId:ProfileProvider;label:string;root:string;directory:string;configPresent:boolean;authFilePresent:boolean;source:'default'|'auto'|'environment'|'manual';env:Record<string,string>}
export interface ProfileEnv {home:string;env:Record<string,string|undefined>}
export interface RegisteredProfile {connectionMethod?:'browser';providerId:ProfileProvider;root:string;label?:string}
export const profileProviders:ProfileProvider[]=['codex','claude','gemini'];
export function localAbsolute(p:unknown):p is string{return typeof p==='string'&&path.isAbsolute(p)&&!/["\r\n\0]/.test(p)&&! /^(\\\\|\/\/)/.test(p)}
const variables={codex:'CODEX_HOME',claude:'CLAUDE_CONFIG_DIR',gemini:'GEMINI_CLI_HOME'};
async function canonical(p:string){try{return await realpath(p)}catch{return path.resolve(p)}}
function key(p:string){return process.platform==='win32'?p.toLowerCase():p}
async function exists(p:string,directory=false){try{const s=await stat(p);return directory?s.isDirectory():s.isFile()}catch{return false}}
export async function discoverProfiles(input:ProfileEnv,registered:RegisteredProfile[]=[]):Promise<ProfileRecord[]>{
 const candidates:{connectionMethod?:'browser';providerId:ProfileProvider;root:string;source:ProfileRecord['source'];label?:string}[]=profileProviders.map(providerId=>({providerId,root:providerId==='gemini'?input.home:path.join(input.home,'.'+providerId),source:'default'}));
 for(const p of registered){if(!profileProviders.includes(p.providerId)||!localAbsolute(p.root))throw Error('invalid-profile-root');candidates.push({...p,source:'manual'})}
 for(const providerId of profileProviders){const override=input.env[variables[providerId]];if(override&&localAbsolute(override))candidates.push({providerId,root:override,source:'environment'})}
 try{for(const d of await readdir(input.home,{withFileTypes:true})){if(!d.isDirectory()&&!d.isSymbolicLink())continue;const providerId=/^\.codex[-_.].+/i.test(d.name)?'codex':/^\.claude[-_.].+/i.test(d.name)?'claude':undefined;if(providerId)candidates.push({providerId,root:path.join(input.home,d.name),source:'auto'});if(candidates.length>=128)break}}catch{}
 const defaults=new Map<ProfileProvider,string>();for(const id of profileProviders)defaults.set(id,key(await canonical(id==='gemini'?input.home:path.join(input.home,'.'+id))));
 const seen=new Set<string>();const result:ProfileRecord[]=[];
 for(const candidate of candidates){const root=await canonical(candidate.root);if(!localAbsolute(root))continue;const identity=candidate.providerId+':'+key(root);if(seen.has(identity))continue;seen.add(identity);
  const isDefault=key(root)===defaults.get(candidate.providerId);const id=isDefault?candidate.providerId:candidate.providerId+'-profile-'+createHash('sha256').update(identity).digest('hex').slice(0,16);
  const directory=candidate.providerId==='gemini'?path.join(root,'.gemini'):root;
  const credential=candidate.providerId==='codex'?'auth.json':candidate.providerId==='claude'?'.credentials.json':'oauth_creds.json';
  result.push({...(candidate.connectionMethod==='browser'?{connectionMethod:'browser' as const}:{}),id,providerId:candidate.providerId,label:isDefault?'default':candidate.label?.slice(0,80)||path.basename(root),root,directory,source:isDefault?'default':candidate.source,configPresent:await exists(directory,true),authFilePresent:await exists(path.join(directory,credential)),env:{[variables[candidate.providerId]]:root}});
 }
 return result;
}
export function publicProfiles(records:ProfileRecord[]){return records.map(({root,directory,env,...p})=>p)}
