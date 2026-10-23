# Vérification réelle — 2026-10-23

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

Revue indépendante effectuée. Trois régressions importantes reproduites puis corrigées avec tests RED→GREEN : dates de quota hors plage, autorisation rétablie par mises à jour concurrentes, perte des valeurs périmées lors de recréation du poller. Suite finale : 28 tests réussis et smoke empaqueté réussi. Points de finition restants : heure individuelle de lecture sur les cartes et clarification de la croix Quitter face à la fermeture native masquante. Aucun quota serveur réel vérifié.
