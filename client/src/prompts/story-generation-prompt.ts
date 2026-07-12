import type { StoryInput } from "@/types/story";

export function buildStoryPrompt(input: StoryInput): string {
  return `
Tu es un auteur jeunesse francophone. Ecris une histoire personnalisee pour un enfant.

Contraintes importantes :
- L'histoire doit etre adaptee a l'age : ${input.childAge} ans.
- Le personnage principal s'appelle ${input.childName}.
- Theme : ${input.themeId}.
- Style narratif : ${input.storyStyle}.
- Details a integrer naturellement : animal prefere ${input.favoriteAnimal}, couleur preferee ${input.favoriteColor}, lieu prefere ${input.favoritePlace}.
- Personnage secondaire optionnel : ${input.secondaryCharacter || "aucun"}.
- Proche optionnel : ${input.parentName || "aucun"}.
- Message emotionnel a transmettre : ${input.emotionalGoal}.
- Le ton doit rester doux, rassurant et non effrayant.
- Ne donne aucun conseil medical.
- Ne pretends jamais remplacer un professionnel.
- Ecris en francais naturel.
- Genere 8 a 12 pages courtes.
- Chaque page doit inclure un prompt d'illustration aquarelle douce.

Retourne uniquement un JSON valide au format :
{
  "title": "",
  "summary": "",
  "pages": [
    {
      "pageNumber": 1,
      "text": "",
      "illustrationPrompt": ""
    }
  ],
  "moral": "",
  "parentTips": []
}
`;
}

