# ADDENDUM AU PROMPT MAÎTRE RADIOOS — SYSTÈME DE DESIGN, DIMENSIONNEMENT ET COHÉRENCE VISUELLE

Ce document complète le prompt maître RadioOS et l'addendum sécurité/différenciation déjà transmis. Applique ces règles à tout écran, composant ou page créé, sans exception. Aucun écran ne doit être construit avec des valeurs de couleur, taille ou espacement improvisées : tout doit provenir du système de design défini ci-dessous.

Ne jamais commencer à coder un écran avant d'avoir défini quels tokens de ce système il utilise.

---

## A. PRINCIPE GÉNÉRAL

RadioOS doit avoir une identité visuelle propre et reconnaissable, pas l'apparence d'un template générique. Avant de choisir les couleurs et typographies définitives, produis d'abord un plan de design compact (palette nommée en hexadécimal, typographies par rôle, concept de mise en page, élément signature) et vérifie qu'il n'est pas le choix par défaut que produirait n'importe quel SaaS. Ensuite seulement, code en suivant ce plan.

Une fois le système choisi, il devient une règle stricte : plus aucune valeur de couleur, taille de police, espacement ou rayon ne doit être écrite en dur dans un composant. Tout passe par des tokens (variables CSS, thème Tailwind, ou équivalent).

---

## B. COHÉRENCE DES COULEURS

### B.1 Palette limitée et nommée
Définir une palette de 4 à 6 couleurs nommées avec leur valeur hexadécimale exacte, par exemple :
- `--color-primary`
- `--color-secondary` ou `--color-accent`
- `--color-background`
- `--color-surface` (cartes, panneaux)
- `--color-text-primary`
- `--color-text-secondary`

Ajouter séparément les couleurs sémantiques, distinctes de la palette de marque :
- `--color-success` (validation, campagne active, flux connecté)
- `--color-warning` (abonnement expirant, latence élevée)
- `--color-danger` (flux hors ligne, erreur, suppression)
- `--color-info` (notification neutre)

Ces couleurs sémantiques ne doivent jamais être réutilisées comme couleur de marque, et inversement. Un statut "erreur" doit être rouge partout dans l'application, sans exception ni variante locale.

### B.2 Contraste et accessibilité
Tout texte sur fond coloré doit respecter un ratio de contraste minimum de 4.5:1 (WCAG AA) pour le texte courant, 3:1 pour le texte large (≥ 24px ou gras ≥ 19px). Vérifier systématiquement le contraste des badges de statut (PENDING, ACTIVE, REJECTED, etc.), qui sont souvent oubliés.

### B.3 Dark mode (si activé)
Si un mode sombre est prévu, ne jamais inverser bêtement les couleurs. Définir un jeu de tokens séparé (`--color-background-dark`, etc.) avec des couleurs de surface légèrement désaturées, pas de noir pur (#000) ni de blanc pur (#FFF) pour le texte, pour éviter la fatigue visuelle.

### B.4 Utilisation cohérente par contexte
- Une seule couleur d'accent pour les actions principales (CTA, boutons primaires) dans toute l'application.
- Les liens ont toujours la même couleur, dans le dashboard comme sur la page publique.
- Les graphiques (analytics, audience) utilisent une palette de données dédiée (3 à 5 couleurs distinctes, daltonisme-friendly), séparée de la palette d'interface, pour ne pas confondre "couleur de marque" et "couleur de série de données".

---

## C. ÉCHELLE TYPOGRAPHIQUE

Définir une échelle de tailles fixe et s'y tenir strictement (aucune taille de police arbitraire type `font-size: 13.5px`) :

| Rôle | Taille | Usage |
|---|---|---|
| `display` | 32–40px | Titres de landing page uniquement |
| `h1` | 28px | Titre de page (dashboard, section) |
| `h2` | 22px | Titre de section/carte |
| `h3` | 18px | Sous-titre, en-tête de tableau |
| `body` | 15–16px | Texte courant |
| `body-sm` | 13–14px | Texte secondaire, légendes |
| `caption` | 12px | Métadonnées, timestamps, labels de badge |

Deux familles de police maximum : une pour les titres/interface, une pour le corps de texte si distincte. Jamais plus de 2 graisses différentes visibles sur un même écran (ex. regular + semibold), pour éviter l'effet "surchargé".

Hauteur de ligne : 1.4–1.6 pour le texte courant, 1.1–1.25 pour les titres. Ne jamais laisser un texte sans `line-height` défini explicitement.

---

## D. ESPACEMENT ET GRILLE — RÈGLES ANTI-DÉBORDEMENT

### D.1 Échelle d'espacement unique
Utiliser exclusivement une échelle en base 4 ou 8px pour tous les paddings, marges et gaps :
```
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 (px)
```
Aucune valeur hors de cette échelle. Cela évite les micro-décalages visuels entre composants faits par des développeurs différents.

### D.2 Conteneurs et largeur maximale
- Toute page de contenu (dashboard, formulaires) a une largeur maximale de contenu (`max-width: 1280px` ou équivalent) centrée, avec padding latéral fluide (`clamp()` ou breakpoints), pour éviter des lignes de texte trop longues sur écran large (point 28 du prompt maître : écrans 21:9).
- Les cartes de dashboard ne doivent jamais imposer une largeur fixe en pixels : utiliser `min-width` + `flex-grow` ou une grille CSS avec `minmax()`, pour s'adapter sans déborder ni s'écraser.

### D.3 Débordement de texte
Règle stricte pour tout texte dynamique (nom de radio, titre de podcast, message auditeur, nom d'annonceur) :
- Une seule ligne autorisée → `text-overflow: ellipsis` avec `overflow: hidden` et `white-space: nowrap`, jamais de texte qui pousse la mise en page.
- Plusieurs lignes autorisées → `-webkit-line-clamp` avec un nombre de lignes fixe défini par composant (ex. description de podcast : 3 lignes max), jamais de hauteur de carte qui varie selon la longueur du contenu dans une grille.
- Ne jamais faire confiance à la longueur du contenu utilisateur : tester systématiquement avec un texte anormalement long (nom de radio de 60 caractères, message de 500 mots) avant de valider un composant.

### D.4 Tableaux et listes de données
- Colonnes de tableau avec largeur minimale définie ; au-delà d'un certain nombre de colonnes sur mobile, basculer en vue carte empilée plutôt que forcer un scroll horizontal permanent.
- Pagination obligatoire au-delà de 25-50 lignes ; jamais de liste qui charge un nombre non borné d'éléments dans le DOM.
- Les valeurs numériques (auditeurs, revenus, pourcentages) doivent être alignées à droite avec une largeur de colonne fixe, pour éviter que les chiffres "sautent" visuellement à chaque rafraîchissement temps réel.

### D.5 Éléments interactifs — taille minimale
- Zone cliquable minimale de 44×44px pour tout bouton, icône cliquable ou item de menu, y compris sur desktop, pour l'accessibilité et l'usage tactile sur tablette.
- Espacement minimum de 8px entre deux éléments cliquables adjacents pour éviter les clics accidentels (ex. boutons APPROVED/REJECTED d'une dédicace).

### D.6 Cartes de dashboard (KPI)
Format standardisé pour toutes les cartes de métriques (auditeurs actuels, pic du jour, durée moyenne, etc.) :
- Hauteur fixe identique pour toutes les cartes d'une même rangée.
- Label toujours en `caption` ou `body-sm`, valeur toujours en une taille de titre cohérente (`h2` ou `h1` selon densité), variation (+18,4 %) toujours en `body-sm` avec la couleur sémantique correspondante (vert si positif, rouge si négatif — sauf métriques où une baisse est positive, comme le taux d'incident, à documenter explicitement).
- Ne jamais laisser un nombre à forte variation (ex. passage de 1 284 à 128 400) casser la mise en page : prévoir un formatage compact (1,28 M) au-delà d'un seuil défini.

---

## E. RESPONSIVE — POINTS DE RUPTURE STANDARDISÉS

Définir des breakpoints fixes et les utiliser partout, jamais de media query ad hoc :
```
mobile   : < 640px
tablet   : 640–1024px
laptop   : 1024–1440px
desktop  : 1440–1920px
large    : > 1920px (écrans 21:9 et au-delà)
```

Règles par palier :
- **Mobile** : sidebar transformée en menu tiroir (drawer) ou barre de navigation basse, jamais de sidebar fixe qui réduit l'espace de contenu utile.
- **Tablet** : sidebar réductible en icônes seules, contenu en une colonne pour les formulaires, deux colonnes maximum pour les grilles de cartes.
- **Laptop/Desktop** : grille de cartes en 3-4 colonnes maximum, jamais de grille qui s'étire à l'infini en largeur.
- **Large (21:9 et ultra-wide)** : ne jamais laisser le contenu s'étirer pleine largeur ; conserver le `max-width` de la section D.2 et centrer, quitte à ajouter une zone secondaire (aperçu, détail) plutôt que d'étirer les composants existants.

---

## F. COMPOSANTS — RÈGLES DE COHÉRENCE

- **Rayons de bordure** : une seule valeur de `border-radius` pour les boutons/inputs, une seule autre pour les cartes/modales. Ne jamais mélanger plus de 2 valeurs de rayon dans toute l'application.
- **Ombres** : définir 2-3 niveaux d'élévation maximum (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) réutilisés partout, jamais d'ombre custom par composant.
- **États des boutons** : chaque style de bouton (primaire, secondaire, danger, ghost) doit avoir ses 4 états définis une seule fois et réutilisés partout : `default`, `hover`, `active`, `disabled`, `loading`. Un bouton "disabled" doit toujours avoir la même opacité/couleur dans toute l'application.
- **Badges de statut** : une seule taille de badge dans toute l'application, une seule combinaison couleur/forme par statut métier (PENDING, ACTIVE, REJECTED, APPROVED, PLAYED, etc. — cohérent entre dédicaces, campagnes, tickets support).
- **Icônes** : une seule bibliothèque d'icônes pour tout le produit, une seule taille par contexte (ex. 16px dans les tableaux, 20px dans la navigation), jamais de mélange de styles d'icônes (ligne fine vs rempli) sur un même écran.
- **Focus clavier visible** : chaque élément interactif doit avoir un indicateur de focus visible (contour ou halo), jamais supprimé par un `outline: none` sans remplacement.

---

## G. VALIDATION AVANT LIVRAISON D'UN ÉCRAN

Avant de considérer un écran terminé, vérifier systématiquement :
1. Aucune valeur de couleur, taille ou espacement écrite en dur hors du système de tokens.
2. Test avec contenu utilisateur anormalement long (nom, description, message) sans casser la mise en page.
3. Affichage correct aux 5 paliers de responsive définis en section E, y compris un écran 21:9.
4. Contraste de tous les textes et badges conforme WCAG AA.
5. Tous les éléments cliquables respectent la taille et l'espacement minimum définis en D.5.
6. Aucun scroll horizontal non voulu sur mobile.
7. États vides (aucun podcast, aucune dédicace, aucun auditeur) traités avec un message clair et une action possible, jamais un écran blanc ou une carte vide sans explication.

Ne pas passer à l'écran suivant tant que ces sept points ne sont pas vérifiés.
