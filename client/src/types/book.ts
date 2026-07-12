import type { StaticImageData } from "next/image";

export type BookReaderMode = "example" | "preview" | "full";

export type StoryBookPageType =
  | "story"
  | "moral"
  | "cta"
  | "locked";

export type StoryBookPage = {
  id: string;
  pageNumber?: number;
  title?: string;
  text?: string;
  image?: StaticImageData | string;
  imagePrompt?: string;
  type?: StoryBookPageType;
};

export type StoryBookReaderTheme = {
  background: string;
  glow: string;
  accent: string;
};

export type StoryBook = {
  id: string;
  title: string;
  childName: string;
  age?: string;
  theme?: string;
  tone?: string;
  coverImage?: StaticImageData | string;
  readerTheme?: StoryBookReaderTheme;
  pages: StoryBookPage[];
  moral?: string;
};
