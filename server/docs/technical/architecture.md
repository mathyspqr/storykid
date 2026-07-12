# StoryKid architecture

The production code is separated by application boundary:

- `client/`: the complete Next.js application: routes, React UI, browser Supabase client and non-sensitive analytics calls.
- `server/`: Express API, privileged Supabase access, Stripe, AI generation, workers, migrations and deployment documentation.
- Each application owns its contracts. Secrets and service-role access exist only in `server/`.

`client/tests/architecture.test.mjs` prevents imports of server modules or server secrets from the Next.js tree.
