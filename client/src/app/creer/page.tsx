import { ProductionQuestionnaire } from "@/components/story/production-questionnaire";

export default async function CreerPage({
  searchParams,
}: {
  searchParams: Promise<{ story?: string; resume?: string }>;
}) {
  const { story, resume } = await searchParams;
  return (
    <ProductionQuestionnaire resumeId={story} restorePending={resume === "1"} />
  );
}
