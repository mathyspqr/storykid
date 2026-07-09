import {
  Baby,
  Bed,
  Flame,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Moon,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { StoryThemeIcon } from "@/types/story";

const iconMap = {
  moon: Moon,
  school: GraduationCap,
  flame: Flame,
  sparkles: Sparkles,
  bed: Bed,
  heart: Heart,
  baby: Baby,
  gift: Gift,
  home: Home,
  wand: Wand2,
} satisfies Record<StoryThemeIcon, typeof Moon>;

export function ThemeIcon({ icon }: { icon: StoryThemeIcon }) {
  const Icon = iconMap[icon];
  return <Icon className="h-5 w-5" />;
}

