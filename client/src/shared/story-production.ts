import { z } from "zod";

export const STORY_OFFERS = {
  standard: { id: "standard", pages: 8, priceCents: 399, currency: "eur" },
} as const;

export const storyConfigurationSchema = z.object({
  moment: z.enum([
    "bedtime",
    "school",
    "fear",
    "anger",
    "change",
    "confidence",
    "new_baby",
    "moving",
    "separation",
    "friends",
    "sleep_alone",
    "daily_life",
  ]),
  childName: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .regex(/^[\p{L}][\p{L}\p{M}'’ -]*$/u),
  childAge: z.number().int().min(3).max(9),
  childPronoun: z.enum(["feminine", "masculine", "neutral"]),
  personalDetail: z.string().trim().max(100).optional(),
  universe: z.enum([
    "animals",
    "space",
    "magic",
    "ocean",
    "dinosaurs",
    "vehicles",
  ]),
  companion: z.enum(["teddy", "fox", "star", "octopus", "dog", "dragon"]),
  emotionalGoal: z.enum(["calm", "reassure", "courage", "dream", "smile"]),
  tone: z.enum(["soft", "adventure", "funny", "magical"]),
  format: z.literal("standard"),
});
export type StoryConfiguration = z.infer<typeof storyConfigurationSchema>;
export type StoryOfferId = keyof typeof STORY_OFFERS;
export function calculateOfferTotal(offerId: StoryOfferId) {
  return STORY_OFFERS[offerId].priceCents;
}
export const QUESTIONNAIRE_OPTIONS = {
  moment: [
    ["bedtime", "Le coucher", "MoonStar"],
    ["school", "L’école", "Backpack"],
    ["fear", "Une peur", "CloudMoon"],
    ["anger", "Une grosse colère", "Flame"],
    ["change", "Un changement", "House"],
    ["confidence", "Manque de confiance", "Mountain"],
  ],
  universe: [
    ["animals", "Les animaux", "PawPrint"],
    ["space", "L’espace", "Rocket"],
    ["magic", "La magie", "WandSparkles"],
    ["ocean", "L’océan", "Waves"],
    ["dinosaurs", "Les dinosaures", "Egg"],
    ["vehicles", "Les véhicules", "CarFront"],
  ],
  companion: [
    ["teddy", "Un doudou", "HeartHandshake"],
    ["fox", "Un renard", "Squirrel"],
    ["star", "Une étoile", "Star"],
    ["octopus", "Un poulpe", "Shell"],
    ["dog", "Un petit chien", "Dog"],
    ["dragon", "Un petit dragon", "Sparkles"],
  ],
  emotionalGoal: [
    ["calm", "Le calmer", "Waves"],
    ["reassure", "Le rassurer", "Heart"],
    ["courage", "Lui donner du courage", "Shield"],
    ["dream", "Le faire rêver", "MoonStar"],
    ["smile", "Le faire sourire", "Smile"],
  ],
  tone: [
    ["soft", "Doux et rassurant", "Moon"],
    ["adventure", "Une petite aventure", "Compass"],
    ["funny", "Drôle et léger", "PartyPopper"],
    ["magical", "Magique et merveilleux", "Sparkles"],
  ],
} as const;
