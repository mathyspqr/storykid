# Setup Developpement

## Creation projet cible

```bash
npx create-next-app@latest storykid --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd storykid
npm install lucide-react framer-motion clsx tailwind-merge
```

## shadcn/ui

Initialiser shadcn/ui puis ajouter les composants utiles :

```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea select tabs badge
```

## Scripts attendus

```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "next lint"
}
```

## Lancement

```bash
npm run dev
```

URL locale :

```txt
http://localhost:3000
```

## Verification

Avant livraison :

```bash
npm run lint
npm run build
```

