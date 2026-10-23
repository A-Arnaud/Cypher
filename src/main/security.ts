import {catalog} from '../shared/catalog';
import {fileURLToPath} from 'node:url';import path from 'node:path';
export function providerUrl(id:unknown):string|undefined{if(typeof id!=='string')return undefined;const u=catalog.find(x=>x.id===id)?.usageUrl;return u?.startsWith('https://')?u:undefined}
export function trustedSender(url:string,rendererRoot:string,devUrl?:string):boolean{try{const u=new URL(url);if(devUrl&&u.origin===new URL(devUrl).origin)return true;return u.protocol==='file:'&&path.resolve(fileURLToPath(u)).toLowerCase()===path.resolve(rendererRoot).toLowerCase()}catch{return false}}
