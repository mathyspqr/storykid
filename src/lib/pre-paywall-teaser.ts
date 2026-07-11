import type {
  CheckoutIntent,
  CreationAnswers,
  PrePaywallTeaser,
} from "@/types/generation";

const needLabels: Record<string, string> = {
  evening: "être rassuré le soir",
  school: "aborder un nouveau départ",
  emotion: "apprivoiser une grosse émotion",
  confidence: "oser un peu plus",
  sibling: "trouver sa place dans la famille",
  change: "traverser un changement",
};

const anchorLabels: Record<string, string> = {
  octopus: "le poulpe lumineux",
  teddy: "le doudou complice",
  star: "la petite étoile",
  fox: "le renard veilleur",
  nightlight: "la veilleuse dorée",
  backpack: "le cartable courageux",
};

const feelingLabels: Record<string, string> = {
  calm: "apaisé",
  reassuring: "rassuré",
  brave: "courageux",
  playful: "amusé",
  magical: "émerveillé",
};

function clean(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function labelForNeed(answers: CreationAnswers) {
  if (answers.need === "custom") {
    return clean(answers.customNeed) || "traverser un moment important";
  }
  return needLabels[answers.need] ?? "vivre un petit moment du quotidien";
}

export function labelForStoryAnchor(answers: CreationAnswers) {
  if (answers.storyAnchor === "custom") {
    return clean(answers.customStoryAnchor) || "un petit repère familier";
  }
  return anchorLabels[answers.storyAnchor] ?? "un petit repère familier";
}

export function labelForFeeling(answers: CreationAnswers) {
  return feelingLabels[answers.desiredFeeling] ?? "apaisé";
}

export function preparePrePaywallTeaser(
  answers: CreationAnswers,
): PrePaywallTeaser {
  const childName = clean(answers.childName) || "Votre enfant";
  const storyAnchorLabel = labelForStoryAnchor(answers);

  return {
    provisionalTitle: `${childName} et ${storyAnchorLabel}`,
    childName,
    needLabel: labelForNeed(answers),
    storyAnchorLabel,
    feelingLabel: labelForFeeling(answers),
    pageCount: answers.pageCount,
    audioEnabled: answers.audioEnabled,
    selectedPrice: answers.audioEnabled ? 7.99 : 4.99,
    status: "prepared_for_reveal",
  };
}

export function prepareCheckoutIntent(
  answers: CreationAnswers,
): CheckoutIntent {
  return answers.audioEnabled
    ? {
        productType: "digital_with_audio",
        amountInCents: 799,
        currency: "EUR",
      }
    : { productType: "digital", amountInCents: 499, currency: "EUR" };
}
