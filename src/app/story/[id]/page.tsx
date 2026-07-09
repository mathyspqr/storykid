import { StoryResult } from "@/components/story/story-result";
import { demoStory } from "@/lib/mock-story";

export default function StoryPage() {
  return <StoryResult story={demoStory} />;
}

