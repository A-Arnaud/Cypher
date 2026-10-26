import type {MenuItemConstructorOptions} from 'electron';
import type {Language} from '../shared/model';import {copy} from '../shared/i18n';
interface Actions {toggle:()=>void;refresh:()=>void;pause:()=>void;quit:()=>void}
export function trayMenuTemplate(language:Language,paused:boolean,lines:string[],actions:Actions):MenuItemConstructorOptions[]{
 return [{label:'Cypher',enabled:false},...lines.map(label=>({label,enabled:false})),{type:'separator'},
  {label:language==='fr'?'Afficher / Masquer':'Show / Hide',click:actions.toggle},
  {label:copy(language,'refresh'),click:actions.refresh},
  {label:copy(language,paused?'resume':'pause'),click:actions.pause},
  {type:'separator'},{label:copy(language,'quit'),click:actions.quit}];
}
