# Specification Fonctionnelle MVP

## Pages

### `/`

Landing page avec :

- hero clair et emotionnel ;
- CTA principal "Creer une histoire" ;
- CTA secondaire "Voir un exemple" ;
- explication en 3 etapes ;
- themes populaires ;
- exemple d'histoire ;
- benefices parents ;
- teaser pricing ;
- FAQ.

### `/create-story`

Formulaire multi-step :

1. Choix du theme.
2. Informations enfant.
3. Style de l'histoire.
4. Objectif emotionnel.
5. Recapitulatif.

Au clic sur "Generer mon histoire", la V1 utilise `generateMockStory(input)` puis redirige vers `/story/demo`.

### `/story/[id]`

Affiche :

- couverture fictive ;
- titre ;
- enfant concerne ;
- theme ;
- resume ;
- 8 pages d'histoire ;
- morale ;
- conseils de lecture parent ;
- boutons PDF, audio et livre imprime en "bientot disponible" ;
- lien pour creer une autre histoire ;
- disclaimer non medical.

### `/pricing`

Plans :

- Apercu gratuit : 0 EUR.
- Histoire digitale : 4,99 EUR.
- Histoire + audio : 7,99 EUR.
- Livre imprime : a partir de 24,99 EUR.

### `/dashboard`

Dashboard mock :

- message de bienvenue ;
- CTA creation ;
- liste de fausses histoires ;
- statuts brouillon, generee, PDF pret ;
- bouton voir ;
- structure prete pour auth Supabase.

## Donnees principales

### StoryInput

- themeId.
- childName.
- childAge.
- childPronoun optionnel.
- favoriteAnimal.
- favoriteColor.
- favoritePlace.
- secondaryCharacter optionnel.
- parentName optionnel.
- storyStyle.
- emotionalGoal.

### Story

- id.
- title.
- subtitle.
- childName.
- theme.
- summary.
- pages.
- moral.
- parentTips.
- status.
- createdAt.

## Etats UX

- Empty state du dashboard.
- Boutons "bientot disponible" desactives.
- Validation formulaire par etape.
- Recapitulatif avant generation.
- Message de chargement court pendant la generation mock.

## Regles de contenu

- Toujours parler d'accompagnement, jamais de soin.
- Ne pas promettre de regler une peur ou un trouble.
- Utiliser un vocabulaire simple, chaleureux et non culpabilisant.
- Eviter les details trop intimes ou sensibles dans la V1.

