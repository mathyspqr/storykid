# StoryKid

StoryKid est un studio de création d’histoires personnalisées pour enfants de 3 à 9 ans.

## Structure

- `client/` — application Next.js complète : landing, tunnel `/creer`, lecteur, bibliothèque et compte.
- `server/` — API Express : Supabase privilégié, Stripe, génération Gemini, workers, migrations et sécurité.

Le client ne contient aucune clé secrète, aucun accès service-role et aucune logique Stripe ou IA.

## Lancer localement

```bash
npm install
npm run dev
```

- Application : `http://localhost:3001`
- API : `http://localhost:3002/health`

## Configuration obligatoire

1. Copier les variables serveur dans `server/.env` à partir de `server/.env.example`.
2. Ajouter les variables publiques Supabase et `NEXT_PUBLIC_API_URL` dans `client/.env.local`.
3. Appliquer `server/supabase/migrations/20260711210000_storykid_production.sql`.
4. Activer Anonymous Sign-Ins dans Supabase Auth.
5. Configurer Stripe et son webhook `POST /api/stripe/webhook`.

La documentation opérationnelle est dans [la configuration de production](server/docs/technical/production-setup.md) et [la checklist d’activation](server/docs/technical/activation-checklist.md).

Pour faire tourner les textes IA sur un PC fixe avec Ollama, suis le guide
[IA locale sur le PC de génération](server/docs/technical/local-ai-pc.md).
