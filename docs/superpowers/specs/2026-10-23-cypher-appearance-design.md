# Cypher — apparence et collecte discrète

Demandes explicites : conserver la mise en page, nommer le logiciel Cypher, utiliser exactement D:/Projets/icon.svg comme nouveau logo et icône, rendre l'opacité réglable et supprimer les consoles de rafraîchissement. Choix du constructeur : opacité globale du widget de 30 à 100 %, 100 % par défaut ; contrôle immédiat, préférence conservée, minimum non invisible. Le terminal reste visible uniquement sur action de connexion.

Conserver le répertoire de données historique Quota Glass lorsqu'il existe, sans déplacer/copier les credentials des profils ; sinon créer Cypher. Nom du nouveau portable : Cypher-0.2.0-win-x64.exe dans release/. Identifiant interne et titre changés ; dossier du dépôt conservé pour la continuité.

Diagnostic confirmé : le launcher npm Codex lance lui-même un binaire natif avec spawn sans windowsHide. Le windowsHide du parent ne couvre pas cette frontière. Résoudre directement le binaire natif distribué lorsque possible ; pour les CLI Node restant nécessaires, précharger un garde limité aux workers de lecture pour forcer windowsHide sur les sous-processus Node. Ne pas appliquer ce garde aux terminaux de login.

Intégrer aussi les deux problèmes importants de la revue multi-profils : transport des chemins Unicode par environnement UTF-16 natif, le batch restant ASCII et démarrant par un nom de fichier ASCII dans son propre dossier ; réscan obligatoirement postérieur à une mutation de registre, même si une collecte précédente est encore en cours. Garder une action de remplacement de CLI accessible même lorsqu'un ancien launcher est détecté.

Vérifications : régressions unitaires RED→GREEN, test natif Unicode et ponctuation, observation des véritables options de création Windows du petit-enfant CLI sur un contrôle non corrigé puis corrigé, test complet de login avec CLI synthétique, IPC et persistance d'opacité, captures réelles de l'interface et construction/test du portable. Aucun vrai compte connecté par les tests ; limites fournisseur conservées.
