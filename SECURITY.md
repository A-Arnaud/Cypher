# Sécurité

Cypher est une application Windows locale. Elle ne possède pas de serveur central, de télémétrie applicative ou de mécanisme de téléversement des comptes. « Local » ne signifie pas « hors ligne » : après autorisation, les lectures de quotas contactent le fournisseur concerné. Le navigateur externe peut aussi être ouvert à la demande pour une connexion ou un tableau de bord. Les destinations et les données conservées sont décrites dans [PRIVACY.md](PRIVACY.md).

## Protections implémentées

- Renderer sandboxé, isolation de contexte et Node désactivé. Aucune API de fichiers, shell, déchiffrement ou IPC arbitraire n’est exposée à l’interface.
- L’interface de production charge ses fichiers locaux. Sa CSP bloque les connexions réseau, formulaires, sous-cadres, workers et plugins. Une seconde règle dans la session Electron bloque les requêtes externes et l’accès aux fichiers hors de l’interface empaquetée. La session Chromium de l’interface est en mémoire.
- Navigation, nouvelles fenêtres, webviews et permissions refusées. Chaque commande IPC contrôle l’expéditeur, sa fenêtre, sa frame et ses arguments. Les liens ouverts par le processus principal viennent de listes fixes.
- Clés API saisies explicitement et chiffrées via Windows DPAPI. Aucun stockage en clair de secours. L’enveloppe chiffrée lie chaque clé à son fournisseur pour refuser la réutilisation d’un ciphertext déplacé vers un autre connecteur. Les clés ne sont jamais renvoyées dans l’état public ou la console.
- Les collecteurs API font des GET vers des URL prédéfinies, sans suivre de redirection. Les lectures locales se limitent à des adresses loopback fixes. Les corps JSON sont bornés pendant leur réception et les requêtes ont un délai limite.
- Les CLI utilisent des commandes fixes, sans prompt de génération. Leur environnement ne reprend pas les clés API, tokens, variables d’autres profils ou options d’injection Node du processus parent. Les lectures s’exécutent dans un dossier neutre ; les réglages de télémétrie documentés sont désactivés dans les lecteurs Codex et Claude sans modifier la configuration enregistrée de l’utilisateur.
- La distribution désactive les fuses Electron RunAsNode, NodeOptions et NodeCliInspect, et active le chiffrement des cookies, l’intégrité ASAR et le chargement depuis ASAR uniquement. La version de test est séparée et n’est pas destinée à la distribution.
- La liste des fichiers empaquetés est explicite. Les scans des sources, de l’historique Git et des archives ne doivent trouver aucun fichier de compte ou secret reconnu avant publication.

## Limites à connaître

Ces mesures ne constituent pas une garantie d’absence de faille. DPAPI protège les données au repos contre d’autres comptes Windows ; il ne protège pas contre un malware ou un administrateur exécuté dans la même session, un Windows compromis, une capture d’écran ou une lecture de mémoire. La clé existe temporairement en mémoire pour être envoyée à son fournisseur. La saisie d’une clé administrateur donne accès aux données d’organisation que cette clé autorise : privilégier les permissions de lecture les plus limitées disponibles.

Les CLI et leurs configurations appartiennent à l’utilisateur. Ils peuvent effectuer leurs propres opérations réseau ; Cypher ne constitue pas un pare-feu pour un exécutable compromis ou une configuration tierce. Les proxys et autorités de certification fournis explicitement par l’environnement système restent une frontière de confiance. Cypher ne désactive pas la validation TLS.

Les exécutables actuels ne sont pas signés Authenticode. L’intégrité ASAR n’équivaut pas à une signature de l’éditeur : elle ne prouve pas à elle seule l’origine d’un téléchargement. Comparer les SHA-256 publiés depuis un dépôt de confiance. Ne pas exécuter une compilation inconnue avec des droits administrateur.

Le durcissement peut demander de ressaisir les clés API enregistrées dans une ancienne version dont l’enveloppe n’était pas liée au fournisseur. Les profils CLI ne sont pas modifiés. Les modes de connexion navigateur intégrés ne sont pas implémentés ; les cookies du navigateur personnel ne sont pas collectés.

## Vérifications avant publication

Sur Windows x64 avec Node.js installé pour développer :

```powershell
npm ci
npm run typecheck
npm test
npm run test:ui
npm run security:scan
npm run security:secrets
npm audit --audit-level=moderate
npm run build:test
npm run test:clean-machine
npm run dist
npm run security:release
```

Le test de premier lancement utilise uniquement des profils vides et des réponses API synthétiques. Ne pas publier `test-results`, `.local-builds`, `.security-tools`, les rapports de diagnostic, les préférences, le registre des profils ou un dossier de données utilisateur. Publier les sources vérifiées avec Git et, si souhaité, les installateurs/portables de `release` accompagnés de leurs empreintes. La CI Windows exécute ces contrôles avec un token GitHub en lecture seule et n’envoie aucun secret à l’application.

Un scan de motifs ou de dépendances ne couvre pas tous les types de secrets ni toutes les failles. Une revue indépendante et des essais sur d’autres machines restent nécessaires avant de revendiquer un audit externe ou une compatibilité générale.

## Signaler un problème

Utiliser l’onglet Security du dépôt GitHub et « Report a vulnerability » si le signalement privé y est activé. Ne pas joindre de clé, token, code de connexion, fichier auth.json, cookie, dump mémoire ou capture contenant un compte. Si un secret a été publié, le révoquer chez son fournisseur ; l’effacer du dernier commit ne suffit pas à le retirer de l’historique et des copies existantes.

Références : [sécurité Electron](https://www.electronjs.org/docs/latest/tutorial/security), [limites de safeStorage](https://www.electronjs.org/docs/latest/api/safe-storage).
