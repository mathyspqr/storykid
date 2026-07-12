# Strategie de Test

## Objectif

Garantir que le MVP est fiable sur les parcours principaux et que les futures integrations ne cassent pas l'experience parent.

## Tests manuels MVP

- Charger `/`.
- Cliquer sur "Creer une histoire".
- Completer toutes les etapes.
- Generer une histoire demo.
- Verifier `/story/demo`.
- Ouvrir `/pricing`.
- Ouvrir `/dashboard`.
- Tester mobile et desktop.

## Tests unitaires futurs

- `generateMockStory(input)` retourne une Story complete.
- `buildStoryPrompt(input)` contient les contraintes critiques.
- Validation des champs requis.
- Mapping theme id vers libelle.

## Tests e2e futurs

Scenarios :

- creation d'une histoire peur du noir ;
- creation avec champs optionnels vides ;
- navigation pricing depuis resultat ;
- dashboard avec liste mock ;
- boutons futures features desactives.

## Accessibilite

Verifier :

- navigation clavier ;
- focus visible ;
- labels formulaire ;
- contrastes ;
- textes de boutons explicites ;
- absence de pieges clavier.

