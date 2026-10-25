# Cypher 0.4.8 — 25 octobre 2026

- Les cartes détaillées affichent les soldes, devises, dépenses et points, y compris les valeurs nulles. Le petit widget et les cartes utilisent les mêmes formats de nombres et de durées de quota.
- L’heure de dernière lecture correspond aux métriques des profils épinglés. Les entrées du catalogue et les échecs de lecture ne la font plus avancer artificiellement.
- Une erreur temporaire conserve les dernières valeurs et son motif précis. Une session refusée ou une identité différente efface les anciennes métriques. Remplacer une clé API efface le solde de l’ancien compte avant la nouvelle collecte.
- Un raccourci déjà occupé est refusé sans perdre le raccourci actif ni enregistrer la combinaison indisponible. Les modificateurs répétés sont refusés ; le formulaire explique le format et accepte la touche Entrée.
- Une erreur de chargement propose de réessayer. Une réponse initiale retardée ne peut plus remplacer un état plus récent.
- Un champ de préférences corrompu ne réinitialise plus les autres réglages valides. Les autorisations invalides restent désactivées et la validation IPC reste stricte.
- Recherche tolérante aux espaces et à la casse, indication accessible de la navigation et des filtres, focus visible et meilleure adaptation aux petits écrans.
- Les tests navigateur choisissent un port disponible sous Windows. La version affichée et l’installateur de test suivent la version du projet.

Les capacités et limites des fournisseurs restent détaillées dans [SUPPORT.md](SUPPORT.md). Les validations de cette version sont consignées dans [VERIFICATION.md](VERIFICATION.md).
