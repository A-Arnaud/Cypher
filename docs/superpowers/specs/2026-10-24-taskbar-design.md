# Cypher — quotas dans la barre Windows

## Accord utilisateur

Approche 1 choisie explicitement : vraie intégration dans la barre des tâches, pas une fenêtre superposée. Première ouverture en grande interface ; bouton pour ranger Cypher dans la barre ; quotas compacts permanents ; clic pour ouvrir la grande interface ; choix conservé et lancement après redémarrage Windows. La météo reste intacte.

## Objectif et périmètre

Cible de livraison vérifiée : Windows 10 x64, barre principale horizontale correspondant à la capture utilisateur. Aucune promesse de compatibilité Windows 11 sans test séparé. Conserver comptes, consentements, langues FR/EN, collecte et préférences existantes. Ne pas installer de logiciel tiers dans Explorer, ne pas injecter de DLL et ne pas redémarrer Windows automatiquement.

Première ouverture d'une nouvelle installation : interface détaillée, pas le résumé. Les installations existantes conservent leur préférence de résumé jusqu'à action explicite. Bouton « Mettre dans la barre des tâches » accessible depuis les deux interfaces. Une fois activé, l'indicateur reste présent même lorsque la fenêtre détaillée est ouverte. Fermer cette dernière la masque ; Quitter termine aussi l'indicateur. Un clic sur l'indicateur affiche et focalise les détails sans désactiver l'ancrage.

## Approches

1. Intégration native à la barre : retenue par l'utilisateur. Un petit auxiliaire Windows rend l'indicateur comme enfant de la barre et réserve de la place dans la zone des applications. Les opérations de géométrie Explorer doivent être réversibles et vérifiées sur le poste ; ce n'est pas une API publique stable. La preuve native est un préalable à l'intégration produit.
2. Mini-fenêtre en surimpression : rejetée, car elle peut masquer la météo et les icônes.
3. Icône de notification seule : insuffisante, car les quotas ne seraient pas lisibles en permanence.

## Choix de construction proposés

Conserver Electron/React/TypeScript. Auxiliaire C# Windows Forms avec appels Win32, compilé via le compilateur .NET Framework présent à C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe. Pas de nouvelle dépendance npm native. Processus séparé, échanges JSON par stdin/stdout ; pas de réseau ni de chemins de profils dans le protocole. Le helper n'est pas un composant chargé dans Explorer.

Affichage : jusqu'à trois profils épinglés, dans leur ordre existant, initiale identifiable du fournisseur et pourcentage restant le plus contraignant parmi ses métriques en pourcentage. Largeur cible maximale 220 pixels logiques à 100 % DPI, ajustée au DPI Windows ; aucun défilement. En présence de profils supplémentaires, compteur +N, détails au clic. Aucun quota connu : tiret, jamais 0 % fictif. Donnée ancienne : signalement visuel et infobulle. L'infobulle distingue les profils et précise que le pourcentage affiché est le minimum des fenêtres de quota connues. Ces règles de densité sont des choix du constructeur, modifiables sur retour utilisateur.

L'auxiliaire doit signaler son attachement confirmé avant que la fenêtre se masque. Si barre non prise en charge, place insuffisante, erreur de lancement ou auxiliaire perdu : garder/réafficher la fenêtre et signaler le problème, sans prétendre être ancré. Restaurer la place réservée à la sortie et récupérer la barre recréée par Explorer sans recycler d'anciens handles. Ne pas déplacer ni désactiver la météo. Une barre verticale ou autre configuration non testée doit être refusée proprement, pas recouverte.

## Démarrage et emplacement stable

Le portable actuel extrait Electron dans un dossier temporaire ; ne jamais enregistrer ce chemin dans le démarrage Windows. Prévoir un installateur par utilisateur, sans élévation, conservant appId et emplacement des données existants. Conserver une version portable mais y expliquer que le démarrage automatique nécessite l'installation stable. L'activation de l'ancrage dans la version installée active le démarrage à la connexion Windows ; une option de réglages permet de le désactiver indépendamment.

Démarrage par connexion avec ancrage mémorisé : tenter l'indicateur sans ouvrir les détails, puis ouvrir la fenêtre si l'attachement échoue. Lancement manuel/instance suivante : ouvrir les détails. Le démarrage Windows est vérifié par lecture effective de l'enregistrement ; un vrai redémarrage du PC reste un test utilisateur si aucune autorisation de redémarrer n'est donnée.

## Validation et non-objectifs

Tests unitaires : sélection des quotas, validation/migration des réglages, états d'ancrage, erreurs et démarrage. Tests UI : première ouverture, bouton, ouverture des détails, options FR/EN. Tests natifs : parent HWND appartenant à la barre, espace réservé sans intersection météo/notification, clic véritable, fermeture/réouverture, restauration après sortie, changement DPI/géométrie dans les configurations disponibles. Test empaqueté et lancement avec les arguments réellement enregistrés au démarrage dans un dossier de données isolé.

Pas de redémarrage forcé, pas de quotas synthétiques présentés comme réels, pas de connexion automatique à de nouveaux comptes, pas de remplacement de la météo, pas de commit/push sans demande. Une intégration impossible à vérifier constitue un blocage à signaler, pas une raison de livrer la surimpression rejetée.

## Précisions après revue de faisabilité

L'attachement SetParent ne démontre pas la réservation de place. Une AppBar réserve une partie du bureau et n'est pas un substitut acceptable. La preuve doit couvrir les recalculs de disposition d'Explorer et le contexte DPI effectif après attachement interprocessus ; la faisabilité reste non démontrée à ce stade.

Les tests de récupération doivent distinguer sortie normale, processus tué, fermeture de session et Explorer recréé. Ne restaurer que la réservation encore possédée sur des handles valides ; ne jamais restaurer aveuglément la géométrie initiale. Une stratégie de supervision devra rendre l'arrêt brutal réversible, pas seulement un bloc finally.

Choix proposés au constructeur : suivre le masquage automatique et le plein écran Windows, sans forcer l'indicateur devant une application plein écran ; sa visibilité suit celle de la barre. Si la barre principale devient verticale ou indisponible, retirer proprement la réservation et afficher Cypher avec un avertissement. Les barres secondaires ne sont pas une cible de cette livraison.

Ajouter « Retirer de la barre des tâches ». Cette action ne change pas le démarrage automatique, réglable indépendamment. Seule la première activation propose/active le démarrage ; les réactivations respectent une désactivation ultérieure, y compris celle faite dans Windows. Définir l'état ancien depuis le marqueur state='stale' fourni par la collecte existante, sans inventer un second délai de péremption.

L'installateur est une proposition de distribution à confirmer : une application portable pourrait aussi enregistrer son lanceur externe stable, mais jamais l'exécutable extrait temporaire. Le choix d'installation simplifie la stabilité des mises à jour et de la désinstallation, il ne constitue pas une impossibilité universelle de l'autostart portable.
