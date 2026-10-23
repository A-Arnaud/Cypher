# Cypher

Widget Windows autonome FR / EN pour découvrir les outils IA locaux et lire les quotas réellement accessibles. Verre fumé sombre, fenêtre déplaçable, icône de notification, raccourci clavier et stockage local. Aucun compte payant n'est déduit de la simple installation.

## Lancer

Double-cliquer `release/Cypher-0.2.0-win-x64.exe`. Aucun droit administrateur nécessaire. Le lancement portable extrait temporairement Electron ; patienter au premier démarrage. Application non signée : Windows peut afficher un avertissement. L'application ne télécharge pas de modèles et n'envoie aucun message IA.

L'icône près de l'horloge (parfois dans les icônes masquées) affiche/masque le widget au clic. Ctrl+Alt+Q fait de même. Le bouton œil barré masque ; la croix visible « Quitter » arrête le processus et la collecte. Une fermeture native de la fenêtre masque également le widget. Masquer conserve la collecte ; Pause la suspend. La position est conservée. Le mode compact réduit les cartes. La fenêtre peut rester au premier plan. Quitter l'ancienne version avant de remplacer son exécutable portable.

## Apparence et rafraîchissement discret

Réglages > Opacité ajuste immédiatement la fenêtre de 30 à 100 % et conserve la préférence. Le logo SVG fourni est utilisé dans l'interface et converti en icône Windows multi-résolution sans modifier le dessin. Les lectures de quota ne lancent pas de terminal : Codex utilise directement son binaire natif lorsque disponible ; les workers Node restants imposent windowsHide aux sous-processus. Seul un clic de connexion ouvre un terminal visible.

Le renommage garde le dossier historique %APPDATA%/Quota Glass s'il existe, sans déplacer les profils ni copier leurs identifiants ; une nouvelle installation utilise %APPDATA%/Cypher. CYPHER_DATA_DIR ou l'ancien QG_DATA_DIR permettent un dossier isolé explicite.

## Connecter les données

1. Ouvrir Connexions. Les outils et profils sont détectés sans ouvrir les fichiers d'identifiants. Chaque profil possède sa propre ligne. Les dossiers .codex, .codex-compte1, .codex-compte2 sont des exemples : les noms ne sont pas codés en dur. Un dossier candidat ne prouve pas une connexion valide ni un compte distinct.
2. Pour un profil déjà connecté, cliquer « Autoriser la lecture seule », puis l'épingler si souhaité. L'autorisation du profil par défaut n'est pas étendue aux autres profils. « Retirer l'accès » ne déconnecte pas le CLI et n'affecte pas les autres profils.
3. « Se connecter » ouvre un terminal Windows : Codex utilise `codex login`, Claude `claude auth login`, Gemini démarre en interactif (utiliser `/auth` si nécessaire). Vous réalisez vous-même le parcours officiel. Ce bouton autorise la lecture du seul profil sélectionné et l'épingle. « Ajouter un compte » crée un profil séparé dans les données du widget, puis ouvre sa connexion, sans copier de clé ni remplacer les autres profils. Ne pas transmettre de mot de passe ou code dans un chat.
4. Codex : lecture du compte et des fenêtres de quota ChatGPT si le serveur les expose. Un compte API n'est pas un abonnement ChatGPT.
5. Claude Code : état du compte et formule lorsque le CLI les fournit ; le quota n'est pas exposé par le connecteur de cette version.
6. Ollama / LM Studio : inventaire des modèles du service local, si installé et en cours d'exécution sur son port par défaut, après autorisation. Aucun quota cloud fictif.

Si le CLI manque : « Déjà installé ? » sélectionne son exécutable .exe ou son launcher npm .cmd ; « Installer le CLI » ouvre sa documentation officielle, sans installation automatique. « Ajouter un dossier de profil » importe un emplacement personnalisé. Codex et Claude attendent leur dossier de configuration ; Gemini attend le home contenant .gemini, pas .gemini directement. « Rechercher à nouveau » relance la découverte ; après connexion, revenir au widget ou actualiser. Une modification du fichier de connexion est surveillée pendant dix minutes ; la fermeture du terminal relance aussi la recherche. Un terminal laissé ouvert reste sous votre contrôle.

Gemini CLI propose maintenant le login, mais sa formule et ses quotas ne sont toujours pas lus. Cursor, Windsurf, Copilot et les agents : détection selon les chemins connus, pas de promesse de quotas. Les autres services sont au catalogue « Prévu » : ils ne sont pas connectés. Voir SUPPORT.md pour les capacités exactes. Les agents qui utilisent un fournisseur amont ne sont pas additionnés à sa facturation.

Réglages > Langue permet Français / English. Actualisation par défaut toutes les 60 secondes ; les fournisseurs peuvent retourner des données retardées. Les erreurs conservent les dernières valeurs avec indication de péremption. Alertes aux seuils 20% / 5%, désactivables. Démarrage avec Windows désactivé dans cette version portable pour ne pas créer une entrée vers un exécutable extrait éphémère. Le flou natif dépend de Windows ; repli sombre translucide sur Windows 10.

## Données et sécurité

Préférences sous `%APPDATA%/Quota Glass/settings.json` ; chemins des profils et exécutables sélectionnés sous registry.json. Aucun secret n'y est stocké. Les nouveaux profils de connexion vivent sous profiles/ dans ce même dossier ; leurs identifiants sont écrits et gérés par les CLI officiels, pas importés par le widget. Scripts temporaires de lancement sous login-scripts/, répertoire de travail neutre sous login-workspaces/. Une session CLI est utilisée seulement après accord pour ce profil. Aucun cookie navigateur, conversation, clé API ou jeton n'est importé. Pas de télémétrie. Aucun login lancé sans clic utilisateur. Supprimer les préférences réinitialise les autorisations du widget, sans supprimer les profils CLI.

L'interface est sandboxée, sans Node, avec IPC validé et URLs externes prédéfinies. Le renderer ne choisit ni commandes ni chemins shell ; dialogues système et registre sont contrôlés par le main. Un lanceur CLI npm inconnu est refusé. CODEX_HOME / CLAUDE_CONFIG_DIR / GEMINI_CLI_HOME sont appliqués uniquement au processus du profil sélectionné. Les moteurs locaux n'acceptent que les adresses loopback fixes 11434/1234. Plusieurs profils sont suivis simultanément ; deux profils ne sont signalés comme le même compte que si une identité serveur fiable le confirme, jamais à partir du seul email masqué. Les quotas ne sont pas additionnés.

## Développer

Node 24 utilisé lors de la construction. Dans le dossier du projet :

    npm ci
    npm run dev
    npm test
    npm run typecheck
    npm run test:ui
    npm run dist

Le test navigateur utilise Microsoft Edge installé. `node scripts/smoke.cjs` exerce l'application Electron ; ajouter le chemin de `release/win-unpacked/Cypher.exe` pour la version empaquetée. `node scripts/test-native-login.cjs` teste le bouton, le terminal, l'isolation et les permissions avec un faux CLI explicitement synthétique ; aucun compte réel n'est connecté. Les répertoires de test sont isolés dans le scratch Hermes. Les réponses synthétiques n'existent que dans les tests. `QG_DATA_DIR` permet de choisir un dossier de préférences séparé (ne pas pointer vers une configuration d'un autre produit).

## English quick start

Run the portable executable, open Connections, and grant read-only access to an existing CLI session. Switch to English in Settings. Codex rate limits are implemented via the installed CLI app-server protocol; Claude currently exposes account status only. Planned providers are not connected. No browser cookies or secrets are imported. Close hides, Quit exits, Ctrl+Alt+Q toggles visibility. See SUPPORT.md and VERIFICATION.md for actual coverage and verification limits.
