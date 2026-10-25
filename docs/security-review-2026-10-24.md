# Revue de sécurité locale — 24 octobre 2026

Version examinée et construite : 0.4.6. Cible : Windows 10 x64 de cette machine. Cette revue de code et ces tests ne constituent pas un audit indépendant ni une certification d’absence de faille.

## Changements apportés

| Surface | Résultat |
|---|---|
| Interface Electron | Sandbox, isolation, absence de Node et de webview conservées ; session en mémoire ; permissions et navigation refusées |
| Réseau du renderer | CSP de production connect-src none et form-action none ; contrôle séparé des requêtes dans la session ; aucun accès aux fichiers hors du renderer empaqueté |
| Sous-processus CLI | Environnement filtré, sans clés/tokens ambiants, options Node ou overrides des autres profils ; dossier de travail neutre |
| Exécution et débogage Electron | RunAsNode, NodeOptions et NodeCliInspect désactivés dans la distribution ; retrait des switches de débogage Chromium |
| Intégrité de l’application | Intégrité ASAR et chargement ASAR uniquement activés ; liste de fichiers distribués explicite, sans node_modules et sans diagnostics |
| Clés API | Chiffrement DPAPI sans backend faible de secours ; enveloppe chiffrée liée au fournisseur ; aucune valeur de clé dans l’état public |
| Réponses fournisseur/serveur local | Taille limitée pendant le téléchargement ; redirections interdites ; délais et pagination bornés |
| Documentation | Captures régénérées sans compte ni CLI ; SECURITY.md et PRIVACY.md ajoutés ; limites et destinations documentées |
| GitHub | Workflow Windows, scans de secrets, audit npm, tests et vérification d’artefact ; actions épinglées par SHA, permissions contents:read ; suivi Dependabot |

## Vérifications exécutées

- TypeScript : succès.
- Tests unitaires : 92 succès, dont filtrage d’environnement, refus de ciphertext transféré entre fournisseurs, backend de chiffrement faible et interruption d’un corps HTTP trop volumineux.
- Tests d’interface : 9 succès.
- Exécutable de test séparé : premier lancement sans Node/CLI dans le PATH et sans compte ; vrai IPC, vrai DPAPI, sept API simulées ; aucune clé en clair dans le stockage ou l’état public ; déconnexion vérifiée.
- Tentatives de sortie depuis le renderer : fetch et image vers un serveur témoin local refusés, zéro requête reçue.
- Exécutable de production : démarrage avec profil vide ; tentatives via ELECTRON_RUN_AS_NODE et NODE_OPTIONS sans exécution du code injecté ; aucun port de débogage ouvert.
- Fuses et CSP vérifiés dans l’exécutable et l’archive de production.
- Audit npm : zéro vulnérabilité connue signalée à la date de la vérification.
- Gitleaks 8.30.1 officiel, archive vérifiée par SHA-256 : aucun secret reconnu dans les fichiers publiables et les 16 commits de l’historique.
- Scan complémentaire local : aucun motif de secret ou fichier de compte dans les sources, les 172 blobs historiques contrôlés et l’archive produite.
- Inspection des captures de documentation : aucune identité de compte réelle affichée ; les nouvelles captures proviennent de l’aperçu sans compte.

Les résultats Gitleaks bruts, même expurgés, et les artefacts de test restent dans des dossiers locaux exclus de Git. Les empreintes des deux exécutables de distribution sont dans release/SHA256SUMS-0.4.6.txt. Aucun dépôt GitHub n’a été créé, modifié ou publié pendant cette revue. La CI est préparée mais n’a pas encore été exécutée sur les serveurs GitHub.

## Limites et suite

DPAPI ne protège pas contre un processus malveillant exécuté sous le même utilisateur Windows. Les clés existent en mémoire pendant l’authentification. Les fournisseurs reçoivent nécessairement la clé qui leur est destinée et l’IP du client. Les CLI tiers et leurs configurations ne sont pas confinés par un pare-feu Cypher. Aucun cookie personnel n’est collecté et aucun navigateur de connexion intégré n’est livré.

Les anciens enregistrements de clés non liés au fournisseur demandent une nouvelle saisie dans Connexions ; les identifiants des CLI ne sont pas réécrits. Les exécutables restent sans signature Authenticode. Une revue indépendante, des essais sur d’autres PC/versions de Windows et la validation des connecteurs avec leurs comptes réels restent à faire. Les scans automatiques ne détectent ni tous les secrets possibles ni toutes les vulnérabilités.

Références : [recommandations Electron](https://www.electronjs.org/docs/latest/tutorial/security), [safeStorage et frontière DPAPI](https://www.electronjs.org/docs/latest/api/safe-storage), [Gitleaks officiel](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1).
