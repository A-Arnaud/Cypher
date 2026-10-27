# Cypher — démarrage rapide en français

**Version actuelle : 0.5.4**, pour Windows et Mac. [Toutes les releases](https://github.com/A-Arnaud/Cypher/releases/latest) · [README en anglais](../README.md)

## Télécharger le bon fichier

| Votre ordinateur | Téléchargement recommandé |
| --- | --- |
| **Windows 10 ou 11, x64** | **[Installateur Windows](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.5.4-win-x64.exe)** |
| **Mac Intel** | **[Installateur Mac Intel](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.4-mac-x64.dmg)** |
| **Mac Apple Silicon, puce M1, M2, M3…** | **[Installateur Mac Apple Silicon](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.5.4-mac-arm64.dmg)** |

Mac nécessite **macOS 13 Ventura ou plus récent**. Dans le menu Apple, ouvrez **À propos de ce Mac** : un processeur Intel correspond au fichier `mac-x64`, une puce Apple M au fichier `mac-arm64`.

[Version Windows portable, ZIP Mac et sommes de contrôle](downloads.md#other-downloads).

## Installer ou mettre à jour

1. Si Cypher est déjà ouvert, choisissez **Quitter** dans son menu ou **Quitter Cypher** dans la fenêtre de fermeture. Réduire laisse l'ancienne version active.
2. **Windows :** lancez l'installateur. **Mac :** ouvrez le DMG et placez ou remplacez **Cypher.app** dans **Applications**.
3. Rouvrez Cypher. Les préférences et profils sont séparés des fichiers de l'application ; conservez leur dossier de données lors du remplacement de l'app.
4. Pour passer l'interface en français : **Settings → Language → Français**.

Le téléchargement Windows n'est pas signé Authenticode ; le téléchargement Mac n'est pas notarié par Apple. Si le système affiche un avertissement au premier lancement, suivez les [instructions d'installation](downloads.md#first-launch). La disponibilité sur Mac et la signature Apple sont deux sujets distincts.

## Se connecter

Dans **Connexions**, Cypher commence par la **Détection automatique** des profils existants. Autorisez uniquement ceux que vous souhaitez lire.

Pour Codex, ouvrez **Autres façons de se connecter → Se connecter dans le navigateur**. Cette méthode fonctionne sur Windows et Mac sans installer séparément le CLI, l'application Codex ou Node.js. Le composant officiel est inclus et crée un profil indépendant pour Cypher.

Les autres options proposées dépendent du fournisseur : **Avec le CLI installé**, dossier de profil ou **Utiliser une clé API**. Claude et Gemini utilisent encore leur CLI pour la connexion à un compte d'abonnement ; leurs lecteurs de quotas d'abonnement ne sont pas implémentés. La facturation API reste séparée des quotas des abonnements. [Détail des méthodes](connection-methods.md).

## Retrouver Cypher dans la barre

| Système | Action et emplacement |
| --- | --- |
| **Windows 10** | **Mettre dans la barre des tâches**, en bas, sur la barre principale horizontale |
| **Windows 11** | **Mettre dans la barre des tâches**, en bas à droite près de l'horloge ; l'icône peut être sous la flèche des icônes masquées |
| **Mac** | **Mettre dans la barre des menus**, en haut à droite ; Cypher reste absent du Dock et de ⌘Tab |

Sur Mac, cliquez sur l'icône du haut puis **Afficher / Masquer** pour ouvrir ou cacher la fenêtre. Cela fonctionne aussi après l'ouverture des réglages. Si vous aviez épinglé l'ancienne icône au Dock, retirez ce favori une fois depuis son menu d'options.

Raccourci par défaut : **Ctrl+Alt+Q** sur Windows, **Control+Option+Q** sur Mac.

## Démarrer automatiquement

Dans **Réglages**, activez **Démarrer avec Windows** ou **Ouvrir à la connexion** sur Mac. Cypher démarrera directement dans la barre, sans afficher sa grande fenêtre. Ce choix reste facultatif et peut être désactivé au même endroit ; mettre Cypher dans la barre ne l'active pas tout seul.

Sur Mac, l'application doit être dans **Applications**. Si macOS demande une autorisation, Cypher affiche cet état et indique où approuver l'élément dans les réglages système. Un échec d'enregistrement est signalé. La version Windows portable ne propose pas le démarrage automatique.

## Réduire ou quitter

La fermeture de la fenêtre propose **Réduire dans la barre**, **Quitter Cypher** ou **Annuler**. Réduire garde la collecte active ; quitter arrête l'application. Si la mise en barre échoue, la fenêtre reste accessible avec un message d'erreur.

Sur Mac, **Quitter** reste disponible dans le menu de l'icône en haut, même sans icône dans le Dock.

[Aide et dépannage](../SUPPORT.md) · [Notes de version](releases/0.5.4.md) · [Vérifications et limites](../VERIFICATION.md) · [Signaler un problème](https://github.com/A-Arnaud/Cypher/issues/new/choose).
