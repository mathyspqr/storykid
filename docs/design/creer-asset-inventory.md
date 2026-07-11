# Inventaire des assets visuels — tunnel `/creer`

Audit initial réalisé le 10 juillet 2026, complété le 11 juillet 2026 après génération des scènes de progression. Les dimensions sont exprimées en pixels. `Alpha` indique que le fichier possède un canal de transparence.

## Assets publics historiques

| Chemin exact | Dimensions | Alpha | Contenu | Usage potentiel dans `/creer` |
| --- | ---: | :---: | --- | --- |
| `public/images/books/anger-cover.png` | 1122 × 1402 | non | Étoile tenant un ballon-colère rouge dans une chambre chaude | Exemple post-paiement uniquement ; trop explicite pour le tunnel |
| `public/images/books/fear-dark-cover.png` | 1122 × 1402 | non | Renard, lanterne et cabane sous une lumière nocturne | Ambiance de thème possible, mais exclu avant paiement pour éviter un aperçu |
| `public/images/books/school-cover.png` | 1122 × 1402 | non | Enfant entrant à l’école, accompagné d’une lune et d’une étoile | Exemple post-paiement uniquement |
| `public/images/storykid-hero-premium.png` | 1536 × 1024 | non | Livre ouvert, renard, lune et étoile ; parent/enfant en arrière-plan | Landing ou transition de marque ; composition trop large pour les étapes |
| `public/images/storykid-hero.png` | 1697 × 927 | non | Parent et enfant lisant un livre magique dans une chambre | Hero de landing, réassurance parentale ; non retenu dans le tunnel resserré |

## Assets source `src/assets`

| Chemin exact | Dimensions | Alpha | Contenu | Usage potentiel dans `/creer` |
| --- | ---: | :---: | --- | --- |
| `src/assets/avatar-camille.png` | 1254 × 1254 | non | Portrait témoin de Camille sur fond plein | Preuve sociale hors tunnel |
| `src/assets/avatar-sofia.png` | 1254 × 1254 | non | Portrait témoin de Sofia sur fond plein | Preuve sociale hors tunnel |
| `src/assets/avatar-thomas.png` | 1254 × 1254 | non | Portrait témoin de Thomas sur fond plein | Preuve sociale hors tunnel |
| `src/assets/book-maelys.png` | 1122 × 1402 | non | Livre/couverture exemple Maëlys | Exemple post-paiement ; interdit au paywall |
| `src/assets/book-noah.png` | 1122 × 1402 | non | Livre/couverture exemple Noah | Exemple post-paiement ; interdit au paywall |
| `src/assets/book-open-structured.png` | 1448 × 1086 | non | Livre ouvert avec page illustrée et texte lisible | Démonstration landing/post-paiement ; interdit avant paiement |
| `src/assets/device-mockup.png` | 1672 × 941 | non | Mockup desktop/mobile complet de l’ancienne interface | Référence historique uniquement, à ne pas reproduire |
| `src/assets/hero-book-leo.png` | 1122 × 1402 | non | Couverture/livre exemple Léo | Exemple post-paiement uniquement |
| `src/assets/logo-crystal.png` | 1254 × 1254 | non | Cristal violet StoryKid sur fond plein | Source historique ; préférer la version alpha nettoyée |

## Assets nettoyés `src/assets/cleaned`

| Chemin exact | Dimensions | Alpha | Contenu | Usage potentiel dans `/creer` |
| --- | ---: | :---: | --- | --- |
| `src/assets/cleaned/avatar-camille-clean.png` | 1254 × 1254 | oui | Portrait témoin détouré | Preuve sociale hors tunnel |
| `src/assets/cleaned/avatar-sofia-clean.png` | 1254 × 1254 | oui | Portrait témoin détouré | Preuve sociale hors tunnel |
| `src/assets/cleaned/avatar-thomas-clean.png` | 1254 × 1254 | oui | Portrait témoin détouré | Preuve sociale hors tunnel |
| `src/assets/cleaned/book-maelys-clean.png` | 1122 × 1402 | oui | Livre exemple Maëlys détouré | Landing/post-paiement uniquement |
| `src/assets/cleaned/book-noah-clean.png` | 1122 × 1402 | oui | Livre exemple Noah détouré | Landing/post-paiement uniquement |
| `src/assets/cleaned/book-open-structured-clean.png` | 1448 × 1086 | oui | Livre ouvert détouré avec texte et illustration réels | Démonstration landing ; interdit avant paiement |
| `src/assets/cleaned/cover-leo-front.png` | 1000 × 1288 | oui | Couverture frontale de Léo | Lecteur/exemple post-paiement uniquement |
| `src/assets/cleaned/cover-maelys-front.png` | 1086 × 1448 | non | Couverture frontale de Maëlys | Lecteur/exemple post-paiement uniquement |
| `src/assets/cleaned/cover-noah-front.png` | 1086 × 1448 | non | Couverture frontale de Noah | Lecteur/exemple post-paiement uniquement |
| `src/assets/cleaned/device-mockup-clean.png` | 1672 × 941 | oui | Ancien mockup desktop/mobile détouré | Référence historique uniquement |
| `src/assets/cleaned/hero-book-leo-clean.png` | 1122 × 1402 | oui | Livre exemple Léo détouré | Landing/post-paiement uniquement |
| `src/assets/cleaned/logo-crystal-clean.png` | 1254 × 1254 | oui | Cristal StoryKid détouré | Logo du shell, de la transition et du paywall |

## Shell générique de livre `src/assets/livre 3D`

| Chemin exact | Dimensions | Alpha | Contenu | Usage potentiel dans `/creer` |
| --- | ---: | :---: | --- | --- |
| `src/assets/livre 3D/book-center-shadow.png` | 220 × 980 | oui | Ombre de reliure centrale | Lecteur post-paiement ; inutile dans le tunnel |
| `src/assets/livre 3D/book-cover-shadow.png` | 900 × 1100 | oui | Ombre sous une couverture fermée | Volume et ombre du livre verrouillé au paywall |
| `src/assets/livre 3D/book-glow-mask.png` | 1200 × 900 | oui | Halo doux colorisable | Transition possible ; non retenu pour éviter le glow permanent |
| `src/assets/livre 3D/book-inner-page-left.png` | 760 × 980 | oui | Page intérieure gauche crème | Lecteur post-paiement |
| `src/assets/livre 3D/book-inner-page-right.png` | 760 × 980 | oui | Page intérieure droite crème | Lecteur post-paiement |
| `src/assets/livre 3D/book-page-stack-left.png` | 220 × 760 | oui | Tranche/pile de pages gauche | Lecteur post-paiement |
| `src/assets/livre 3D/book-page-stack-right.png` | 220 × 760 | oui | Tranche/pile de pages droite | Épaisseur de pages du livre verrouillé au paywall |
| `src/assets/livre 3D/book-page-turn-overlay.png` | 760 × 980 | oui | Voile de page en cours de rotation | Animation du lecteur post-paiement |
| `src/assets/livre 3D/book-paper-texture.png` | 1024 × 1024 | oui | Texture papier crème | Matière de page/lecteur ; trop lourde pour le shell du tunnel |
| `src/assets/livre 3D/book-spine.png` | 140 × 760 | oui | Tranche neutre du livre | Reliure du livre verrouillé au paywall |

Le dossier contient aussi `README.md` et `manifest.json`, qui documentent le rôle de ces dix calques et leur destination historique `/public/assets/book-generic/`.

## Assets dédiés au tunnel `src/assets/tunnel`

| Chemin exact | Dimensions | Alpha | Contenu | Usage potentiel dans `/creer` |
| --- | ---: | :---: | --- | --- |
| `src/assets/tunnel/ChatGPT Image 10 juil. 2026 à 09_40_55 (1).png` | 1254 × 1254 | non | Enfant lisant avec un poulpe, damier intégré au fichier | Doublon source de `intro-character.png`, à ne pas utiliser |
| `src/assets/tunnel/ChatGPT Image 10 juil. 2026 à 09_40_55 (2).png` | 1254 × 1254 | non | Livre ouvert lumineux, damier intégré | Doublon source de `loading-book.png`, à ne pas utiliser |
| `src/assets/tunnel/ChatGPT Image 10 juil. 2026 à 09_40_56 (3).png` | 1086 × 1448 | non | Couverture Maëlys/poulpe, damier intégré | Doublon source de `paywall-cover.png`, à ne pas afficher net |
| `src/assets/tunnel/ChatGPT Image 10 juil. 2026 à 09_40_56 (4).png` | 1086 × 1448 | non | Livre ouvert volontairement flouté dans une scène violette | Doublon exact de `paywall-bg.png` |
| `src/assets/tunnel/intro-character.png` | 1254 × 1254 | non | Enfant et poulpe lisant, damier intégré | Source brute ; préférer la version alpha |
| `src/assets/tunnel/intro-character-clean.png` | 1254 × 1254 | oui | Enfant et poulpe lisant, détourés | Scène vivante de `prePaywallTransition` |
| `src/assets/tunnel/loading-book.png` | 1254 × 1254 | non | Livre ouvert lumineux, damier intégré | Source brute ; préférer la version alpha |
| `src/assets/tunnel/loading-book-clean.png` | 1254 × 1254 | oui | Livre ouvert lumineux détouré | Élément central de `prePaywallTransition` |
| `src/assets/tunnel/paywall-bg.png` | 1086 × 1448 | non | Livre ouvert et contenu entièrement floutés, ambiance nuit | Fond atmosphérique du paywall sous un voile sombre |
| `src/assets/tunnel/paywall-cover.png` | 1086 × 1448 | non | Couverture nette Maëlys/poulpe avec damier intégré | Source brute interdite en affichage pré-paiement |
| `src/assets/tunnel/paywall-cover-clean.png` | 1086 × 1448 | oui | Même couverture détourée | Silhouette du livre, avec flou 24 px, désaturation, assombrissement et double voile empêchant toute lecture |
| `src/assets/tunnel/progress-scene-need.png` | 1024 × 1024 | non | Table de nuit, veilleuse, fenêtre lunaire et pages blanches ; damier intégré | Source brute de l’étape « besoin », à ne pas afficher directement |
| `src/assets/tunnel/progress-scene-need-clean.png` | 1024 × 1024 | oui | Même composition détourée | Ancrage visuel initial : le moment du soir est posé |
| `src/assets/tunnel/progress-scene-child.png` | 1024 × 1024 | non | Même table de nuit avec plaque prénom et étoile sauge ; damier intégré | Source brute de l’étape « enfant », à ne pas afficher directement |
| `src/assets/tunnel/progress-scene-child-clean.png` | 1024 × 1024 | oui | Même composition détourée | Deuxième état de l’ancrage ; accueille le prénom dynamique côté UI |
| `src/assets/tunnel/progress-scene-anchor.png` | 1024 × 1024 | non | Même scène avec coussin-compagnon sauge et fil doré ; damier intégré | Source brute de l’étape « repère », à ne pas afficher directement |
| `src/assets/tunnel/progress-scene-anchor-clean.png` | 1024 × 1024 | oui | Même composition détourée | Troisième état ; reçoit l’icône dynamique du repère choisi |
| `src/assets/tunnel/progress-scene-feeling.png` | 1024 × 1024 | non | Même scène sous une lumière plus chaude, avec étincelles dorées ; damier intégré | Source brute de l’étape « émotion », à ne pas afficher directement |
| `src/assets/tunnel/progress-scene-feeling-clean.png` | 1024 × 1024 | oui | Même composition détourée | État final de l’ancrage pour émotion, format et récapitulatif |
| `src/assets/tunnel/choice-sprite-needs.png` | 1024 × 1024 | non | Six objets peints représentant les besoins du soir | Planche source ; chaque objet est utilisé via un recadrage dédié |
| `src/assets/tunnel/choice-sprite-anchors.png` | 1024 × 1024 | non | Six compagnons peints en aquarelle/gouache | Planche source des choix de repère |
| `src/assets/tunnel/choice-sprite-feelings-formats.png` | 1024 × 1024 | non | Cinq émotions, deux formats, audio et mot doux peints | Planche source des étapes émotion, format et récapitulatif |
| `src/assets/tunnel/paywall-locked-book-editorial.png` | 2048 × 2048 | non | Livre relié bleu nuit fermé, pages visibles, ruban sauge et fermoir étoile | Illustration maîtresse du paywall ; couverture volontairement vierge, aucun contenu réel |

### Miniatures peintes `src/assets/tunnel/choices`

Toutes les miniatures font 280 × 280 px. Les versions `anchor-*-clean.png` ont un canal alpha pour pouvoir déposer physiquement le compagnon dans la scène ; les autres conservent leur papier ivoire, utilisé comme support dans les choix.

| Chemins exacts | Alpha | Contenu et usage |
| --- | :---: | --- |
| `src/assets/tunnel/choices/need-evening.png`<br>`src/assets/tunnel/choices/need-school.png`<br>`src/assets/tunnel/choices/need-emotion.png`<br>`src/assets/tunnel/choices/need-confidence.png`<br>`src/assets/tunnel/choices/need-sibling.png`<br>`src/assets/tunnel/choices/need-change.png` | non | Six besoins parentaux, affichés dans les choix de la première étape |
| `src/assets/tunnel/choices/anchor-octopus.png`<br>`src/assets/tunnel/choices/anchor-teddy.png`<br>`src/assets/tunnel/choices/anchor-star.png`<br>`src/assets/tunnel/choices/anchor-fox.png`<br>`src/assets/tunnel/choices/anchor-nightlight.png`<br>`src/assets/tunnel/choices/anchor-backpack.png` | non | Recadrages source des six repères narratifs |
| `src/assets/tunnel/choices/anchor-octopus-clean.png`<br>`src/assets/tunnel/choices/anchor-teddy-clean.png`<br>`src/assets/tunnel/choices/anchor-star-clean.png`<br>`src/assets/tunnel/choices/anchor-fox-clean.png`<br>`src/assets/tunnel/choices/anchor-nightlight-clean.png`<br>`src/assets/tunnel/choices/anchor-backpack-clean.png` | oui | Repères détourés utilisés à la fois dans les choix et directement sur le coussin de la scène |
| `src/assets/tunnel/choices/choice-feeling-calm.png`<br>`src/assets/tunnel/choices/choice-feeling-reassuring.png`<br>`src/assets/tunnel/choices/choice-feeling-brave.png`<br>`src/assets/tunnel/choices/choice-feeling-playful.png`<br>`src/assets/tunnel/choices/choice-feeling-magical.png` | non | Cinq sensations finales peintes |
| `src/assets/tunnel/choices/choice-format-6.png`<br>`src/assets/tunnel/choices/choice-format-8.png` | non | Deux volumes de mini-livre blanc pour les formats 6 et 8 pages |
| `src/assets/tunnel/choices/choice-audio.png`<br>`src/assets/tunnel/choices/choice-intent.png` | non | Microphone nocturne et enveloppe ; réservés aux traitements éditoriaux audio/mot doux |

## Décision d’usage

- Utilisés dans le tunnel : `logo-crystal-clean.png`, les quatre `progress-scene-*-clean.png`, les miniatures peintes du dossier `choices`, `intro-character-clean.png`, `loading-book-clean.png` et `paywall-locked-book-editorial.png`.
- Conservés hors tunnel : couvertures d’exemple nettes, mockups et avatars, car ils servent la landing ou le lecteur post-paiement.
- Supprimables sans casse actuelle : variantes brutes à damier, doublons `ChatGPT Image…`, ancien `paywall-bg.png`, ancien `paywall-cover-clean.png`, anciens calques de paywall `book-cover-shadow.png`/`book-page-stack-right.png`/`book-spine.png` et les quatre `progress-scene-*.png` non nettoyés, à condition de garder leurs équivalents employés. Ils restent volontairement intacts comme sources ou dépendances du lecteur dans cette refonte.
