# Capacités et limites — version initiale

Aucun fournisseur n'est présenté comme universellement connecté. Les sources ci-dessous sont implémentées ; les comptes de ce PC ne sont pas interrogés avant accord dans Connexions.

| Service | Détection | Compte / formule | Quota |
|---|---|---|---|
| Codex CLI | PATH, npm, extension VS Code | `codex app-server`, `account/read`, après accord | `account/rateLimits/read`, fenêtres serveur si abonnement ChatGPT et réponse disponible |
| Claude Code | PATH, npm, extension VS Code | `claude auth status --json`, après accord | Non accessible par API publique implémentée ; ouvrir Claude Usage |
| Gemini CLI | PATH, npm ; profils via home/.gemini | Login terminal officiel, vérification serveur de compte non implémentée | Non implémenté ; ne pas confondre AI Studio et abonnement Gemini |
| OpenCode / Aider / Continue | Installation/configuration selon outil | Fournisseur amont | Pas de quota propre ni double comptage |
| Ollama / LM Studio | CLI et chemins connus | Sans compte cloud | Inventaire local via API loopback après accord ; pas de faux quota |
| Cursor / Windsurf / Copilot | CLI/app/extension selon produit | Non implémenté | Non implémenté |
| Autres entrées du catalogue | Catalogue seulement | Prévu | Prévu |

Source protocole Codex vérifiée sur le CLI installé via `codex app-server generate-ts`, notamment RateLimitWindow, RateLimitSnapshot, GetAccountRateLimitsResponse et Account. Protocole expérimental : les évolutions peuvent demander une mise à jour. Aucune requête de génération n'est faite. Aucune utilisation de cookies ou endpoints privés cloud.
Les lectures en arrière-plan lancent les points d'entrée Node connus, sans shell. La connexion à la demande ouvre un terminal Windows via un script à commandes fixes et chemins validés/échappés. Aucun texte de commande arbitraire reçu du renderer. Un launcher npm inconnu est refusé. Un fichier de configuration seul n'établit jamais une installation ni un abonnement.
Les quotas ChatGPT conversationnels ne sont pas les quotas Codex. Les chiffres locaux d'activité ne remplacent pas le quota serveur. Les API facturées restent distinctes des abonnements chat.

FR/EN disponibles. Plusieurs profils Codex/Claude/Gemini sont gérés avec autorisations indépendantes. Détection bornée des répertoires Codex/Claude standards et suffixés, overrides d'environnement et registre manuel. Gemini utilise un home qui contient .gemini ; ses emplacements personnalisés peuvent être ajoutés manuellement. Les profils gérés par le widget sont retrouvés grâce à registry.json. Ajouter un compte crée un nouveau dossier, sans copie des identifiants d'un autre profil. Aucun login sans clic ; le parcours officiel reste sous contrôle humain. Les limites de quota Claude/Gemini ne changent pas du seul fait que leur login est accessible.

Vérification finale et limites de la machine : voir VERIFICATION.md généré lors de la livraison.
