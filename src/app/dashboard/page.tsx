import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DashboardStoryCard } from "@/components/dashboard/dashboard-story-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockStories = [
  {
    title: "Lou et la petite lumiere",
    childName: "Lou",
    theme: "Peur du noir",
    status: "generee" as const,
  },
  {
    title: "Malo et le cartable courageux",
    childName: "Malo",
    theme: "Rentree scolaire",
    status: "brouillon" as const,
  },
  {
    title: "Nina partage son tresor",
    childName: "Nina",
    theme: "Apprendre a partager",
    status: "pdf pret" as const,
  },
];

export default function DashboardPage() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Dashboard mock</Badge>
            <h1 className="mt-4 font-display text-5xl font-semibold text-ink md:text-6xl">
              Vos histoires.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/68">
              Cette page est prete pour une future connexion Supabase Auth. Pour
              l'instant, elle affiche des histoires fictives.
            </p>
          </div>
          <Button asChild>
            <Link href="/create-story">
              <Plus className="h-4 w-4" />
              Creer une histoire
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-4">
          {mockStories.map((story) => (
            <DashboardStoryCard key={story.title} {...story} />
          ))}
        </div>
      </Container>
    </main>
  );
}

