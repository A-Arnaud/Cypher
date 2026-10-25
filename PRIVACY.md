# Données et réseau

Cypher conserve ses données sur le PC. Aucun backend Cypher, service d’analytics, envoi de logs ou crash reporter n’est configuré. Aucun cookie du navigateur personnel, conversation ou historique de messages n’est importé.

## Données locales

Les préférences vivent dans le dossier utilisateur de l’application (`%APPDATA%/Quota Glass` pour les installations existantes, sinon `%APPDATA%/Cypher`). Un emplacement personnalisé peut être choisi au lancement pour les tests.

| Fichier/dossier | Contenu |
|---|---|
| settings.json | Langue, affichage, ordre, profils autorisés et réglages ; aucune clé API |
| registry.json | Chemins des CLI et des profils ajoutés manuellement ; pas leur contenu d’authentification |
| credentials.enc.json | Clés saisies dans Cypher, chiffrées avec Windows DPAPI et liées au fournisseur |
| profiles/ | Profils créés à la demande ; les identifiants y sont gérés par le CLI officiel |
| login-scripts/ | Commandes fixes temporaires de lancement, sans clé ni token |
| login-workspaces/ | Dossiers neutres pour les connexions demandées |

Les données de quota et les comptes masqués restent en mémoire et ne sont pas mis en cache dans les préférences. Les CLI officiels peuvent gérer leurs propres fichiers d’authentification, caches et journaux dans leurs profils. Les noms de profils et domaines d’email affichés localement peuvent constituer des informations personnelles : vérifier toute capture avant de la partager.

« Déconnecter et supprimer la clé » efface la clé du stockage de Cypher et retire l’autorisation de lecture. Cela ne révoque pas la clé chez son fournisseur et ne garantit pas un effacement forensic des sauvegardes du disque. Retirer une autorisation de profil arrête sa collecte, sans déconnecter le CLI ni supprimer son compte. Pause arrête les collecteurs ; Quitter termine l’application et ses lecteurs.

La désinstallation conserve le dossier de données utilisateur pour permettre une réinstallation sans perdre les profils. Supprimer les clés depuis Connexions avant de céder un PC, et gérer séparément la déconnexion des CLI. Ne pas copier ce dossier dans le dépôt GitHub ou dans une archive de distribution.

## Destinations contactées après autorisation

| Connecteur | Destination | Données transmises |
|---|---|---|
| OpenRouter | openrouter.ai/api/v1/key | Clé OpenRouter et lecture du budget de cette clé |
| DeepSeek API | api.deepseek.com/user/balance | Clé DeepSeek et lecture du solde |
| Poe | api.poe.com/usage/current_balance | Clé Poe et lecture des points |
| OpenAI API | api.openai.com/v1/organization/costs | Clé admin et période de coût du mois UTC |
| Anthropic API | api.anthropic.com/v1/organizations/cost_report | Clé admin et période de coût du mois UTC |
| fal.ai | api.fal.ai/v1/account/billing | Clé avec permission billing:usage:read et demande de solde |
| Together AI | api.together.ai/v1/billing/usage | Clé API, mois UTC, granularité et curseurs de pagination |
| Codex | CLI officiel installé | Chemin du profil autorisé et requêtes de compte/quotas ; le CLI contacte son fournisseur |
| Claude Code | CLI officiel installé | Chemin du profil autorisé et commande auth status ; le CLI applique son fonctionnement officiel |
| Gemini | CLI officiel, seulement sur clic de connexion | Home du profil choisi ; pas de collecte automatique de quota implémentée |
| Ollama | 127.0.0.1:11434/api/tags | Lecture de la liste de modèles, sans clé cloud |
| LM Studio | 127.0.0.1:1234/v1/models | Lecture de la liste de modèles, sans clé cloud |
| llama.cpp | 127.0.0.1:8080/v1/models | Lecture de la liste de modèles, sans clé cloud |
| vLLM | 127.0.0.1:8000/v1/models | Lecture de la liste de modèles, sans clé cloud |

Les clés sont nécessairement envoyées à leur fournisseur pour s’authentifier, via HTTPS. Le fournisseur voit aussi les métadonnées normales d’une connexion, notamment l’adresse IP. Aucun prompt de génération n’est envoyé par les lecteurs. Les liens d’installation, de création de clé, de connexion et de tableau de bord s’ouvrent uniquement sur action utilisateur dans le navigateur externe.

Le trafic des services configurés, des CLI tiers et du navigateur externe n’est pas rendu anonyme par Cypher. Les variables de proxy système et les certificats d’entreprise peuvent affecter ce trafic. Ne pas partager des diagnostics bruts de ces outils sans les vérifier.

## Sources GitHub et captures

Les captures fournies dans docs/screenshots sont générées depuis l’aperçu navigateur sans accès aux CLI ou aux comptes de la machine. Les données utilisateur, environnements privés, clés de signature, dumps et rapports de test sont exclus du dépôt. Les exécutables utilisent une liste de fichiers autorisés et un contrôle séparé de l’archive produite.
