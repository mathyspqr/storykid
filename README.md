# StoryKid

StoryKid est une web app qui permet aux parents de creer une histoire personnalisee pour leur enfant en quelques minutes. L'enfant devient le heros d'une histoire douce, illustree et adaptee a une emotion, une etape de vie ou un moment important.

Le positionnement central n'est pas "generateur d'histoires IA", mais :

> Creer une histoire personnalisee pour aider un enfant a vivre une emotion, une etape de vie ou un moment important avec douceur.

## Documents principaux

- [Contexte projet](docs/00-project-context.md)
- [PRD produit](docs/product/prd.md)
- [Specification fonctionnelle MVP](docs/product/functional-spec.md)
- [Architecture technique](docs/technical/architecture.md)
- [Base de donnees Supabase](docs/technical/database.md)
- [Integration IA](docs/technical/ai-generation.md)
- [Stripe](docs/technical/stripe.md)
- [Generation d'images](docs/technical/image-generation.md)
- [Plateforme de marque](docs/brand/brand-platform.md)
- [Guide copywriting](docs/brand/copywriting-guide.md)
- [Design system](docs/design/design-system.md)
- [Positionnement marketing](docs/marketing/positioning.md)
- [Roadmap](docs/product/roadmap.md)
- [Checklist de lancement](docs/operations/launch-checklist.md)

## Lancer l'app

```bash
npm install
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
```

## MVP attendu

Le MVP doit permettre de :

- comprendre la promesse en moins de 5 secondes ;
- choisir un theme d'histoire ;
- renseigner quelques informations sur l'enfant ;
- generer une histoire fictive cote front dans un premier temps ;
- afficher une page resultat avec couverture, resume, pages, morale et conseils de lecture ;
- preparer les evolutions Supabase, Stripe, OpenAI, PDF, audio et livre imprime.

## Ton produit

StoryKid doit rester doux, rassurant, premium, familial et moderne. Le produit ne doit jamais pretendre remplacer un psychologue, un medecin ou un professionnel de sante.
