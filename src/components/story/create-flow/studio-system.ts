import companionsSprite from "@/assets/studio/companions-sprite.png";
import emotionsAudioSprite from "@/assets/studio/emotions-audio-sprite.png";
import momentsSprite from "@/assets/studio/moments-sprite.png";

export type StudioAssetCategory = "moment" | "companion" | "emotion" | "audio";
export type BookAnchorId = "momentAnchor" | "nameAnchor" | "companionAnchor" | "emotionAnchor" | "audioAnchor" | "sealAnchor";

export type StudioAssetConfig = {
  id: string;
  label: string;
  category: StudioAssetCategory;
  sprite: string;
  spritePosition: string;
  accessibleLabel: string;
  bookAnchor: BookAnchorId;
  scale: number;
  bookScale: number;
  mobileScale: number;
};

export const bookAnchors: Record<BookAnchorId, { x: number; y: number; maxWidth: number; maxHeight: number; z: number }> = {
  momentAnchor: { x: 16, y: 78, maxWidth: 18, maxHeight: 15, z: 7 },
  nameAnchor: { x: 49, y: 61, maxWidth: 62, maxHeight: 12, z: 6 },
  companionAnchor: { x: 19, y: 12, maxWidth: 23, maxHeight: 20, z: 7 },
  emotionAnchor: { x: 78, y: 31, maxWidth: 20, maxHeight: 17, z: 8 },
  audioAnchor: { x: 18, y: 12, maxWidth: 12, maxHeight: 10, z: 7 },
  sealAnchor: { x: 84, y: 50, maxWidth: 25, maxHeight: 18, z: 9 },
};

const momentIds = ["evening", "school", "emotion", "confidence", "sibling", "change"] as const;
const momentLabels = ["Le soir", "Nouveau départ", "Grande émotion", "Oser", "Trouver sa place", "Changement"];
const companionIds = ["octopus", "teddy", "star", "fox", "nightlight", "backpack"] as const;
const companionLabels = ["Poulpe lumineux", "Doudou complice", "Petite étoile", "Renard veilleur", "Veilleuse dorée", "Cartable courageux"];
const emotionIds = ["calm", "reassuring", "brave", "playful", "magical"] as const;
const emotionLabels = ["Apaisé", "Rassuré", "Courageux", "Amusé", "Émerveillé"];
const positions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];

export const studioAssets: StudioAssetConfig[] = [
  ...momentIds.map((id, index) => ({ id, label: momentLabels[index], category: "moment" as const, sprite: momentsSprite.src, spritePosition: positions[index], accessibleLabel: `Objet représentant : ${momentLabels[index]}`, bookAnchor: "momentAnchor" as const, scale: 1, bookScale: 1.08, mobileScale: .88 })),
  ...companionIds.map((id, index) => ({ id, label: companionLabels[index], category: "companion" as const, sprite: companionsSprite.src, spritePosition: positions[index], accessibleLabel: `Objet repère : ${companionLabels[index]}`, bookAnchor: "companionAnchor" as const, scale: 1, bookScale: 1.06, mobileScale: .86 })),
  ...emotionIds.map((id, index) => ({ id, label: emotionLabels[index], category: "emotion" as const, sprite: emotionsAudioSprite.src, spritePosition: positions[index], accessibleLabel: `Objet émotion : ${emotionLabels[index]}`, bookAnchor: "emotionAnchor" as const, scale: 1, bookScale: 1.16, mobileScale: .88 })),
  { id: "audio", label: "Audio", category: "audio", sprite: emotionsAudioSprite.src, spritePosition: positions[5], accessibleLabel: "Casque audio sur son support", bookAnchor: "audioAnchor", scale: 1, bookScale: 1.1, mobileScale: .9 },
];

export function getStudioAsset(id: string) {
  return studioAssets.find((asset) => asset.id === id);
}
