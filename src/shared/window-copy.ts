import type {Language} from './model';
export type BarDestination='taskbar'|'notification'|'menu';
export function barDestination(platform?:string,backend?:string):BarDestination{return platform==='darwin'?'menu':backend==='tray'?'notification':'taskbar'}
const text={fr:{
 close:'Fermer la fenêtre',closeTitle:'Fermer Cypher',closeMessage:'Souhaitez-vous garder Cypher dans la barre ou quitter l’application ?',
 quit:'Quitter Cypher',cancel:'Annuler',remove:'Retirer',starting:'Mise en place…',closeError:'Impossible d’afficher le choix de fermeture. Cypher reste ouvert.',
 taskbar:{move:'Mettre dans la barre des tâches',minimize:'Réduire dans la barre des tâches',hint:'En bas de l’écran. Cliquez sur Cypher pour le rouvrir.',detail:'Cypher reste ouvert dans la barre des tâches, en bas de l’écran. Vous pourrez le rouvrir en cliquant sur son indicateur. Quitter arrête l’application et les mises à jour.'},
 notification:{move:'Mettre dans la barre des tâches',minimize:'Réduire dans la barre des tâches',hint:'En bas à droite, près de l’horloge ou sous la flèche.',detail:'Cypher reste ouvert près de l’horloge, dans la zone de notification. Windows peut placer son icône sous la flèche des icônes masquées. Quitter arrête l’application et les mises à jour.'},
 menu:{move:'Mettre dans la barre des menus',minimize:'Réduire dans la barre des menus',hint:'En haut à droite. Cliquez sur Cypher pour le rouvrir.',detail:'Cypher reste ouvert dans la barre des menus, en haut à droite de votre Mac. Son menu permet de rouvrir le widget. Quitter arrête l’application et les mises à jour.'}
},en:{
 close:'Close window',closeTitle:'Close Cypher',closeMessage:'Keep Cypher in the bar, or quit the application?',
 quit:'Quit Cypher',cancel:'Cancel',remove:'Remove',starting:'Moving to the bar…',closeError:'Could not show the closing options. Cypher remains open.',
 taskbar:{move:'Move to taskbar',minimize:'Minimize to taskbar',hint:'At the bottom of your screen. Click Cypher to reopen it.',detail:'Cypher stays open in the taskbar at the bottom of your screen. Click its indicator to reopen it. Quitting stops the application and its updates.'},
 notification:{move:'Move to taskbar',minimize:'Minimize to taskbar',hint:'Bottom right, near the clock or under hidden icons.',detail:'Cypher stays open near the clock in the notification area. Windows may place its icon under the hidden-icons arrow. Quitting stops the application and its updates.'},
 menu:{move:'Move to menu bar',minimize:'Minimize to menu bar',hint:'Top right of your screen. Click Cypher to reopen it.',detail:'Cypher stays open in the menu bar at the top right of your Mac. Open its menu to restore the widget. Quitting stops the application and its updates.'}
}};
export const windowUiCopy={fr:{closeDialogError:text.fr.closeError},en:{closeDialogError:text.en.closeError}};
export function windowCopy(language:Language,platform?:string,backend?:string){const value=text[language];return {...value,...value[barDestination(platform,backend)]}}
