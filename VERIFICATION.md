# Vérification réelle — 2026-10-23

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
