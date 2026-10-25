import {stat,readdir} from 'node:fs/promises';
import path from 'node:path';
import {catalog} from '../shared/catalog';
import {cliCommand} from './cli';
import {profileProviders,type ProfileProvider} from './profiles';
export interface Detection {id:string;installed:boolean;configPresent:boolean;executable?:string;evidence:string[]}
export interface DiscoveryEnv {home:string;path:string;appData:string;localAppData:string}
async function isFile(p:string){try{return (await stat(p)).isFile()}catch{return false}}
async function isDirectory(p:string){try{return (await stat(p)).isDirectory()}catch{return false}}
export async function discoverTools(env:DiscoveryEnv):Promise<Detection[]> {
 const dirs=[...env.path.split(path.delimiter).filter(Boolean),path.join(env.appData,'npm'),path.join(env.home,'.local','bin')];
 const known:Record<string,string[]>={ollama:[path.join(env.localAppData,'Programs','Ollama','ollama.exe')],lmstudio:[path.join(env.localAppData,'Programs','LM Studio','LM Studio.exe')],cursor:[path.join(env.localAppData,'Programs','cursor','Cursor.exe')],windsurf:[path.join(env.localAppData,'Programs','Windsurf','Windsurf.exe')]};
 let extensions:string[]=[];try{extensions=await readdir(path.join(env.home,'.vscode','extensions'))}catch{}
 return Promise.all(catalog.map(async entry=>{
  const candidates=entry.command?dirs.flatMap(d=>['.exe','.cmd','.bat'].map(ext=>path.join(d,entry.command!+ext))):[];
  let executable:string|undefined;
  for(const p of [...candidates,...(known[entry.id]??[])]){if(!await isFile(p))continue;if(profileProviders.includes(entry.id as ProfileProvider))try{await cliCommand(p,entry.id as ProfileProvider)}catch{continue}executable=p;break}
  const extension=extensions.find(x=>entry.id==='copilot'?/^github\.copilot-/.test(x):entry.id==='continue'?/^continue\.continue-/.test(x):entry.id==='codex'?/^openai\.chatgpt-/.test(x):entry.id==='claude'?/^anthropic\.claude-code-/.test(x):false);
  const configPresent=entry.config?await isDirectory(path.join(env.home,entry.config)):false;
  return {id:entry.id,installed:!!executable||!!extension,configPresent,executable,evidence:[...(executable?['executable']:[]),...(extension?['vscode-extension']:[]),...(configPresent?['configuration-directory']:[])]};
 }));
}
