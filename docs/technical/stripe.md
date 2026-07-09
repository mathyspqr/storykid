# Stripe

## Objectif

Preparer la monetisation sans integrer Stripe dans la V1.

## Offres cible

| Offre | Prix | Contenu |
| --- | ---: | --- |
| Digital Story | 4,99 EUR | Histoire complete, PDF, modifications simples |
| Story + Audio | 7,99 EUR | Histoire complete, PDF, audio raconte, couverture personnalisee |
| Printed Book | A partir de 24,99 EUR | Livre physique, couverture personnalisee, livraison |
| Pack 5 stories | 19,99 EUR | Credits pour 5 histoires digitales |
| Monthly parent plan | 6,99 EUR/mois | Histoires mensuelles et bibliotheque |

## Parcours checkout futur

1. L'utilisateur genere ou consulte une histoire.
2. Il choisit une offre.
3. Le serveur cree une session Stripe Checkout.
4. Stripe redirige vers paiement.
5. Le webhook confirme le paiement.
6. Le statut de la commande et de l'histoire est mis a jour.

## API routes futures

```txt
POST /api/stripe/checkout
POST /api/stripe/webhook
```

## Metadata Stripe

Inclure :

- `user_id`.
- `story_id`.
- `product_type`.
- `price_id`.

## Webhooks utiles

- `checkout.session.completed`.
- `payment_intent.payment_failed`.
- `charge.refunded`.

## Contraintes

- Jamais de cle secrete Stripe cote client.
- Verifier la signature webhook.
- Stocker les montants en centimes.
- Garder l'etat de commande cote base de donnees, pas seulement dans Stripe.

