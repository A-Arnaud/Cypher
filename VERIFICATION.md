# Cypher 0.4.8 — vérifications du 25 octobre 2026

- `npm run typecheck` : réussi. `npm test` : 107 tests réussis dans 22 fichiers. `npm run test:ui` : 14 parcours Edge réussis, dont reprise après erreur de chargement, réponse initiale retardée, montants et devises, durée réelle des quotas et édition du raccourci au clavier.
- `npm run build:test` : exécutable de test séparé construit. `npm run test:clean-machine` : 12 contrôles réussis via Electron empaqueté, avec home vide, IPC réel et chiffrement Windows DPAPI. Sept connecteurs utilisent exclusivement des réponses HTTP synthétiques. Le remplacement d’une clé avec erreur 429 ne conserve aucun solde de l’ancien compte. Un raccourci occupé est refusé sans perdre la combinaison active ni la préférence enregistrée.
- `npm run test:corners` : quatre contrôles réussis sur la région Windows, les pixels transparents des coins, l’intérieur opaque et les transitions de vue/opacité.
- `npm audit --json` : zéro vulnérabilité signalée au moment du contrôle. `npm run security:secrets` : Gitleaks ne trouve aucun secret dans les fichiers publics ou les 16 commits examinés.
- `npm run dist` : installateur et portable 0.4.8 créés. `npm run security:release` : protections Electron, CSP, archive et scan de publication réussis. `node scripts/smoke-production-security.cjs` : le vrai binaire de production démarre dans un profil vide, refuse les injections Node et n’ouvre aucun port de débogage.
- Captures natives inspectées : [cartes API](docs/screenshots/api-details-synthetic.png) et [petit widget](docs/screenshots/api-widget-synthetic.png). Les soldes et points de ces images sont des données synthétiques. Dernier répertoire de test local : `C:/Users/Administrator/AppData/Local/Temp/cypher-clean-machine-6OeD2O`.
- Livrables : `release/Cypher-Setup-0.4.8-win-x64.exe`, `release/Cypher-0.4.8-win-x64.exe`. Empreintes SHA256 dans `release/SHA256SUMS-0.4.8.txt`.

Ces tests ont été exécutés sous Windows 10 x64. Aucun compte utilisateur n’a été autorisé, aucun quota distant réel n’a été vérifié et l’application installée en cours d’utilisation n’a pas été remplacée. Les limites de connecteurs restent celles de [SUPPORT.md](SUPPORT.md). Les exécutables restent non signés ; Windows 11, le redémarrage réel de Windows et les configurations particulières de barre des tâches n’ont pas été revalidés ici.

# Revue de securite 0.4.6

Les protections et resultats courants sont decrits dans [la revue du 24 octobre 2026](docs/security-review-2026-10-24.md), [SECURITY.md](SECURITY.md) et [PRIVACY.md](PRIVACY.md). Les paragraphes ci-dessous conservent l'historique des versions precedentes.

# Vérification réelle — 2026-10-24

## Cypher 0.4.1 — logos dans la barre

- Les initiales O/C/G sont remplacées par les logos Codex/Claude/Gemini, images locales embarquées dans l'auxiliaire natif. Dessins LobeHub sous MIT, licence distribuée ; aucun chargement réseau à l'exécution. Même réservation216px et mêmes actions de clic. Pourcentage, tiret inconnu et compteur+N conservés.
- Test RED : logos absents du build. GREEN : comparaison des pixels du vrai rendu WinForms avec les images de référence, trois fournisseurs reconnus (erreurs moyennes10.07/17.97/20.69 sous seuil22). Capture synthétique216x40 cypher-taskbar-logos.png inspectée, logos/pourcentages/+2 lisibles. Capture via PrintWindow de la surface native ; une capture du bureau pouvait montrer le fond lorsque la barre était masquée/recouverte, ce qui n'était pas un échec de rendu produit.
- npm test75/75, typecheck,6UI et npm run dist réussis. Smoke empaqueté7contrôles verts : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-smoke-SDOoi9/report.json. Clic, récupération helper et mode conservé inchangés. Pas de nouveau test de reboot réel.
- Ancienne instance portable quittée par son bouton Quitter puis version portable0.4.1 relancée normalement avec ses réglages existants. Nouveau helper actif vérifié par comparaison SHA256 avec le helper0.4.1 compilé, pas seulement par présence d'un processus. Aucun réglage de compte ou consentement modifié par cette opération.
- Installateur release/Cypher-Setup-0.4.1-win-x64.exe :114577536octets, SHA256 b67784364cb0ddbb0b65cc98d77f023b44005f651edb3f9117b224cf61aef1b6.
- Portable release/Cypher-0.4.1-win-x64.exe :114388907octets, SHA256 d323732019d036e0dcce4008c9f935adbe96537071cd57973bcc954d12273ba2.

## Cypher 0.4.0 — barre Windows

- 75 tests unitaires/subprocess et typecheck réussis ; 6 parcours UI Edge réussis. Installer NSIS par utilisateur et portable 0.4.0 construits sans signature ; audit npm zéro vulnérabilité signalée lors de la mise à jour du lockfile.
- Preuve Windows 10 réelle : GetParent de l'indicateur appartient à Shell_TrayWnd ; ReBarWindow32 et MSTaskSwWClass réduits ; météo/notifications inchangées ; largeur <=220 pixels logiques ; contexte DPI du helper égal à celui d'Explorer après SetParent. Clic Win32 reçu ; recalcul de disposition Explorer ; restauration de la géométrie à la sortie normale, arrêt brutal et EOF. Rapport C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-native-report.json. Capture synthétique cypher-taskbar-native.png inspectée : 75%/24%/tiret/+2 sont des données de test, pas des quotas utilisateur.
- Smoke installé réel : 9 contrôles réussis, rapport C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-smoke-jd6v9c/report.json. Première ouverture détaillée ; bouton d'ancrage ; fichier de préférences ; clic natif ouvre les détails ; masquer conserve l'indicateur ; auxiliaire tué -> fenêtre de secours puis réattachement ; relance avec --cypher-startup sans fenêtre principale ; retrait ; démarrage indépendant désactivé. Test sans compte autorisé et entrée Windows de test retirée ensuite, absence relue.
- Chemin d'installation de test : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-taskbar-installed. Le démarrage a été vérifié par commande exacte HKCU Run et entrée approuvée Windows. Sur cet Electron45, getLoginItemSettings renvoie args=[] et openAtLogin=false malgré la valeur Run correcte ; cette hypothèse a été reproduite. La vérification produit lit donc uniquement la commande Cypher via l'auxiliaire natif et croise le chemin et enabled retournés par Electron. Régression unitaire RED→GREEN.
- Le helper doit être hors ASAR : un premier smoke empaqueté a échoué ; asarUnpack et chemin explicite corrigés, nouveau smoke empaqueté réussi. Le test UI utilisait un port réservé par Windows (5173), remplacé par un port configurable 15173 et URLs relatives. Les attentes Electron utilisent wait-state.cjs ; les prédicats navigateur async ne sont pas fiables dans cet environnement.
- Test de secours réel réussi : auxiliaire absent au lancement avec mode ancré mémorisé -> détails visibles et erreur ; IPC taskbar non booléen refusé. Rapport scratch cypher-taskbar-failure-KmyNT1.
- Régressions empaquetées préexistantes : 18 contrôles smoke verts, dont drag/ordre, opacité/alpha255 et vingt entrées sans scroll (quota-glass-smoke-1792847436116/report.json). Login CLI synthétique empaqueté vert : qg-native-login-fixture-yk9YwC, aucun vrai compte connecté.
- Limites : aucun vrai redémarrage du PC ni arrêt d'Explorer provoqué ; aucun changement global de DPI, thème, masquage automatique ou plein écran testé ; barres secondaires/verticales et Windows11 non certifiés. L'héritage de visibilité du parent Windows n'est pas un test manuel de toutes ces configurations. Aucun quota serveur utilisateur vérifié. Revue indépendante finale effectuée : deux défauts importants reproduits puis corrigés avec tests RED→GREEN. Perte du helper pendant configuration/sauvegarde/arrêt : transaction invalidée, état précédent restauré, jamais de faux ready/hide ; échec définitif de récupération laisse les détails visibles. Réinstallation NSIS : préserver Run pendant --updated, supprimer uniquement à la vraie désinstallation. Test installé réel d'abord rouge (commande Run supprimée), puis vert après reconstruction ; nouvelle installation complète 9 contrôles également verte. Test de réinstallation final : cypher-update-data-nT9Fj7 ; vraie désinstallation vérifiée et entrée de test absente ensuite. Pas de second reviewer : correctifs vérifiés par régressions et suite complète75/75, typecheck,6UI.

- Installateur final : release/Cypher-Setup-0.4.0-win-x64.exe, 114514398 octets, SHA256 dc22e98f1b995e460887e8cd3bcead1ac4808fdf9e940388c400b87790a76bfe.
- Portable final : release/Cypher-0.4.0-win-x64.exe, 114325778 octets, SHA256 8efbba5b8cbf4ae4e47275c9c8acd396e8bc4b505ce9a4a2b5828b2c51cc3e35.
- Les installations scratch et leurs entrées de démarrage ont été retirées après test ; aucun démarrage automatique utilisateur laissé actif. L'utilisateur doit installer le livrable final pour l'activer. Le dépôt reste non commité sur feat/quota-glass.

## Cypher 0.3.0 — résumé, ordre libre et opacité pleine

- 49 tests unitaires/subprocess, 4 parcours UI Edge et typecheck réussis ; build portable réussi ; audit npm zéro vulnérabilité signalée.
- Résumé par défaut, poignées de déplacement pointer-capture, corps de ligne HTML5 et clavier haut/bas ; ordre partagé avec les cartes détaillées. Les déplacements IPC sont sérialisés depuis l'ordre courant.
- Smoke natif sur le code compilé puis deux exécutions consécutives réussies sur le binaire empaqueté : 18 contrôles chacune. Ordre réellement déplacé Claude, Gemini, Codex et relu dans les préférences isolées. Petite fenêtre 380 × 264 pour trois profils ; détails agrandis et retour vérifiés. Vingt entrées de catalogue sélectionnées tiennent sans scroll dans la disposition native adaptative, capture inspectée ; ce test n'affirme pas vingt comptes connectés.
- À 100 %, opacité native 1 et alpha intérieur du PNG à fond transparent égal à 255 ; fond CSS opaque et matériau natif none. Aperçu 55 %, préférence 68 %, refus de 0 % conservés.
- Rapports empaquetés : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/quota-glass-smoke-1792791818281/report.json et quota-glass-smoke-1792791822811/report.json. Captures widget.png, summary-many.png, settings.png, connections.png dans ces répertoires.
- Bouton de connexion empaqueté retesté avec CLI et identités synthétiques seulement : terminal du bon profil, consentement individuel, collecte synthétique, dédoublonnage et révocation indépendants réussis. Répertoire qg-native-login-fixture-UctWeZ. Tests séparés WindowsHide et transport Unicode également réussis.
- Un glisser HTML5 natif empaqueté a été intermittent ; la poignée utilise maintenant les événements pointeur avec capture, vérifiés dans les deux runs empaquetés. Une assertion de pause lisait avant la sauvegarde asynchrone : le smoke attend maintenant le vrai état IPC, sans répéter le clic.
- Portable release/Cypher-0.3.0-win-x64.exe : 102434775 octets ; SHA256 b5f57c8b6e8b625710d63c250b9f522653d8a47f8e207990fef64da2ca77b8dd. Non signé. Aucun quota réel de compte utilisateur vérifié ; limites fournisseurs inchangées. Revue finale ciblée terminée sans bug important démontré ; 12 tests ciblés supplémentaires réussis. Rapport lu : C:/Users/Administrator/AppData/Local/hermes/cache/scratch/cypher-compact-review.md. Les tests natifs précédents restent ceux exécutés par le parent ; le reviewer ne les a pas reproduits.

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
# Complément — distribution 0.4.5

Le contrôle TypeScript et 88 tests unitaires passent. Les neuf tests navigateur passent, dont la saisie masquée d’une clé, sa suppression du formulaire après envoi, l’affichage des points sans faux pourcentage et la déconnexion. Les tests des API utilisent des réponses synthétiques, sans clé de compte réelle.

`npm run test:clean-machine` vérifie l’exécutable empaqueté avec un home vide contenant des espaces, aucun CLI ni Node dans le PATH, et aucune autorisation héritée. Il exerce sept connecteurs API avec réponses HTTP simulées, le vrai IPC, le vrai chiffrement Windows DPAPI et la suppression des clés. Ce test ne certifie pas d’autres machines, Windows 11, les proxys ou les comptes de ces fournisseurs.

L’objectif de couvrir les 36 services reste en cours : voir [la matrice du catalogue](docs/catalog-coverage.md). Les services sans connecteur ne sont pas annoncés comme connectés et disposent d’un lien vers leur tableau de bord officiel. La version livrée cible Windows x64.
# Coins de fenêtre — 0.4.7

La fenêtre Windows est découpée selon le même arrondi que l’interface : 26 px en grande vue et 18 px en petit widget. Le fond implicite du canvas sombre et l’ombre CSS extérieure sont retirés dans l’application native. Les neuf tests d’interface passent. Le test `npm run test:corners` vérifie la région Windows, les quatre pixels de coin transparents, l’intérieur opaque et les transitions grande vue/petit widget/opacité à 65 %. Vérifié ici sous Windows 10 x64.
