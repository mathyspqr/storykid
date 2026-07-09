# Supabase Database

## Objectif

Preparer la sauvegarde des utilisateurs, histoires, assets et commandes.

## Tables

### `profiles`

| Colonne | Type | Notes |
| --- | --- | --- |
| id | uuid | Reference `auth.users.id` |
| email | text | Email utilisateur |
| full_name | text | Optionnel |
| created_at | timestamptz | Creation |

### `stories`

| Colonne | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | Reference profile |
| child_name | text | Prenom enfant |
| child_age | int | Age |
| theme | text | Theme choisi |
| style | text | Style narratif |
| emotional_goal | text | Message souhaite |
| title | text | Titre genere |
| summary | text | Resume |
| content_json | jsonb | Pages, morale, conseils |
| status | text | draft, generated, pdf_ready, ordered |
| created_at | timestamptz | Creation |
| updated_at | timestamptz | Mise a jour |

### `story_assets`

| Colonne | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| story_id | uuid | Reference story |
| type | text | cover, illustration, pdf, audio |
| url | text | URL storage |
| created_at | timestamptz | Creation |

### `orders`

| Colonne | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | Reference profile |
| story_id | uuid | Reference story |
| product_type | text | digital, audio, print, pack |
| amount | int | Montant en centimes |
| status | text | pending, paid, fulfilled, refunded |
| stripe_session_id | text | Session Stripe |
| created_at | timestamptz | Creation |

## RLS future

- Un utilisateur ne lit que ses propres `profiles`, `stories`, `story_assets` et `orders`.
- Les webhooks Stripe utilisent la service role key cote serveur.
- Les assets publics doivent etre limites aux fichiers explicitement partageables.

## Statuts Story

- `draft`
- `generating`
- `generated`
- `pdf_ready`
- `audio_ready`
- `print_ordered`
- `archived`

