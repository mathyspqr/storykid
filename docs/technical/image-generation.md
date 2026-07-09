# Generation d'Images

## Objectif

Chaque page d'histoire pourra inclure un `illustrationPrompt` pour produire une illustration coherente.

## Style cible

- Aquarelle douce.
- Livre pour enfant premium.
- Couleurs pastel.
- Personnages coherents.
- Ambiance chaleureuse.
- Pas de style trop realiste.
- Pas d'elements effrayants.

## Structure par page

Chaque page peut contenir :

```json
{
  "pageNumber": 1,
  "text": "Texte de la page",
  "illustrationPrompt": "Description visuelle douce et coherente"
}
```

## Prompt image type

```txt
Illustration douce de livre pour enfant premium, style aquarelle, couleurs pastel, ambiance chaleureuse et rassurante. Montrer [scene] avec [personnage], expression calme et positive. Composition simple, pas de details effrayants, pas de photorealisme.
```

## Coherence personnage

Conserver :

- age apparent ;
- couleur de cheveux si fournie plus tard ;
- vetements principaux ;
- animal ou objet compagnon ;
- palette generale.

## Risques

- Incoherence du personnage entre pages.
- Images trop realistes.
- Details anxiogenes pour les themes sensibles.
- Cout de generation eleve.

## Priorite

La generation d'images arrive apres validation de la generation texte et du paiement digital.

