# Quota Glass

Widget Windows autonome FR / EN pour découvrir les outils IA locaux et lire les quotas réellement accessibles. Verre fumé sombre, fenêtre déplaçable, icône de notification, raccourci clavier et stockage local. Aucun compte payant n'est déduit de la simple installation.

## Lancer

Double-cliquer `release/Quota-Glass-0.1.0-win-x64.exe`. Aucun droit administrateur nécessaire. Le lancement portable extrait temporairement Electron ; patienter au premier démarrage. Application non signée : Windows peut afficher un avertissement. L'application ne télécharge pas de modèles et n'envoie aucun message IA.

L'icône près de l'horloge (parfois dans les icônes masquées) affiche/masque le widget au clic. Ctrl+Alt+Q fait de même. Le bouton de fermeture masque la fenêtre ; Quitter arrête le processus et la collecte. Masquer conserve la collecte ; Pause la suspend. La position est conservée. Le mode compact réduit les cartes. La fenêtre peut rester au premier plan.

## Connecter les données

1. Ouvrir Connexions. Les installations et traces de configuration sont détectées sans ouvrir les fichiers d'identifiants.
2. Pour Codex / Claude Code, utiliser d'abord le parcours de connexion du CLI si nécessaire (`codex login` / `claude auth login`). Ne pas transmettre de mot de passe ou de clé dans un chat.
3. Choisir « Autoriser la lecture seule » sur le service voulu. Le widget réutilise alors la session de ce CLI ; aucun secret n'est copié dans le widget.
4. Codex : lecture du compte et des fenêtres de quota ChatGPT si le serveur les expose. Un compte API n'est pas un abonnement ChatGPT.
5. Claude Code : état du compte et formule lorsque le CLI les fournit ; le quota n'est pas exposé par le connecteur de cette version.
6. Ollama / LM Studio : inventaire des modèles du service local, si installé et en cours d'exécution sur son port par défaut, après autorisation. Aucun quota cloud fictif.

Gemini CLI, Cursor, Windsurf, Copilot et les agents : détection selon les chemins connus, pas de promesse de quotas. Les autres services sont au catalogue « Prévu » : ils ne sont pas connectés. Voir SUPPORT.md pour les capacités exactes. Les agents qui utilisent un fournisseur amont ne sont pas additionnés à sa facturation.

Réglages > Langue permet Français / English. Actualisation par défaut toutes les 60 secondes ; les fournisseurs peuvent retourner des données retardées. Les erreurs conservent les dernières valeurs avec indication de péremption. Alertes aux seuils 20% / 5%, désactivables. Démarrage avec Windows désactivé dans cette version portable pour ne pas créer une entrée vers un exécutable extrait éphémère. Le flou natif dépend de Windows ; repli sombre translucide sur Windows 10.

## Données et sécurité

Préférences uniquement sous `%APPDATA%/Quota Glass/settings.json`. Une session CLI est utilisée seulement après accord par service. Aucun cookie navigateur, conversation, clé API ou jeton n'est importé. Pas de télémétrie. Aucun login automatique. Révoquer l'accès dans Connexions retire l'autorisation du widget, sans déconnecter le CLI. Supprimer les préférences réinitialise les autorisations du widget.

L'interface est sandboxée, sans Node, avec IPC validé et URLs externes prédéfinies. Le processus principal réalise les accès système. Un lanceur CLI npm inconnu est refusé. Les moteurs locaux n'acceptent que les adresses loopback fixes 11434/1234. Une identité active par CLI ; multi-compte simultané non implémenté.

## Développer

Node 24 utilisé lors de la construction. Dans le dossier du projet :

    npm ci
    npm run dev
    npm test
    npm run typecheck
    npm run test:ui
    npm run dist

Le test navigateur utilise Microsoft Edge installé. `node scripts/smoke.cjs` exerce l'application Electron ; ajouter le chemin de `release/win-unpacked/Quota Glass.exe` pour la version empaquetée. Les répertoires de test sont isolés dans le scratch Hermes. Les réponses synthétiques n'existent que dans les tests et ne sont jamais présentées comme des quotas réels. `QG_DATA_DIR` permet de choisir un dossier de préférences séparé (ne pas pointer vers une configuration d'un autre produit).

## English quick start

Run the portable executable, open Connections, and grant read-only access to an existing CLI session. Switch to English in Settings. Codex rate limits are implemented via the installed CLI app-server protocol; Claude currently exposes account status only. Planned providers are not connected. No browser cookies or secrets are imported. Close hides, Quit exits, Ctrl+Alt+Q toggles visibility. See SUPPORT.md and VERIFICATION.md for actual coverage and verification limits.
