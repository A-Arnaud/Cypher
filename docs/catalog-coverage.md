# Couverture du catalogue — 0.4.5

Objectif : couvrir tous les services du catalogue. L’objectif n’est pas encore atteint.

« Implémenté » décrit le code et les essais effectués ; il ne garantit pas un compte réel chez chaque fournisseur. Les connecteurs API ont été vérifiés avec des réponses synthétiques, le vrai IPC Electron et le chiffrement Windows. Les quotas Codex ont aussi été lus sur les comptes autorisés de ce PC. Aucun autre compte réel n’a été connecté automatiquement.

| Service | État de cette version | Travail ou accès restant |
|---|---|---|
| Codex | Compte, formule et quotas serveur | Autres versions du CLI, comptes et PC à valider |
| Claude Code | Détection, connexion et état du compte | Connecteur de quotas d’abonnement à développer |
| Gemini CLI | Détection, profils et connexion officielle | Vérification de compte et quotas à développer |
| OpenCode | Détection, facturation signalée chez le fournisseur amont | Association au compte amont à développer |
| Aider | Détection, facturation signalée chez le fournisseur amont | Association au compte amont à développer |
| Continue | Détection d’extension, fournisseur amont | Association au compte amont à développer |
| Ollama | Inventaire local après autorisation, port 11434 | Configurations personnalisées et authentifiées à ajouter |
| LM Studio | Inventaire local après autorisation, port 1234 | Configurations personnalisées et authentifiées à ajouter |
| llama.cpp | Inventaire local après autorisation, port 8080 | Configurations personnalisées et authentifiées à ajouter |
| vLLM | Inventaire local après autorisation, port 8000 | Configurations personnalisées et authentifiées à ajouter |
| Cursor | Détection | Compte et usage à développer ; distinguer compte individuel et accès administrateur d’équipe |
| Windsurf | Détection | Compte et usage à développer |
| GitHub Copilot | Détection d’extension | Authentification GitHub et usage selon compte individuel/organisation à développer |
| ChatGPT | Lien fournisseur | Aucun connecteur de quotas conversationnels vérifié ; les quotas Codex ne les remplacent pas |
| Perplexity | Lien fournisseur | Abonnement chat et usage API à étudier séparément |
| Poe | Points disponibles via clé API | Validation avec un compte réel |
| Le Chat | Lien fournisseur | Connecteur d’abonnement à développer |
| DeepSeek Chat | Lien fournisseur | Connecteur chat à développer ; le solde DeepSeek API n’est pas un quota chat |
| Grok | Lien fournisseur | Connecteur d’abonnement à développer ; distinguer la facturation xAI API |
| OpenAI API | Dépense de l’organisation depuis le début du mois UTC, clé admin | Validation avec un compte réel ; pas un solde ni un quota ChatGPT |
| Anthropic API | Dépense de l’organisation depuis le début du mois UTC, clé admin | Validation avec un compte réel ; pas un quota Claude Code |
| Google AI Studio | Lien fournisseur | Authentification Google, projet et connecteur de consommation à développer |
| OpenRouter | Budget de la clé et dépense API mensuelle | Validation avec un compte réel ; un budget de clé n’est pas le solde du compte |
| Mistral API | Lien fournisseur | Admin API Enterprise, accès non libre-service ; connecteur à développer |
| DeepSeek API | Solde et devise via clé API | Validation avec un compte réel |
| Groq | Lien fournisseur | Connecteur de compte/limites à développer |
| Together AI | Dépense mensuelle sur les jours finalisés, clé API | Validation avec un compte réel ; la journée en cours n’est pas incluse |
| Fireworks AI | Lien fournisseur | Connecteur de compte/consommation à développer |
| xAI API | Lien fournisseur | Clé de gestion, équipe et connecteur de facturation à développer |
| Cohere | Lien fournisseur | Connecteur de compte/consommation à développer |
| Hugging Face | Lien fournisseur | Connecteur de compte/consommation à développer |
| Replicate | Lien fournisseur | Connecteur de compte/consommation à développer |
| fal.ai | Solde et devise, clé avec permission billing:usage:read | Validation avec un compte réel |
| Azure OpenAI | Lien fournisseur | Authentification Azure, souscription, ressources et rôles de lecture de facturation à intégrer |
| AWS Bedrock | Lien fournisseur | Authentification AWS et accès à Cost Explorer/CloudWatch à intégrer |
| Vertex AI | Lien fournisseur | Authentification Google Cloud, projet et rôles de lecture à intégrer |

## Sources des connecteurs et restrictions vérifiées

- [Codex App Server](https://learn.chatgpt.com/docs/app-server) : lecture de compte et limites ChatGPT utilisées par Codex.
- [OpenRouter — clé courante](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key) : `limit`, `limit_remaining`, `usage_monthly`.
- [DeepSeek — solde](https://api-docs.deepseek.com/api/get-user-balance/) : montants et devise du solde API.
- [Poe — Usage API](https://creator.poe.com/docs/resources/usage-api) : points disponibles, y compris points de plan et points ajoutés.
- [OpenAI — Costs](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) : montants de coût en dollars.
- [Anthropic — Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api) : accès admin et montants en cents, distincts des abonnements Claude.
- [fal — Account Billing](https://fal.ai/docs/platform-apis/v1/account/billing) : solde, devise et permission billing:usage:read.
- [Together — Billing usage](https://docs.together.ai/reference/billing-usage) : coûts des jours finalisés et pagination, aucun solde déduit de la dépense.
- [Mistral — Admin API](https://docs.mistral.ai/admin/admin-api/overview) : Enterprise, accès à demander au fournisseur.
- [xAI — Management API](https://docs.x.ai/developers/rest-api-reference/management) : clé de gestion distincte et accès d’équipe.

## Validation de distribution

Windows x64 est la cible livrée. Le test de premier lancement utilise un home vide avec espaces, un PATH sans Node/CLI et un répertoire de préférences isolé. Il vérifie l’absence d’héritage de compte ou de consentement, l’installation guidée, les sept API avec réponses simulées et le chiffrement DPAPI sans clé en clair dans les fichiers ou l’état public. Ce test ne remplace pas des essais sur une seconde machine, Windows 11, un proxy d’entreprise ou des versions différentes des CLI.

Les clés sont saisies explicitement dans Connexions. Elles sont stockées chiffrées via Electron safeStorage et Windows DPAPI, et ne sont jamais exposées par getState. Aucun cookie navigateur ou identifiant de CLI n’est importé. Déconnecter supprime la clé enregistrée et retire le consentement. Les requêtes de ces connecteurs sont des GET sur des hôtes prédéfinis, avec redirections interdites ; aucun contenu IA n’est généré pour mesurer un solde.
