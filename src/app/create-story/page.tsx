import { Container } from "@/components/layout/container";
import { StoryForm } from "@/components/story/story-form";
import { Badge } from "@/components/ui/badge";

export default function CreateStoryPage() {
  return (
    <main className="py-10 md:py-14">
      <Container>
        <div className="mb-8 grid gap-5 rounded-[2.4rem] bg-ink p-6 text-white shadow-book md:grid-cols-[1fr_0.72fr] md:p-8">
          <div>
            <Badge className="border-white/15 bg-white/10 text-white">
              Atelier StoryKid
            </Badge>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-black leading-[0.95] md:text-7xl">
              Fabriquez un livre qu'on aurait envie d'imprimer.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-white/72">
              Une emotion, cinq details, un message. L'atelier transforme votre
              intention en brief narratif, avec un aperçu visuel qui justifie le
              passage au format digital, audio ou imprime.
            </p>
          </div>
          <div className="grid gap-3 self-end">
            {[
              ["Temps moyen", "2 minutes"],
              ["Donnees enfant", "pas de photo"],
              ["Promesse", "support de lecture, pas avis medical"],
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
        <StoryForm />
      </Container>
    </main>
  );
}
