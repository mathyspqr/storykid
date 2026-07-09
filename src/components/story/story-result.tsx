import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Headphones,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Story } from "@/types/story";

const pageImages = [
  "/images/books/fear-dark-cover.png",
  "/images/books/school-cover.png",
  "/images/books/anger-cover.png",
];

function coverForStory(story: Story) {
  if (story.theme.toLowerCase().includes("rentree")) {
    return "/images/books/school-cover.png";
  }

  if (story.theme.toLowerCase().includes("colere")) {
    return "/images/books/anger-cover.png";
  }

  return "/images/books/fear-dark-cover.png";
}

export function StoryResult({ story }: { story: Story }) {
  const cover = coverForStory(story);

  return (
    <main className="py-10 md:py-14">
      <Container>
        <div className="mb-8 grid gap-6 rounded-[2.4rem] bg-ink p-6 text-white shadow-book md:grid-cols-[1fr_0.78fr] md:p-8">
          <div>
            <Badge className="border-white/15 bg-white/10 text-white">
              Aperçu généré
            </Badge>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.95] md:text-7xl">
              Votre livre est prêt à être lu.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-white/72">
              Voici une version démo du rendu StoryKid : couverture, résumé,
              pages illustrées, morale et conseils pour le parent.
            </p>
          </div>
          <div className="grid gap-3 self-end">
            {[
              ["Format", "8 pages"],
              ["Personnalisation", `${story.childName}, ${story.childAge} ans`],
              ["Statut", "Démo front"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.4rem] bg-white/10 p-4 ring-1 ring-white/10"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">
                  {label}
                </p>
                <p className="mt-1 font-display text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[410px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2.2rem] bg-white p-3 shadow-book ring-1 ring-ink/10">
              <div className="relative aspect-[0.78/1] overflow-hidden rounded-[1.7rem]">
                <Image
                  src={cover}
                  alt={`Couverture de ${story.title}`}
                  fill
                  priority
                  sizes="410px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">
                    {story.theme}
                  </p>
                  <h2 className="mt-3 font-display text-5xl font-black leading-none">
                    {story.title}
                  </h2>
                  <p className="mt-4 text-sm font-bold leading-5 text-white/82">
                    Pour {story.childName}
                  </p>
                </div>
              </div>
            </div>

            <Card className="mt-5 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-coral" />
                <div>
                  <h3 className="font-display text-2xl font-black text-ink">
                    Garder ce livre
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-ink/62">
                    Les exports PDF, audio et livre imprimé sont prêts à être
                    branchés à Stripe dans la prochaine étape.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <Button disabled variant="secondary">
                  <Download className="h-4 w-4" />
                  PDF - 4,99 EUR bientôt
                </Button>
                <Button disabled variant="secondary">
                  <Headphones className="h-4 w-4" />
                  Audio - 7,99 EUR bientôt
                </Button>
                <Button disabled variant="secondary">
                  <Printer className="h-4 w-4" />
                  Livre imprimé bientôt
                </Button>
                <Button asChild>
                  <Link href="/create-story">
                    <RotateCcw className="h-4 w-4" />
                    Créer une autre histoire
                  </Link>
                </Button>
              </div>
            </Card>
          </aside>

          <section className="space-y-6">
            <Card className="p-6">
              <Badge>Résumé parent</Badge>
              <p className="mt-4 text-xl font-bold leading-9 text-ink/75">
                {story.summary}
              </p>
            </Card>

            <div className="grid gap-6">
              {story.pages.map((page, index) => (
                <article
                  key={page.pageNumber}
                  className="grid overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-ink/10 md:grid-cols-[0.78fr_1fr]"
                >
                  <div className="relative min-h-[280px]">
                    <Image
                      src={pageImages[index % pageImages.length]}
                      alt={`Illustration page ${page.pageNumber}`}
                      fill
                      sizes="(min-width: 768px) 34vw, 92vw"
                      className="object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-ink">
                      Illustration
                    </div>
                  </div>
                  <div className="paper-texture flex min-h-[280px] flex-col justify-between p-6 md:p-8">
                    <div>
                      <p className="font-display text-6xl font-black text-gold">
                        {String(page.pageNumber).padStart(2, "0")}
                      </p>
                      <p className="mt-6 text-xl font-bold leading-9 text-ink/78">
                        {page.text}
                      </p>
                    </div>
                    <p className="mt-8 rounded-2xl bg-cream p-4 text-sm font-bold leading-6 text-ink/55">
                      Prompt illustration : {page.illustrationPrompt}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Card className="p-6">
                <Badge>Morale</Badge>
                <p className="mt-4 text-lg font-bold leading-8 text-ink/75">
                  {story.moral}
                </p>
              </Card>
              <Card className="p-6">
                <Badge>Conseils parent</Badge>
                <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-ink/68">
                  {story.parentTips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-coral">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="rounded-[1.7rem] border border-ink/10 bg-lavender/60 p-5 text-sm font-bold leading-6 text-ink/70">
              Cette histoire accompagne un moment de vie avec douceur. Elle ne
              remplace pas l'avis d'un professionnel de santé, de l'enfance ou
              de l'accompagnement familial.
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
