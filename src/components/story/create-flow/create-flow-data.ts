export const creationSteps = [
  { short: "Le moment", eyebrow: "Ce soir, on accompagne…" },
  { short: "Votre enfant", eyebrow: "Le petit héros" },
  { short: "Le repère", eyebrow: "Un fil à retrouver" },
  { short: "L’émotion", eyebrow: "À la dernière page" },
  { short: "Le format", eyebrow: "Votre rituel" },
  { short: "Le mot doux", eyebrow: "Avant de refermer l’atelier" },
] as const;

export const needOptions = [
  { value: "evening", label: "Rendre le soir plus doux", note: "Peur du noir, dormir seul…" },
  { value: "school", label: "Aborder un nouveau départ", note: "Rentrée, nouvelle activité…" },
  { value: "emotion", label: "Accueillir une grosse émotion", note: "Colère, jalousie, séparation…" },
  { value: "confidence", label: "L’aider à oser", note: "Confiance, autonomie…" },
  { value: "sibling", label: "Trouver sa place", note: "Frère, sœur, famille qui change…" },
  { value: "change", label: "Traverser un changement", note: "Déménagement, nouvelle maison…" },
] as const;

export const interestOptions = ["les animaux", "l’espace", "la mer", "la musique", "les véhicules", "la nature"];

export const anchorOptions = [
  { value: "octopus", label: "Poulpe lumineux", tint: "peach" },
  { value: "teddy", label: "Doudou complice", tint: "sage" },
  { value: "star", label: "Petite étoile", tint: "gold" },
  { value: "fox", label: "Renard veilleur", tint: "clay" },
  { value: "nightlight", label: "Veilleuse dorée", tint: "cream" },
  { value: "backpack", label: "Cartable courageux", tint: "blue" },
] as const;

export const feelingOptions = [
  { value: "calm", label: "Apaisé", line: "Le corps relâché, prêt pour la nuit." },
  { value: "reassuring", label: "Rassuré", line: "Avec des repères doux à garder." },
  { value: "brave", label: "Courageux", line: "Fier d’un tout petit pas." },
  { value: "playful", label: "Amusé", line: "Le sourire encore là en fermant le livre." },
  { value: "magical", label: "Émerveillé", line: "Avec une image qui accompagne les rêves." },
] as const;

export const formatOptions = [
  { value: 6 as const, label: "6 pages", note: "Un petit rituel de 5 minutes" },
  { value: 8 as const, label: "8 pages", note: "Un voyage un peu plus développé" },
] as const;
