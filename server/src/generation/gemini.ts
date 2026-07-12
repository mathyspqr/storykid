import { z } from "zod";

type PreviewInput = {
  childName: string;
  childAge: number;
  childPronoun: string;
  personalDetail?: string | null;
  moment: string;
  universe: string;
  companion: string;
  emotionalGoal: string;
  tone: string;
};
function storyBrief(input: PreviewInput) {
  const labels: Record<string, string> = {
    bedtime: "le coucher",
    school: "l’école",
    fear: "une peur",
    anger: "une colère",
    change: "un changement",
    confidence: "un manque de confiance",
    animals: "les animaux",
    space: "l’espace",
    magic: "la magie",
    ocean: "l’océan",
    dinosaurs: "les dinosaures",
    vehicles: "les véhicules",
    teddy: "un doudou",
    fox: "un renard",
    star: "une étoile",
    octopus: "un poulpe",
    dog: "un petit chien",
    dragon: "un petit dragon",
    calm: "l’apaiser",
    reassure: "le rassurer",
    courage: "lui donner du courage",
    dream: "le faire rêver",
    smile: "le faire sourire",
    soft: "doux et rassurant",
    adventure: "une petite aventure",
    funny: "drôle et léger",
    magical: "magique et merveilleux",
  };
  return `Fondations obligatoires : moment = ${labels[input.moment] ?? input.moment}; univers = ${labels[input.universe] ?? input.universe}; compagnon = ${labels[input.companion] ?? input.companion}; intention = ${labels[input.emotionalGoal] ?? input.emotionalGoal}; ton = ${labels[input.tone] ?? input.tone}. Tous ces choix doivent déterminer l’action, les émotions et les illustrations, pas seulement être cités.`;
}
function characterDirection(input: PreviewInput) {
  const normalized = input.childName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const feminineNames = new Set([
    "louna",
    "lou",
    "emma",
    "lea",
    "lina",
    "zoe",
    "jade",
    "alice",
    "maya",
    "charlotte",
    "camille",
    "maelys",
  ]);
  const masculineNames = new Set([
    "leo",
    "arthur",
    "theo",
    "lucas",
    "noah",
    "hugo",
    "jules",
    "paul",
    "gabriel",
    "louis",
    "raphael",
    "tom",
  ]);
  const presentation =
    input.childPronoun === "feminine" ||
    (input.childPronoun === "neutral" && feminineNames.has(normalized))
      ? "une fille"
      : input.childPronoun === "masculine" ||
          (input.childPronoun === "neutral" && masculineNames.has(normalized))
        ? "un garçon"
        : "un enfant";
  return `Le héros est TOUJOURS ${presentation} HUMAIN de ${input.childAge} ans, prénommé ${input.childName}. Ne le transforme jamais en animal, créature, mascotte ou personnage non humain. Seul le compagnon peut être un animal. Crée son design une seule fois sur la couverture et conserve exactement ce même enfant humain (genre, visage, coiffure, vêtements, proportions) dans toutes les illustrations.`;
}
type GeminiRequest = {
  contents?: { parts?: { text?: string }[] }[];
  generationConfig?: { responseMimeType?: string; temperature?: number };
};

function textPrompt(body: unknown) {
  const request = body as GeminiRequest;
  return request.contents?.flatMap((content) => content.parts ?? [])
    .map((part) => part.text)
    .filter((text): text is string => Boolean(text))
    .join("\n\n");
}

/**
 * Generates story copy through the configured provider. Ollama is intentionally
 * local-only: the API is called from this server, never from the browser.
 */
export async function callTextGeneration(body: unknown) {
  if (process.env.STORY_TEXT_PROVIDER !== "ollama")
    return callGemini("gemini-3.1-flash-lite", body);

  const prompt = textPrompt(body);
  if (!prompt) throw new Error("OLLAMA_PROMPT_EMPTY");
  const request = body as GeminiRequest;
  const baseUrl = (process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL ?? "qwen3:8b",
        prompt,
        format:
          request.generationConfig?.responseMimeType === "application/json"
            ? "json"
            : undefined,
        stream: false,
        options: { temperature: request.generationConfig?.temperature ?? 0.7 },
      }),
      signal: AbortSignal.timeout(180_000),
    });
  } catch {
    throw new Error("OLLAMA_UNAVAILABLE");
  }
  if (!response.ok) throw new Error(`OLLAMA_${response.status}`);
  const payload = (await response.json()) as { response?: string };
  if (!payload.response) throw new Error("OLLAMA_EMPTY_RESPONSE");
  // Preserve Gemini's small response shape so existing validation stays intact.
  return { candidates: [{ content: { parts: [{ text: payload.response }] } }] };
}

export async function callGemini(model: string, body: unknown) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_NOT_CONFIGURED");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    },
  );
  if (response.ok) return response.json();
  // Retrying instantly on a 429 makes a short capacity limit exhaust every
  // attempt. The generation queue below owns the delayed retry instead.
  throw new Error(`GEMINI_${response.status}`);
}

export async function generateStoryPreview(input: PreviewInput) {
  const safety =
    "Histoire pour enfant de 3 à 9 ans, chaleureuse, non culpabilisante, sans violence, diagnostic ni promesse médicale.";
  const language = `Écris pour un enfant de ${input.childAge} ans : phrases courtes, mots du quotidien, vocabulaire concret, une idée par phrase. Le texte doit être agréable à lire le soir à voix haute. Évite les mots abstraits, rares ou trop longs, les tournures compliquées et tout ton d'adulte.`;
  const gender =
    input.childPronoun === "feminine"
      ? "Utilise les accords féminins (elle, la)."
      : input.childPronoun === "masculine"
        ? "Utilise les accords masculins (il, le)."
        : "Évite les accords genrés quand cela est possible.";
  const personalDetail = input.personalDetail
    ? `Détail personnel NON NÉGOCIABLE : « ${input.personalDetail} ». Il est le fil rouge de l’histoire : introduis-le dès la première page, fais-en le moteur d’une action ou d’une émotion, et fais-le évoluer/résoudre à la deuxième page. Il doit aussi être visible dans les illustrations correspondantes.`
    : "";
  const visualDetail = input.personalDetail
    ? `Élément visuel OBLIGATOIRE dans cette illustration : ${input.personalDetail}. S'il évoque une franchise connue, crée une version originale inspirée du même univers, sans logo ni personnage protégé reconnaissable.`
    : "";
  const character = characterDirection(input);
  const brief = storyBrief(input);
  const textResponse = await callTextGeneration({
    contents: [
      {
        parts: [
          {
            text: `${safety}\n${language}\n${gender}\n${character}\n${brief}\n${personalDetail}\nCrée les DEUX premières pages d’un aperçu StoryKid en français. La page 2 poursuit naturellement la page 1, mais doit montrer un lieu, une action et un cadrage visuellement différents de la page 1. Chaque imagePrompt doit représenter exactement l’action de son texte, inclure les éléments sélectionnés pertinents et décrire une scène unique. Retourne strictement JSON: {"title":"titre court","pages":[{"pageNumber":1,"text":"90 à 130 mots","imagePrompt":"description illustration sans texte"},{"pageNumber":2,"text":"90 à 130 mots","imagePrompt":"description illustration sans texte"}]}.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.75,
    },
  });
  const raw = textResponse.candidates?.[0]?.content?.parts?.find(
    (part: { text?: string }) => part.text,
  )?.text;
  if (!raw) throw new Error("PREVIEW_TEXT_EMPTY");
  const content = z
    .object({
      title: z.string().min(3).max(90),
      pages: z
        .array(
          z.object({
            pageNumber: z.number().int(),
            text: z.string().min(120).max(1800),
            imagePrompt: z.string().min(20).max(1600),
          }),
        )
        .length(2),
    })
    .parse(JSON.parse(raw));
  if (content.pages.some((page, index) => page.pageNumber !== index + 1))
    throw new Error("PREVIEW_PAGE_ORDER");
  const getImage = (image: any) =>
    image.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { data: string; mimeType: string } }) =>
        part.inlineData,
    )?.inlineData;
  const coverResponse = await callGemini("gemini-3.1-flash-image", {
    contents: [
      {
        parts: [
          {
            text: `Couverture de livre StoryKid, distincte d’une page intérieure : composition verticale 3:4, avec zone calme en haut pour le titre et la marque StoryKid ajoutés par la mise en page. ${character} Univers ${input.universe}, moment ${input.moment}, compagnon ${input.companion}. La couverture doit être une image symbolique de l’aventure, différente de toutes les scènes de pages. ${visualDetail} Gouache éditoriale et papier texturé. Aucun texte généré, aucun logo généré.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "3:4" },
    },
  });
  const cover = getImage(coverResponse);
  if (!cover) throw new Error("PREVIEW_COVER_EMPTY");
  const pageImages: { data: string; mimeType: string }[] = [];
  let previousReference = cover;
  for (const page of content.pages) {
    const image = await callGemini("gemini-3.1-flash-image", {
      contents: [
        {
          parts: [
            {
              text: `Illustration intérieure StoryKid, composition horizontale 3:2 conçue pour une page de livre. ${character} Utilise les images fournies comme références strictes : même enfant humain, même visage, coiffure, vêtements et proportions. Ne transforme jamais ${input.childName} en animal. Le compagnon peut être un animal, pas le héros. Laisse une marge de sécurité autour des personnages. Ne dessine pas une couverture. Scène : ${page.imagePrompt}. ${visualDetail} Aucun texte ni logo.`,
            },
            {
              inlineData: {
                data: cover.data,
                mimeType: cover.mimeType ?? "image/png",
              },
            },
            {
              inlineData: {
                data: previousReference.data,
                mimeType: previousReference.mimeType ?? "image/png",
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "3:2" },
      },
    });
    const result = getImage(image);
    if (!result) throw new Error(`PREVIEW_PAGE_${page.pageNumber}_EMPTY`);
    pageImages.push(result);
    previousReference = result;
  }
  return {
    title: content.title
      .toLocaleLowerCase()
      .includes(input.childName.toLocaleLowerCase())
      ? content.title
      : `${input.childName} · ${content.title}`,
    coverBytes: Buffer.from(cover.data, "base64"),
    coverMime: cover.mimeType ?? "image/png",
    pages: content.pages.map((page, index) => ({
      ...page,
      imageBytes: Buffer.from(pageImages[index].data, "base64"),
      imageMime: pageImages[index].mimeType ?? "image/png",
    })),
  };
}
