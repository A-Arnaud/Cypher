# Cypher — démarrage rapide en français

**Version actuelle : 0.7.0**, pour Windows et Mac. [Toutes les releases](https://github.com/A-Arnaud/Cypher/releases/latest) · [README en anglais](../README.md)

## Télécharger le bon fichier

| Votre ordinateur | Téléchargement recommandé |
| --- | --- |
| **Windows 10 ou 11, x64** | **[Installateur Windows](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-Setup-0.7.0-win-x64.exe)** |
| **Mac Intel** | **[Installateur Mac Intel](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-x64.dmg)** |
| **Mac Apple Silicon, puce M1, M2, M3…** | **[Installateur Mac Apple Silicon](https://github.com/A-Arnaud/Cypher/releases/latest/download/Cypher-0.7.0-mac-arm64.dmg)** |

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

## Actions rapides et diagnostic

**Nouveau en 0.7.0 :** cliquez sur **Actions rapides**, ou utilisez **Ctrl+K** sur Windows / **⌘K** sur Mac, pour trouver un profil, un service ou une action. Flèches pour naviguer, Entrée pour ouvrir, Échap pour fermer. **À vérifier** filtre les profils nécessitant une action ; les cartes indiquent l’âge/source des lectures. **Réglages → Diagnostic** propose un JSON local à consulter/copier explicitement, sans noms de comptes, e-mails, chemins, clés, montants de quota ni journaux bruts. [Guide détaillé](navigation-and-diagnostics.md).

## Être averti des nouvelles versions

Si vous utilisez encore **0.5.x**, installez **0.7.0 une première fois** pour obtenir le contrôle des mises à jour. Les versions 0.6.0 et suivantes le possèdent déjà. Cypher vérifie les releases stables GitHub après l'ouverture puis toutes les six heures. Une petite action **Mise à jour** apparaît dans le widget et le menu, sans ouvrir de fenêtre automatiquement.

Après votre accord, la **version Windows installée** télécharge et vérifie la mise à jour, puis l'installe et redémarre dans la barre. Sur **Mac actuellement**, Cypher ouvre le bon téléchargement dans votre navigateur ; le remplacement dans Applications reste manuel tant que le mécanisme Mac signé n'est pas disponible. Les versions Windows portables ou simplement décompressées restent également manuelles.

**Plus tard** masque l'indicateur pendant 24 heures. **Réglages → Mises à jour** permet de rechercher une version ou de désactiver la recherche automatique. [Fonctionnement détaillé](updates.md).

## Réduire ou quitter

La fermeture de la fenêtre propose **Réduire dans la barre**, **Quitter Cypher** ou **Annuler**. Réduire garde la collecte active ; quitter arrête l'application. Si la mise en barre échoue, la fenêtre reste accessible avec un message d'erreur.

Sur Mac, **Quitter** reste disponible dans le menu de l'icône en haut, même sans icône dans le Dock.

[Aide et dépannage](../SUPPORT.md) · [Notes de version](releases/0.7.0.md) · [Vérifications et limites](../VERIFICATION.md) · [Signaler un problème](https://github.com/A-Arnaud/Cypher/issues/new/choose).
