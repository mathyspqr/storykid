# Securite et Confidentialite

## Donnees sensibles

StoryKid manipule des donnees liees a des enfants. Meme si la V1 est mockee, le produit doit etre concu avec sobriete de donnees.

## Principes

- Demander seulement les informations utiles a l'histoire.
- Ne pas demander de photo en V1.
- Eviter les informations medicales.
- Expliquer l'usage des donnees en langage clair.
- Permettre la suppression future du compte et des histoires.

## Donnees enfant V1

Acceptable :

- prenom ;
- age ;
- gouts simples ;
- situation generale ;
- message souhaite par le parent.

A eviter :

- nom complet ;
- adresse ;
- ecole ;
- photo ;
- donnees medicales ;
- diagnostic ;
- details familiaux trop sensibles.

## IA

- Ne pas envoyer de donnees inutiles au modele.
- Filtrer les prompts qui cherchent un conseil medical.
- Journaliser les erreurs sans stocker de donnees enfant en clair dans les logs.

## Paiement

- Stripe gere les donnees de carte.
- StoryKid stocke seulement les identifiants de session, statuts et montants.

