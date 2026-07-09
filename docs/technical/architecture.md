# Architecture Technique

## Stack

- Next.js App Router.
- TypeScript.
- TailwindCSS.
- shadcn/ui.
- lucide-react.
- framer-motion.
- Supabase plus tard.
- Stripe plus tard.
- OpenAI plus tard.

## Structure cible

```txt
src/
  app/
    page.tsx
    create-story/page.tsx
    story/[id]/page.tsx
    pricing/page.tsx
    dashboard/page.tsx
  components/
    layout/
    landing/
    story/
    pricing/
    dashboard/
    ui/
  data/
    story-themes.ts
  lib/
    mock-story.ts
    utils.ts
  prompts/
    story-generation-prompt.ts
  types/
    story.ts
docs/
```

## Principes

- Les pages orchestrent, les composants affichent.
- Les types Story sont centralises dans `src/types/story.ts`.
- Les donnees mockees restent dans `src/data` ou `src/lib`.
- Les prompts IA sont versionnes et testes comme du code produit.
- Les integrations externes doivent etre isolees dans `src/lib` ou des API routes.

## API routes futures

```txt
src/app/api/stories/generate/route.ts
src/app/api/stories/[id]/route.ts
src/app/api/stripe/checkout/route.ts
src/app/api/stripe/webhook/route.ts
src/app/api/pdf/generate/route.ts
src/app/api/audio/generate/route.ts
```

## Variables d'environnement futures

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

## Qualite

- `npm run lint` avant livraison.
- Types stricts sur les objets Story.
- Pas de logique IA directement dans les composants.
- Pas de cles secretes cote client.

