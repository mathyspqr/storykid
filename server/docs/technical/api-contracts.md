# Contrats API Futurs

## `POST /api/stories/generate`

Genere une histoire depuis les informations du formulaire.

### Request

```json
{
  "themeId": "fear-of-dark",
  "childName": "Lou",
  "childAge": 5,
  "childPronoun": "elle",
  "favoriteAnimal": "renard",
  "favoriteColor": "bleu",
  "favoritePlace": "jardin",
  "secondaryCharacter": "Milo",
  "parentName": "Maman",
  "storyStyle": "conte-du-soir",
  "emotionalGoal": "L'aider a se sentir rassuree dans le noir."
}
```

### Response

```json
{
  "storyId": "uuid",
  "status": "generated",
  "story": {
    "title": "Lou et la petite lumiere du jardin",
    "summary": "...",
    "pages": [],
    "moral": "...",
    "parentTips": []
  }
}
```

## `GET /api/stories/:id`

Retourne une histoire appartenant a l'utilisateur connecte.

### Response

```json
{
  "id": "uuid",
  "childName": "Lou",
  "theme": "Peur du noir",
  "title": "...",
  "summary": "...",
  "content": {},
  "status": "generated",
  "createdAt": "2026-07-09T00:00:00.000Z"
}
```

## `POST /api/stripe/checkout`

Cree une session Stripe Checkout.

### Request

```json
{
  "storyId": "uuid",
  "productType": "digital"
}
```

### Response

```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

## `POST /api/pdf/generate`

Genere un PDF pour une histoire payee.

### Request

```json
{
  "storyId": "uuid"
}
```

### Response

```json
{
  "assetId": "uuid",
  "url": "https://..."
}
```

## Erreurs standard

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le prenom de l'enfant est requis."
  }
}
```

Codes :

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `GENERATION_FAILED`
- `PAYMENT_REQUIRED`

