# Activation de production StoryKid

## 1. Base Supabase

Dans **Supabase > SQL Editor**, exécuter intégralement :

`server/supabase/migrations/20260711210000_storykid_production.sql`

Puis exécuter le correctif du worker : `server/supabase/migrations/20260712013000_fix_generation_job_claim.sql`.

Cette migration crée les profils, histoires, pages, achats, jobs, progression, analytics, politiques RLS et buckets privés.

## 2. Sessions anonymes

Dans **Authentication > Providers > Anonymous**, activer **Allow anonymous sign-ins**.

Le formulaire `/creer` crée cette session dès son ouverture. Sans cette option, il affiche volontairement l’erreur « Impossible de créer votre session privée » et ne génère aucun brouillon non protégé.

## 3. Stripe

Créer un webhook Stripe pointant vers :

`POST https://<domaine-api>/api/stripe/webhook`

Événement requis : `checkout.session.completed`.

Ajouter son secret de signature dans `server/.env` :

```text
STRIPE_WEBHOOK_SECRET=whsec_…
CRON_SECRET=<une-valeur-longue-aléatoire>
```

La clé `STRIPE_SECRET_KEY` est vérifiée au démarrage du serveur ; le navigateur ne reçoit jamais cette clé.

## 4. Vérification finale

1. Ouvrir `http://localhost:3001/creer`.
2. Terminer le questionnaire, générer l’aperçu, puis lire la première page.
3. Créer un compte au clic vers la page 2.
4. Utiliser Stripe Test Mode.
5. Vérifier que le webhook crée l’achat, lance le worker et que le livre arrive dans `/bibliotheque`.
