import { storyThemes } from "@/data/story-themes";
import type { Story, StoryInput } from "@/types/story";

const fallbackInput: StoryInput = {
  themeId: "fear-of-dark",
  childName: "Lou",
  childAge: "5",
  favoriteAnimal: "renard",
  favoriteColor: "bleu",
  favoritePlace: "jardin",
  storyStyle: "conte du soir",
  emotionalGoal: "Se sentir rassure au moment d'eteindre la lumiere.",
};

export function generateMockStory(input: Partial<StoryInput> = {}): Story {
  const safeInput = { ...fallbackInput, ...input };
  const theme =
    storyThemes.find((storyTheme) => storyTheme.id === safeInput.themeId) ??
    storyThemes[0];
  const childName = safeInput.childName || fallbackInput.childName;
  const animal = safeInput.favoriteAnimal || fallbackInput.favoriteAnimal;
  const place = safeInput.favoritePlace || fallbackInput.favoritePlace;
  const color = safeInput.favoriteColor || fallbackInput.favoriteColor;
  const companion = safeInput.secondaryCharacter || "une petite lumiere doree";

  return {
    id: "demo",
    title: `${childName} et le secret du ${place}`,
    subtitle: `Une histoire ${safeInput.storyStyle} pour accompagner ${theme.title.toLowerCase()}.`,
    childName,
    childAge: safeInput.childAge || fallbackInput.childAge,
    theme: theme.title,
    style: safeInput.storyStyle,
    summary: `${childName} decouvre qu'un petit rituel, quelques images rassurantes et la presence de ${companion} peuvent transformer un moment impressionnant en aventure douce.`,
    pages: [
      {
        pageNumber: 1,
        text: `Ce soir-la, ${childName} regardait le ${place} prendre une couleur ${color}. Tout semblait calme, mais dans son ventre, une petite question faisait toc toc.`,
        illustrationPrompt: `Aquarelle douce, ${childName} observe un ${place}, palette ${color}, ambiance calme de fin de jour.`,
      },
      {
        pageNumber: 2,
        text: `${companion} s'approcha doucement. "Les grandes emotions viennent souvent quand quelque chose compte beaucoup", murmura-t-il.`,
        illustrationPrompt: `Livre enfant premium, compagnon rassurant pres de l'enfant, lumiere chaude, decor minimal.`,
      },
      {
        pageNumber: 3,
        text: `${childName} pensa a son ${animal} prefere et imagina son pas leger. Un pas pour respirer, un pas pour regarder, un pas pour se rappeler qu'il n'etait pas seul.`,
        illustrationPrompt: `Petit animal doux accompagne l'enfant, composition apaisante, aquarelle pastel.`,
      },
      {
        pageNumber: 4,
        text: `Dans le ${place}, chaque ombre trouva un nom gentil : la chaise devint un bateau, le manteau une montagne, et le silence une couverture toute douce.`,
        illustrationPrompt: `Objets familiers transformes en formes imaginaires rassurantes, style conte du soir.`,
      },
      {
        pageNumber: 5,
        text: `${childName} inventa une phrase secrete : "Je peux avancer doucement." Il la repeta tout bas, comme une petite chanson.`,
        illustrationPrompt: `Enfant confiant, petites etoiles discretes, couleurs pastel, scene intime.`,
      },
      {
        pageNumber: 6,
        text: `${companion} lui montra que le courage n'etait pas de ne rien sentir. Le courage, c'etait d'ecouter son coeur et de faire un petit pas quand meme.`,
        illustrationPrompt: `Moment tendre entre l'enfant et son compagnon, atmosphere premium et chaleureuse.`,
      },
      {
        pageNumber: 7,
        text: `Alors ${childName} choisit son rituel : une respiration, une pensee pour son ${animal}, puis un sourire vers le ${place}. Le monde parut plus familier.`,
        illustrationPrompt: `Rituel du soir doux, enfant apaise, lumiere doree, aquarelle.`,
      },
      {
        pageNumber: 8,
        text: `Quand la nuit arriva, ${childName} sut qu'il pouvait garder une petite lumiere a l'interieur de lui. Elle etait calme, courageuse, et exactement a sa taille.`,
        illustrationPrompt: `Couverture de livre, enfant serein, petite lumiere symbolique, couleurs creme et bleu nuit.`,
      },
    ],
    moral:
      "Les emotions deviennent moins grandes quand on les accueille avec des mots simples, un rituel doux et beaucoup de tendresse.",
    parentTips: [
      "Lire lentement, en laissant l'enfant commenter les images imaginees.",
      "Reprendre la phrase secrete de l'histoire dans le rituel du soir.",
      "Demander a l'enfant quel petit pas il aimerait essayer demain.",
    ],
    status: "generated",
    createdAt: new Date().toISOString(),
  };
}

export const demoStory = generateMockStory();

