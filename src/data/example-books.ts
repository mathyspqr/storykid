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
    moral: "La lumière peut être petite, mais elle suffit quand on n’est pas seul.",
    pages: [
      {
        id: "fear-cover",
        type: "cover",
        title: "La nuit devient moins grande",
        image: heroBookLeo,
      },
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
        imagePrompt: "Petit garçon et poulpe lumineux dans une chambre douce, ambiance nuit étoilée.",
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
    moral: "Un grand début peut se faire avec un petit pas.",
    pages: [
      {
        id: "school-cover",
        type: "cover",
        title: "Le cartable courageux",
        image: bookMaelys,
      },
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
        imagePrompt: "Petite fille à la rentrée avec cartable, lumière chaude, cour d’école rassurante.",
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
    moral: "Une émotion devient plus légère quand on apprend à la tenir.",
    pages: [
      {
        id: "anger-cover",
        type: "cover",
        title: "La colère en ballon",
        image: bookNoah,
      },
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
        imagePrompt: "Petit garçon avec ballon rouge symbolique, adulte rassurant, ambiance douce.",
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
