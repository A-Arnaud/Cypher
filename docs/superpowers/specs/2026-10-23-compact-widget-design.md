# Cypher — aperçu compact, ordre libre et opacité réelle

Demande explicite : choisir librement l'ordre des profils Codex/Claude/etc., afficher les profils épinglés dans un petit widget sans défiler, réserver l'interface actuelle aux détails, rendre 100 % réellement opaque.

Choix : résumé par défaut, une ligne par profil épinglé avec nom, libellé de profil et quotas disponibles ; aucune jauge inventée. Poignée glisser-déposer et déplacement clavier, ordre sauvegardé et partagé avec la vue détaillée. Épingler/désépingler reste dans Connexions. Bouton Détails ouvre la grande interface existante ; Réglages accessible directement ; bouton retour au widget. Hauteur de fenêtre adaptée au nombre de lignes et à l'écran, deuxième colonne si nécessaire. Aucun système ne peut afficher un nombre illimité de profils lisibles sur un petit écran : un repli de défilement de sécurité reste permis uniquement au-delà de la capacité physique ; les jeux 3/6/12 profils usuels doivent tenir sans scroll sur un écran standard.

Mode résumé conservé dans les préférences, par défaut même pour les anciennes préférences sans ce champ. Les changements d'ordre se font dans la file main depuis la liste courante, pas à partir d'un ancien tableau renderer. Les dimensions sont dérivées côté main, aucune taille arbitraire via IPC.

Cause de la transparence : CSS du shell avec alpha et material acrylic toujours actif, même quand setOpacity(1). Remplacer l'acrylique par none et ajouter un fond intérieur opaque ; seul le contrôle natif règle la transparence globale. Les arrondis extérieurs restent transparents, pas le contenu à 100 %. Préserver logo, comptes, consentements et absence de console de collecte.

Vérifications : ordre immuable et exact, disposition bornée écran, DnD/clavier/retour détails, absence de scroll avec profils usuels, opacité CSS+alpha intérieur à 100 %, application native des dimensions, persistance réelle et portable testé.
