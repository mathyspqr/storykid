import type { StaticImageData } from "next/image";
import bookMaelys from "@/assets/cleaned/book-maelys-clean.png";
import bookNoah from "@/assets/cleaned/book-noah-clean.png";
import heroBookLeo from "@/assets/cleaned/hero-book-leo-clean.png";

export const landingBookExamples = [
  {
    id: "fear",
    title: "La nuit devient moins grande",
    child: "Léo, 4 ans",
    theme: "Peur du noir",
    tag: "Rituel du soir",
    promise: "Un livre tendre pour transformer la chambre en repère rassurant.",
    image: heroBookLeo,
    palette: {
      cover: "#25345d",
      accent: "#f6b36a",
      paper: "#fff7ea",
      wash: "#dfe7ff",
    },
    excerpt:
      "Cette nuit-là, Léo avait peur. Tout semblait si sombre... Mais un petit poulpe apparut, tout doux et lumineux.",
    keepsake: "À relire quand le coucher devient trop grand.",
    pages: [
      {
        text: "Léo découvrit un petit poulpe lumineux sous sa couverture. Il ne chassait pas la nuit. Il l'aidait à la regarder autrement.",
        note: "Une image douce pour rendre la peur moins abstraite.",
      },
      {
        text: "Ensemble, ils nommèrent les ombres : un coussin, une chaise, un livre. La chambre redevint familière.",
        note: "Le récit ramène l’enfant vers des repères simples.",
      },
    ],
  },
  {
    id: "school",
    title: "Le cartable courageux",
    child: "Maëlys, 5 ans",
    theme: "Rentrée",
    tag: "Confiance",
    promise: "Un souvenir de rentrée pour aider l'enfant à franchir la porte.",
    image: bookMaelys,
    palette: {
      cover: "#36655a",
      accent: "#f4c95d",
      paper: "#fffaf0",
      wash: "#dff2ec",
    },
    excerpt:
      "Malo n'avait pas besoin d'être prêt pour toute l'année. Seulement pour le premier pas.",
    keepsake: "À garder pour se souvenir du courage du début.",
    pages: [
      {
        text: "Malo serra les bretelles de son cartable. La porte était grande, mais elle s’ouvrait doucement.",
        note: "Le changement devient une scène concrète.",
      },
      {
        text: "Dans sa poche, Malo garda une phrase secrète : je peux entrer à mon rythme.",
        note: "Le parent repart avec une phrase réutilisable.",
      },
    ],
  },
  {
    id: "anger",
    title: "La colère en ballon",
    child: "Noah, 4 ans",
    theme: "Colère",
    tag: "Émotion",
    promise: "Un petit livre doux pour nommer l'émotion sans la minimiser.",
    image: bookNoah,
    palette: {
      cover: "#7b3f55",
      accent: "#ff8b70",
      paper: "#fff4ef",
      wash: "#ffe3da",
    },
    excerpt:
      "Le ballon était encore là. Mais dans les mains de Nina, il devenait moins lourd.",
    keepsake: "À ressortir quand les mots arrivent après l'orage.",
    pages: [
      {
        text: "La colère de Nina gonfla comme un grand ballon rouge. Stella ne tira pas dessus. Elle le regarda avec elle.",
        note: "L’histoire accueille l’émotion avant de la transformer.",
      },
      {
        text: "Nina souffla une fois, puis encore. Le ballon resta là, mais il devint plus léger à tenir.",
        note: "Une métaphore simple, sans promesse médicale.",
      },
    ],
  },
] satisfies Array<{
  id: string;
  title: string;
  child: string;
  theme: string;
  tag: string;
  promise: string;
  image: StaticImageData;
  palette: {
    cover: string;
    accent: string;
    paper: string;
    wash: string;
  };
  excerpt: string;
  keepsake: string;
  pages: Array<{ text: string; note: string }>;
}>;

export type LandingBookExample = (typeof landingBookExamples)[number];

export const landingThemes = [
  "Peur du noir",
  "Rentrée",
  "Colère",
  "Confiance",
  "Dormir seul",
  "Anniversaire",
];
