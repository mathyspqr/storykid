import coverLeoFront from "@/assets/cleaned/cover-leo-front.png";
import coverMaelysFront from "@/assets/cleaned/cover-maelys-front.png";
import coverNoahFront from "@/assets/cleaned/cover-noah-front.png";
import type { StoryBook } from "@/types/book";

export const exampleBooks = [
  {
    id: "fear",
    title: "La nuit devient moins grande",
    childName: "Léo",
    age: "4 ans",
    theme: "Peur du noir",
    tone: "Doux et rassurant",
    coverImage: coverLeoFront,
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
        title: "Le bruit sous le lit",
        text: "Ce soir-là, Léo entendit gratter sous son lit. Scritch, scritch. Il tira sa couette jusqu’au nez et murmura : « Papa ? Je crois que la nuit bouge. »",
        image: coverLeoFront,
      },
      {
        id: "fear-2",
        type: "story",
        pageNumber: 2,
        title: "Nori sort de la chaussette",
        text: "Une chaussette roula toute seule. Dedans se cachait Nori, un petit poulpe violet avec huit bras tout doux et une lanterne ronde comme une bille de lune.",
      },
      {
        id: "fear-3",
        type: "story",
        pageNumber: 3,
        title: "La mission des ombres",
        text: "« On va vérifier ensemble », dit Nori. Ils éclairèrent le monstre à cornes : c’était le pull de Léo. Le géant au long nez : sa lampe de bureau.",
      },
      {
        id: "fear-4",
        type: "story",
        pageNumber: 4,
        title: "Le tunnel de coussins",
        text: "Pour le dernier bruit, Léo construisit un tunnel avec deux coussins. Nori passa devant, Léo suivit. Sous le lit, ils trouvèrent... une petite voiture coincée.",
      },
      {
        id: "fear-5",
        type: "story",
        pageNumber: 5,
        title: "Le gardien de lumière",
        text: "Léo remit la voiture dans sa boîte et posa Nori près de l’oreiller. La chambre resta sombre, mais maintenant Léo connaissait ses ombres par leur prénom.",
      },
      {
        id: "fear-moral",
        type: "moral",
        pageNumber: 6,
        title: "La petite lumière",
        text: "La lumière peut être petite, mais elle suffit quand on n’est pas seul.",
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
    coverImage: coverMaelysFront,
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
        title: "Le cartable trop lourd",
        text: "Le matin de la rentrée, Maëlys mit son cartable. Il ne contenait qu’un goûter et un dessin, pourtant il semblait lourd comme une valise de cailloux.",
        image: coverMaelysFront,
      },
      {
        id: "school-2",
        type: "story",
        pageNumber: 2,
        title: "Biscotte a une idée",
        text: "Dans la poche, Biscotte l’écureuil en tissu remua ses moustaches. « Quand ton courage se cache, cherche une petite chose à faire. Une seule. »",
      },
      {
        id: "school-3",
        type: "story",
        pageNumber: 3,
        title: "La première mission",
        text: "Maëlys choisit sa mission : dire bonjour à la maîtresse. Pas raconter toute sa vie. Pas être grande d’un coup. Juste un bonjour.",
      },
      {
        id: "school-4",
        type: "story",
        pageNumber: 4,
        title: "La chasse aux étoiles",
        text: "Dans la classe, une fille lui montra une étoile collée sur son cahier. Maëlys sortit son dessin : un soleil avec des bottes. Elles rirent toutes les deux.",
      },
      {
        id: "school-5",
        type: "story",
        pageNumber: 5,
        title: "Le cartable léger",
        text: "À midi, Maëlys courut vers maman. « Mon cartable est moins lourd », dit-elle. Biscotte sourit dans la poche : le courage avait trouvé la porte.",
      },
      {
        id: "school-moral",
        type: "moral",
        pageNumber: 6,
        title: "Le petit pas",
        text: "Un grand début peut se faire avec un petit pas.",
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
    coverImage: coverNoahFront,
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
        title: "La tour qui s’écroule",
        text: "Noah avait construit une fusée de coussins et de cubes. Quand la dernière brique tomba, tout s’écroula. Dans son ventre, un ballon rouge gonfla d’un coup.",
        image: coverNoahFront,
      },
      {
        id: "anger-2",
        type: "story",
        pageNumber: 2,
        title: "Le dragon Patapouf",
        text: "Le ballon devint Patapouf, un petit dragon rond qui crachait des « C’est pas juste ! » en nuages rouges. Noah avait envie de tout pousser.",
      },
      {
        id: "anger-3",
        type: "story",
        pageNumber: 3,
        title: "La règle du tapis",
        text: "Mila posa un coussin près de lui. « Patapouf peut être fâché ici, sur le tapis. Mais il ne peut pas casser les maisons des autres. »",
      },
      {
        id: "anger-4",
        type: "story",
        pageNumber: 4,
        title: "Trois souffles de pompier",
        text: "Noah souffla comme un pompier : pfff, pfff, pfff. À chaque souffle, Patapouf rapetissait. Il était encore rouge, mais il n’écrasait plus tout.",
      },
      {
        id: "anger-5",
        type: "story",
        pageNumber: 5,
        title: "La fusée repart",
        text: "Noah ramassa une brique, puis deux. Cette fois, Patapouf devint gardien de chantier. Il souffla doucement pour aider la fusée à décoller.",
      },
      {
        id: "anger-moral",
        type: "moral",
        pageNumber: 6,
        title: "Plus léger",
        text: "Une émotion devient plus légère quand on apprend à la tenir.",
      },
    ],
  },
] satisfies StoryBook[];

export const exampleBookById = Object.fromEntries(
  exampleBooks.map((book) => [book.id, book]),
) as Record<string, StoryBook>;
