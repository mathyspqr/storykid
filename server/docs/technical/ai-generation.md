# Generation IA

## Objectif

Generer une histoire en francais naturel, douce, adaptee a l'age de l'enfant et structuree pour affichage page par page.

## Entree

La generation doit recevoir :

- theme ;
- prenom ;
- age ;
- pronoms optionnels ;
- details positifs ;
- style narratif ;
- objectif emotionnel.

## Contraintes prompt

Le prompt doit demander :

- une histoire adaptee a l'age ;
- un ton doux et rassurant ;
- aucun element effrayant ;
- un message emotionnel clair ;
- 8 a 12 pages ;
- du francais naturel ;
- aucun conseil medical ;
- une sortie JSON structuree.

## Format JSON attendu

```json
{
  "title": "",
  "summary": "",
  "pages": [
    {
      "pageNumber": 1,
      "text": "",
      "illustrationPrompt": ""
    }
  ],
  "moral": "",
  "parentTips": []
}
```

## Garde-fous

- Refuser les demandes qui visent un diagnostic ou une therapie.
- Reformuler les objectifs sensibles en soutien narratif.
- Eviter les scenes de danger intense.
- Ne pas inclure de culpabilisation parentale.
- Garder les conseils de lecture simples et non medicaux.

## Evaluation qualite

Verifier :

- personnalisation visible ;
- vocabulaire adapte a l'age ;
- coherence du personnage ;
- progression emotionnelle ;
- morale non moralisatrice ;
- absence de promesse de guerison.

