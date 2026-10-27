import type {AppUpdateState} from '../shared/updates';import {updateCopy} from '../shared/update-copy';
import type {MenuItemConstructorOptions} from 'electron';
import type {Language} from '../shared/model';import {copy} from '../shared/i18n';
interface Actions {toggle:()=>void;refresh:()=>void;pause:()=>void;quit:()=>void}
export function trayMenuTemplate(language:Language,paused:boolean,lines:string[],actions:Actions,update?:AppUpdateState,updateActions?:{check:()=>void;request:()=>void}):MenuItemConstructorOptions[]{
 return [{label:'Cypher',enabled:false},...lines.map(label=>({label,enabled:false})),{type:'separator'},
  {label:language==='fr'?'Afficher / Masquer':'Show / Hide',click:actions.toggle},
  {label:copy(language,'refresh'),click:actions.refresh},
  {label:copy(language,paused?'resume':'pause'),click:actions.pause},
  ...(update?.active&&updateActions?[{type:'separator' as const},{label:update.phase==='downloading'?updateCopy(language).downloading+' '+(update.progress??0)+'%':update.phase==='installing'?updateCopy(language).installing:update.version?updateCopy(language).available+' '+update.version:updateCopy(language).check,enabled:!['checking','downloading','installing'].includes(update.phase),click:update.version?updateActions.request:updateActions.check}]:[]),{type:'separator'},{label:copy(language,'quit'),click:actions.quit}];
}
