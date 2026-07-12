export type StoryThemeIcon =
  | "moon"
  | "school"
  | "flame"
  | "sparkles"
  | "bed"
  | "heart"
  | "baby"
  | "gift"
  | "home"
  | "wand";

export type StoryTheme = {
  id: string;
  title: string;
  description: string;
  icon: StoryThemeIcon;
};

export type StoryStyle =
  | "doux et rassurant"
  | "aventure magique"
  | "drole et tendre"
  | "conte du soir"
  | "pedagogique";

export type StoryInput = {
  themeId: string;
  childName: string;
  childAge: string;
  childPronoun?: string;
  favoriteAnimal: string;
  favoriteColor: string;
  favoritePlace: string;
  secondaryCharacter?: string;
  parentName?: string;
  storyStyle: StoryStyle;
  emotionalGoal: string;
};

export type StoryPage = {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
};

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  childName: string;
  childAge: string;
  theme: string;
  style: StoryStyle;
  summary: string;
  pages: StoryPage[];
  moral: string;
  parentTips: string[];
  status: "draft" | "generated" | "pdf_ready";
  createdAt: string;
};

