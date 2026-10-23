# Vérification réelle — 2026-10-23

## Cypher 0.3.0 — résumé, ordre libre et opacité pleine

- 49 tests unitaires/subprocess, 4 parcours UI Edge et typecheck réussis ; build portable réussi ; audit npm zéro vulnérabilité signalée.
- Résumé par défaut, poignées de déplacement pointer-capture, corps de ligne HTML5 et clavier haut/bas ; ordre partagé avec les cartes détaillées. Les déplacements IPC sont sérialisés depuis l'ordre courant.
- Smoke natif sur le code compilé puis deux exécutions consécutives réussies sur le binaire empaqueté : 18 contrôles chacune. Ordre réellement déplacé Claude, Gemini, Codex et relu dans les préférences isolées. Petite fenêtre 380 × 264 pour trois profils ; détails agrandis et retour vérifiés. Vingt entrées de catalogue sélectionnées tiennent sans scroll dans la disposition native adaptative, capture inspectée ; ce test n'affirme pas vingt comptes connectés.
- À 100 %, opacité native 1 et alpha intérieur du PNG à fond transparent égal à 255 ; fond CSS opaque et matériau natif none. Aperçu 55 %, préférence 68 %, refus de 0 % conservés.
- Rapports empaquetés : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792791818281/report.json et quota-glass-smoke-1792791822811/report.json. Captures widget.png, summary-many.png, settings.png, connections.png dans ces répertoires.
- Bouton de connexion empaqueté retesté avec CLI et identités synthétiques seulement : terminal du bon profil, consentement individuel, collecte synthétique, dédoublonnage et révocation indépendants réussis. Répertoire qg-native-login-fixture-UctWeZ. Tests séparés WindowsHide et transport Unicode également réussis.
- Un glisser HTML5 natif empaqueté a été intermittent ; la poignée utilise maintenant les événements pointeur avec capture, vérifiés dans les deux runs empaquetés. Une assertion de pause lisait avant la sauvegarde asynchrone : le smoke attend maintenant le vrai état IPC, sans répéter le clic.
- Portable release/Cypher-0.3.0-win-x64.exe : 102434775 octets ; SHA256 b5f57c8b6e8b625710d63c250b9f522653d8a47f8e207990fef64da2ca77b8dd. Non signé. Aucun quota réel de compte utilisateur vérifié ; limites fournisseurs inchangées. Revue finale ciblée en cours.

## Cypher 0.2.0 — nom, logo, opacité et workers discrets

- 44 tests unitaires/subprocess, 2 UI Edge et typecheck réussis ; audit npm zéro vulnérabilité signalée.
- SVG original D:/Projets/icon.svg conservé octet pour octet (comparaison SHA256 réussie), PNG et ICO multi-résolution générés ; nom et logo Cypher inspectés dans une capture réelle.
- Opacité native : preview 55 % sans sauvegarde, sauvegarde 68 %, refus de 0 % invisible et persistance contrôlés via le véritable BrowserWindow empaqueté. Slider UI clavier testé, FR/EN conservés.
- Codex npm lance un enfant natif sans windowsHide : source installée vérifiée. Le produit résout maintenant directement ce binaire natif, et précharge un garde seulement pour les CLI Node de lecture restants.
- Test du véritable ChildProcess natif d'un petit-enfant CLI synthétique : contrôle windowsHide=false ; worker corrigé windowsHide=true, environnement et options conservés. Aucun faux résultat de quota utilisé comme donnée utilisateur. Cela vérifie les options Windows effectives, pas une observation exhaustive de tous les CLI tiers.
- Login explicite séparé : terminal Windows via start /wait ; tous les chemins passent par l'environnement Unicode natif et le batch reste ASCII. Test natif réussi avec profil-équipe-日本 & 50%! et espace neutre Unicode. Aucun vrai login.
- Ancienne revue I1 Unicode corrigée par ce transport (la tentative chcp ne fonctionnait pas avec le starter sans console). I2 corrigé par RescanQueue et demande fresh après mutations de registre, régression de collecte en vol couverte. Action de remplacement CLI accessible après détection (ancien mineur M1).
- Smoke Cypher empaqueté : 13 contrôles réussis, rapport C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792787656189/report.json. Login IPC complet synthétique empaqueté également réussi, répertoire qg-native-login-fixture-Tc9mG7.
- Exécutable release/Cypher-0.2.0-win-x64.exe : 102433204 octets ; SHA256 acd097c006d409deb7f5278aac5a26c88121b69b963ec5c96df9b09957cf7d42. Non signé.
- Les préférences et profils historiques restent sur place ; helper de sélection de dossier testé. Aucun quota serveur réel ni session humaine vérifié par automatisation. Claude/Gemini gardent les limites documentées.
- Revue ciblée finale terminée : aucun problème critique ou important démontré. Le reviewer a refait 44 tests, 2 UI, typecheck/build et probes Unicode/concurrence avec succès, sans compte réel. Rapport : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-final-review.md. Réserve M1 de ce rapport rejetée après vérification : Connections.tsx:18 propose bien Choisir / remplacer le CLI lorsque executable est présent ; le test UI le vérifie dans ce cas. Aucun changement de code nécessaire sur ce point. Les limites de vérification de quotas réels restent inchangées.


## Mise à jour multi-profils et login terminal

- 38 tests unitaires/subprocess réussis ; typecheck réussi ; 2 parcours UI Edge réussis ; audit npm zéro vulnérabilité signalée.
- Découverte Windows réelle : profils Codex par défaut, .codex-compte1 et .codex-compte2 reconnus avec IDs distincts. Présence de configuration uniquement : pas de compte réel interrogé.
- Smoke natif empaqueté : 12 contrôles réussis, rapport C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792785673554/report.json. Raccourci de test distinct pour ne pas prendre celui d'une autre instance.
- Bouton de login testé via le véritable IPC et terminal Windows dans l'application empaquetée, avec un CLI synthétique et dossiers de test uniquement : profil sélectionné transmis, autorisation de ce seul profil, lecture de métriques synthétiques, dédoublonnage par identité et révocation indépendante vérifiés. Test scripts/test-native-login.cjs, répertoire C:/Users/Administrator/AppData/Local/hermes/cache/scratch/qg-native-login-fixture-lA8k5M. Ces métriques ne sont pas des quotas utilisateur.
- Test console Windows séparé : espaces, &, % et ! dans les chemins préservés. Aucun prompt IA ni vrai login pendant les vérifications.
- Dans le Playwright présent ici, waitForFunction(async()=>false) a résolu prématurément (reproduction Edge). Les attentes natives utilisent maintenant un polling Node d'IPC effectivement résolu ; vérifications relancées avec ce mécanisme.
- Packaging initial bloqué par l'ancienne application en cours d'exécution. Ancien processus du widget fermé, terminaux/comptes non modifiés ; rebuild réussi.
- Exécutable mis à jour au même emplacement : release/Quota-Glass-0.1.0-win-x64.exe, 102362381 octets, SHA256 f74b6ddb3784d10d062b20329753026d6801457b2d2541cacdca2cc823f966c2.
- Aucun quota serveur réel ni login OAuth utilisateur vérifié. Claude et Gemini gardent leurs limites de lecture de quotas. Revue indépendante de l'extension en cours avant clôture.

## Historique de la première livraison


- Windows 10 x64, Node 24.19.0, Electron 45.0.0.
- `npm test` : 28 tests unitaires et subprocess, tous réussis.
- `npm run typecheck` : réussi.
- `npm run test:ui` : 1 scénario réel Microsoft Edge réussi, parcours vide honnête, langue persistée et fournisseur prévu non connectable.
- `npm audit` et `npm audit --omit=dev` : zéro vulnérabilité signalée lors du contrôle.
- `npm run dist` : exécutable portable construit sans signature, icône dédiée appliquée.
- Smoke natif développement et exécutable empaqueté : 10 contrôles réussis (découverte locale, sandbox, raccourci enregistré, pause, langue FR/EN, IPC invalide refusé, connexions sans activer le consentement, fermeture masquante/réouverture, arrêt réel et persistance).
- Dernier rapport natif empaqueté : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792782484361/report.json.
- Détection réelle sur cette machine : Codex, Claude Code, Gemini CLI, OpenCode, Aider, LM Studio. Aucun compte premium déduit de cette détection.
- Exécutable portable final lancé normalement et capturé via interface Windows. Le bouton Masquer a rendu la fenêtre invisible (IsWindowVisible faux). Ctrl+Alt+Q envoyé au système l'a rendue visible (IsWindowVisible vrai). Pas uniquement un enregistrement théorique du raccourci.
- Le lanceur portable auto-extractible n'est pas pilotable directement par le débogueur Playwright : tentative expirée. Alternative vérifiée : tests automatisés sur win-unpacked + lancement normal du portable + capture/interaction natives. Ce timeout ne constitue pas un test réussi.
- Captures de l'application empaquetée dans docs/screenshots/ : widget.png, settings.png, connections.png. Référence verre fumé et repli Windows 10 inspectés visuellement ; le contenu défile lorsqu'il dépasse la fenêtre.

## Limites à ne pas confondre avec des succès

Aucun accès authentifié de compte activé par les tests. Aucun quota serveur réel vérifié. Le test subprocess Codex utilise un compte synthétique uniquement dans tests/cli.test.ts ; il vérifie les échanges initialize/account/read/account/rateLimits/read, pas l'abonnement de l'utilisateur.
Codex : connecteur de quota implémenté, à autoriser puis vérifier avec le compte utilisateur. Claude : compte/formule seulement ; Gemini et la majorité du catalogue : pas de quota opérationnel. Inventaire des moteurs locaux non vérifié contre un serveur actif.
Icône de notification créée sans erreur ; clic de menu tray non automatisé sur le portable. Notifications de seuil testées dans la logique, pas de notification réelle déclenchée pour ne pas inventer un quota.
Démarrage Windows désactivé, une identité active par CLI, pas de saisie de clé API, pas de signature de code.

Revue indépendante effectuée. Trois régressions importantes reproduites puis corrigées avec tests RED→GREEN : dates de quota hors plage, autorisation rétablie par mises à jour concurrentes, perte des valeurs périmées lors de recréation du poller. Suite finale : 28 tests réussis et smoke empaqueté réussi. Points mineurs différés : redémarrage nécessaire pour découvrir un outil installé après lancement ; heure individuelle de lecture sur les cartes ; clarification de la croix Quitter face à la fermeture native masquante. Le fichier VERIFICATION.md, absent du commit examiné, est désormais versionné. Aucun quota serveur réel vérifié.
