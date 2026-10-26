import type {Language} from './model';

// Renderer platform comes from the main process, never from browser sniffing.
export const macCopy:Record<Language,Record<string,string>>={
 en:{trayDock:'Show quotas in menu bar',trayUndock:'Remove quotas from menu bar',trayError:'Menu bar unavailable. The widget remains accessible.',dock:'Show quotas in menu bar',undock:'Remove quotas from menu bar',taskbarError:'Menu bar unavailable. The widget remains accessible.',startup:'Open at login',startupHint:'For this unsigned preview, add Cypher in macOS System Settings > General > Login Items.',startupEnabledHint:'Opens Cypher when you sign in to macOS.',desktopOnly:'Available in the desktop app'},
 fr:{trayDock:'Afficher les quotas dans la barre des menus',trayUndock:'Retirer les quotas de la barre des menus',trayError:'Barre des menus indisponible. Le widget reste accessible.',dock:'Afficher les quotas dans la barre des menus',undock:'Retirer les quotas de la barre des menus',taskbarError:'Barre des menus indisponible. Le widget reste accessible.',startup:'Ouvrir à la connexion',startupHint:'Pour cet aperçu non signé, ajoutez Cypher dans Réglages Système > Général > Ouverture.',startupEnabledHint:'Ouvre Cypher à la connexion macOS.',desktopOnly:'Disponible dans l’application de bureau'}
};
