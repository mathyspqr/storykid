import type { StaticImageData } from "next/image";

export type BookReaderMode = "example" | "preview" | "full";

export type StoryBookPageType =
  | "cover"
  | "story"
  | "moral"
  | "locked"
  | "cta";

export type StoryBookPage = {
  id: string;
  pageNumber?: number;
  title?: string;
  text?: string;
  image?: StaticImageData | string;
  imagePrompt?: string;
  type?: StoryBookPageType;
};

export type StoryBook = {
  id: string;
  title: string;
  childName: string;
  age?: string;
  theme?: string;
  tone?: string;
  coverImage?: StaticImageData | string;
  pages: StoryBookPage[];
  moral?: string;
};
