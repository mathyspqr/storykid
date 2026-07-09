import bookMaelys from "@/assets/cleaned/book-maelys-clean.png";
import bookNoah from "@/assets/cleaned/book-noah-clean.png";
import heroBookLeo from "@/assets/cleaned/hero-book-leo-clean.png";
import type { StoryBook } from "@/types/book";

export const exampleBooks = [
  {
    id: "fear",
    title: "La nuit devient moins grande",
    childName: "Léo",
    age: "4 ans",
    theme: "Peur du noir",
    tone: "Doux et rassurant",
    coverImage: heroBookLeo,
    readerTheme: {
      background:
        "radial-gradient(circle at 70% 20%, rgba(91, 72, 204, 0.30), transparent 31%), radial-gradient(circle at 22% 32%, rgba(23, 139, 164, 0.22), transparent 28%), linear-gradient(180deg, #08173d 0%, #050b25 58%, #020617 100%)",
      glow: "rgba(100, 91, 255, 0.34)",
      accent: "#8f7bff",
    },
    moral: "La lumière peut être petite, mais elle suffit quand on n’est pas seul.",
    pages: [
      {
        id: "fear-1",
        type: "story",
        pageNumber: 1,
        title: "Le petit bruit du soir",
        text: "Ce soir-là, Léo trouvait sa chambre immense. Le rideau bougeait un peu, et l’ombre de la chaise semblait plus grande que d’habitude.",
        image: heroBookLeo,
      },
      {
        id: "fear-2",
        type: "story",
        pageNumber: 2,
        title: "Le poulpe lumineux",
        text: "Sous la couverture, une petite lumière apparut. C’était un poulpe doux, rond et silencieux, venu aider Léo à regarder la nuit autrement.",
      },
      {
        id: "fear-3",
        type: "story",
        pageNumber: 3,
        title: "Nommer les ombres",
        text: "Ensemble, ils nommèrent chaque forme : un coussin, un livre, une peluche. Plus Léo les reconnaissait, plus la chambre redevenait la sienne.",
      },
      {
        id: "fear-moral",
        type: "moral",
        title: "La petite lumière",
        text: "La lumière peut être petite, mais elle suffit quand on n’est pas seul.",
      },
      {
        id: "fear-cta",
        type: "cta",
        title: "Créer une histoire pour ton enfant",
        text: "Tu peux générer un aperçu gratuit, le lire en ligne, puis débloquer le livre complet seulement si le rendu te plaît.",
      },
    ],
  },
  {
    id: "school",
    title: "Le cartable courageux",
    childName: "Maëlys",
    age: "5 ans",
    theme: "Rentrée",
    tone: "Confiant",
    coverImage: bookMaelys,
    readerTheme: {
      background:
        "radial-gradient(circle at 72% 20%, rgba(255, 190, 92, 0.22), transparent 30%), radial-gradient(circle at 22% 32%, rgba(104, 147, 92, 0.24), transparent 32%), linear-gradient(180deg, #182a35 0%, #0e1a24 58%, #070d16 100%)",
      glow: "rgba(255, 193, 92, 0.28)",
      accent: "#f4b84f",
    },
    moral: "Un grand début peut se faire avec un petit pas.",
    pages: [
      {
        id: "school-1",
        type: "story",
        pageNumber: 1,
        title: "La grande porte",
        text: "Maëlys serrait les bretelles de son cartable. La porte de l’école semblait grande, mais elle s’ouvrait doucement.",
        image: bookMaelys,
      },
      {
        id: "school-2",
        type: "story",
        pageNumber: 2,
        title: "Le secret dans la poche",
        text: "Dans sa poche, Maëlys garda une phrase secrète : je peux entrer à mon rythme. Son cartable la connaissait déjà par cœur.",
      },
      {
        id: "school-3",
        type: "story",
        pageNumber: 3,
        title: "Le premier bonjour",
        text: "Un enfant lui sourit. Maëlys répondit tout doucement. Le premier bonjour ne faisait pas disparaître le trac, mais il lui tenait la main.",
      },
      {
        id: "school-moral",
        type: "moral",
        title: "Le petit pas",
        text: "Un grand début peut se faire avec un petit pas.",
      },
      {
        id: "school-cta",
        type: "cta",
        title: "Créer une histoire pour une étape",
        text: "Rentrée, séparation, confiance ou nouvelle habitude : crée un mini-livre doux à lire avant le grand moment.",
      },
    ],
  },
  {
    id: "anger",
    title: "La colère en ballon",
    childName: "Noah",
    age: "4 ans",
    theme: "Colère",
    tone: "Apaisant",
    coverImage: bookNoah,
    readerTheme: {
      background:
        "radial-gradient(circle at 70% 22%, rgba(255, 101, 87, 0.24), transparent 30%), radial-gradient(circle at 20% 30%, rgba(91, 72, 204, 0.24), transparent 30%), linear-gradient(180deg, #171633 0%, #080b24 58%, #030512 100%)",
      glow: "rgba(255, 98, 87, 0.30)",
      accent: "#ff6257",
    },
    moral: "Une émotion devient plus légère quand on apprend à la tenir.",
    pages: [
      {
        id: "anger-1",
        type: "story",
        pageNumber: 1,
        title: "Le ballon rouge",
        text: "La colère de Noah gonfla comme un grand ballon rouge. Elle prenait beaucoup de place, jusque dans ses petites mains.",
        image: bookNoah,
      },
      {
        id: "anger-2",
        type: "story",
        pageNumber: 2,
        title: "Regarder sans tirer",
        text: "Mila ne tira pas sur le ballon. Elle s’assit près de Noah et lui demanda seulement : est-ce qu’on peut le regarder ensemble ?",
      },
      {
        id: "anger-3",
        type: "story",
        pageNumber: 3,
        title: "Souffler doucement",
        text: "Noah souffla une fois, puis encore. Le ballon resta là, mais il devint plus léger à tenir.",
      },
      {
        id: "anger-moral",
        type: "moral",
        title: "Plus léger",
        text: "Une émotion devient plus légère quand on apprend à la tenir.",
      },
      {
        id: "anger-cta",
        type: "cta",
        title: "Créer une histoire pour une émotion",
        text: "Tu vois l’aperçu en ligne avant de payer. Si l’histoire touche juste, tu peux débloquer le livre complet.",
      },
    ],
  },
] satisfies StoryBook[];

export const exampleBookById = Object.fromEntries(
  exampleBooks.map((book) => [book.id, book]),
) as Record<string, StoryBook>;
