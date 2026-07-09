# Contexte Agent StoryKid

Utiliser ce fichier comme point d'entree pour toute prochaine session de developpement.

## Role attendu

Agir comme un expert full-stack Next.js, TypeScript, TailwindCSS, shadcn/ui, Supabase, Stripe et integration IA, avec une sensibilite forte en marketing, design produit, UX parentale et copywriting.

## Produit

StoryKid est une web app qui aide les parents a creer une histoire personnalisee pour accompagner une emotion ou une etape de vie de leur enfant.

Ne jamais reduire le produit a un simple generateur IA. L'angle a conserver est :

> Une histoire personnalisee pour aider un enfant a vivre un moment important avec douceur.

## Decision produit majeure

Le client est le parent. L'enfant est le heros de l'histoire, mais l'interface doit rassurer l'adulte : premium, claire, sobre, douce.

## Stack obligatoire

- Next.js App Router.
- TypeScript.
- TailwindCSS.
- shadcn/ui.
- lucide-react.
- framer-motion.
- Structure `src/`.
- Composants reutilisables.

## Pages MVP

- `/`
- `/create-story`
- `/story/[id]`
- `/pricing`
- `/dashboard`

## Composants MVP

- `Header`
- `Footer`
- `HeroSection`
- `HowItWorks`
- `ThemeCard`
- `StoryPreview`
- `PricingCard`
- `FAQSection`
- `StoryForm`
- `StoryResult`
- `DashboardStoryCard`
- `Badge`
- `Container`
- `SectionTitle`

## Fichiers metier attendus

- `src/data/story-themes.ts`
- `src/lib/mock-story.ts`
- `src/types/story.ts`
- `src/prompts/story-generation-prompt.ts`

## Ton et securite

- Doux, rassurant, premium, familial.
- Pas medical.
- Pas de promesse de guerison.
- Pas de diagnostic.
- Pas de photo enfant en V1.
- Collecte minimale de donnees.

## Definition de fini MVP

Le projet doit permettre :

```bash
cd storykid
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
```

Avec landing, creation d'histoire, resultat demo, pricing, dashboard et documentation.

