# Capacités et limites — version initiale

## Distribution Windows — 0.4.5

Les exécutables distribués ciblent Windows x64. Le runtime de l’application est inclus : Node.js n’est pas nécessaire pour ouvrir Cypher. Chaque utilisateur doit installer les CLI des services qu’il souhaite connecter, puis autoriser ses propres profils dans Connexions. Aucun compte du développeur n’est inclus dans la distribution.

La détection ignore les lanceurs npm cassés et poursuit la recherche d’une installation valide. Claude Desktop n’est pas considéré comme le CLI Claude Code. Les serveurs Ollama et LM Studio peuvent être autorisés même sans CLI installé sur le PC, sur leurs adresses loopback prédéfinies.

Le test `npm run test:clean-machine`, après construction, lance l’exécutable avec un profil utilisateur vide et un PATH sans Node ni CLI. Il vérifie le démarrage, l’absence de compte/consentement hérité, les liens d’installation et l’accès proposé aux serveurs locaux. Il simule un premier lancement sur ce Windows ; il ne certifie pas un autre PC, Windows 11, les proxys d’entreprise ou tous les antivirus.

Les quotas Codex sont implémentés. Poe, DeepSeek API, OpenRouter et fal.ai disposent de lectures de points/solde/budget par clé API. Together AI lit les dépenses sur les jours finalisés du mois. OpenAI API et Anthropic API disposent de lectures de dépenses d’organisation par clé administrateur. Ces clés explicites sont chiffrées via Windows DPAPI. Les connecteurs API ont été testés avec des réponses simulées ; la validation sur leurs comptes réels reste à faire.

Les quotas Claude et Gemini et les connexions des services marqués « Prévu » restent à développer. Une connexion disponible ne signifie pas que le quota du service est accessible. Voir la [matrice complète du catalogue](docs/catalog-coverage.md) pour les 36 services, leurs accès et les travaux restants.

Aucun fournisseur n'est présenté comme universellement connecté. Les sources ci-dessous sont implémentées ; les comptes de ce PC ne sont pas interrogés avant accord dans Connexions.

| Service | Détection | Compte / formule | Quota |
|---|---|---|---|
| Codex CLI | PATH, npm, extension VS Code | `codex app-server`, `account/read`, après accord | `account/rateLimits/read`, fenêtres serveur si abonnement ChatGPT et réponse disponible |
| Claude Code | PATH, npm, extension VS Code | `claude auth status --json`, après accord | Non accessible par API publique implémentée ; ouvrir Claude Usage |
| Gemini CLI | PATH, npm ; profils via home/.gemini | Login terminal officiel, vérification serveur de compte non implémentée | Non implémenté ; ne pas confondre AI Studio et abonnement Gemini |
| OpenCode / Aider / Continue | Installation/configuration selon outil | Fournisseur amont | Pas de quota propre ni double comptage |
| Ollama / LM Studio | CLI et chemins connus | Sans compte cloud | Inventaire local via API loopback après accord ; pas de faux quota |
| llama.cpp / vLLM | Serveur local sur port par défaut | Sans compte cloud | Inventaire local via API loopback après accord |
| Poe / DeepSeek API / OpenRouter | Sans CLI requis | Clé API explicite | Points Poe, solde DeepSeek, budget de clé et dépense mensuelle OpenRouter |
| OpenAI API / Anthropic API | Sans CLI requis | Clé administrateur explicite | Dépense d’organisation depuis le début du mois UTC, distincte d’un quota d’abonnement |
| fal.ai / Together AI | Sans CLI requis | Clé API avec permissions de facturation adaptées | Solde fal ; coûts Together sur les jours finalisés du mois UTC |
| Cursor / Windsurf / Copilot | CLI/app/extension selon produit | Non implémenté | Non implémenté |
| Autres entrées du catalogue | Catalogue seulement | Prévu | Prévu |

Source protocole Codex vérifiée sur le CLI installé via `codex app-server generate-ts`, notamment RateLimitWindow, RateLimitSnapshot, GetAccountRateLimitsResponse et Account. Protocole expérimental : les évolutions peuvent demander une mise à jour. Aucune requête de génération n'est faite. Aucune utilisation de cookies ou endpoints privés cloud.
Les lectures en arrière-plan lancent les points d'entrée Node connus, sans shell. La connexion à la demande ouvre un terminal Windows via un script à commandes fixes et chemins validés/échappés. Aucun texte de commande arbitraire reçu du renderer. Un launcher npm inconnu est refusé. Un fichier de configuration seul n'établit jamais une installation ni un abonnement.
Les quotas ChatGPT conversationnels ne sont pas les quotas Codex. Les chiffres locaux d'activité ne remplacent pas le quota serveur. Les API facturées restent distinctes des abonnements chat.

FR/EN disponibles. Plusieurs profils Codex/Claude/Gemini sont gérés avec autorisations indépendantes. Détection bornée des répertoires Codex/Claude standards et suffixés, overrides d'environnement et registre manuel. Gemini utilise un home qui contient .gemini ; ses emplacements personnalisés peuvent être ajoutés manuellement. Les profils gérés par le widget sont retrouvés grâce à registry.json. Ajouter un compte crée un nouveau dossier, sans copie des identifiants d'un autre profil. Aucun login sans clic ; le parcours officiel reste sous contrôle humain. Les limites de quota Claude/Gemini ne changent pas du seul fait que leur login est accessible.

Vérification finale et limites de la machine : voir VERIFICATION.md généré lors de la livraison.
