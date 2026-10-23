import path from 'node:path';import {existsSync} from 'node:fs';
export function stateLocation(appData:string,override?:string):string{if(override)return override;for(const name of ['Quota Glass','quota-glass']){const existing=path.join(appData,name);if(existsSync(existing))return existing}return path.join(appData,'Cypher')}
