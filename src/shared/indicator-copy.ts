import type {Language} from './model';
import {barDestination} from './window-copy';
const text={fr:{title:'Indicateur de quotas',
 taskbar:'Afficher les quotas dans la barre des tâches',notification:'Afficher les quotas près de l’horloge',menu:'Afficher les quotas dans la barre des menus',
 hint:'Activé par défaut à chaque ouverture. Votre choix est mémorisé, y compris au démarrage de l’ordinateur. L’icône Cypher reste accessible si vous masquez les quotas.'
},en:{title:'Quota indicator',
 taskbar:'Show quotas in the taskbar',notification:'Show quotas near the clock',menu:'Show quotas in the menu bar',
 hint:'Enabled by default whenever Cypher opens. Your choice is remembered, including at login. The Cypher icon remains accessible when quotas are hidden.'
}};
export function indicatorCopy(language:Language,platform?:string,backend?:string){const t=text[language];return {title:t.title,label:t[barDestination(platform,backend)],hint:t.hint}}
