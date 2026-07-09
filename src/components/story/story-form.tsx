"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Heart,
  Palette,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { storyThemes } from "@/data/story-themes";
import { generateMockStory } from "@/lib/mock-story";
import type { StoryInput, StoryStyle } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeCard } from "@/components/story/theme-card";

const storyStyles: StoryStyle[] = [
  "doux et rassurant",
  "aventure magique",
  "drole et tendre",
  "conte du soir",
  "pedagogique",
];

const initialInput: StoryInput = {
  themeId: "fear-of-dark",
  childName: "",
  childAge: "",
  childPronoun: "",
  favoriteAnimal: "",
  favoriteColor: "",
  favoritePlace: "",
  secondaryCharacter: "",
  parentName: "",
  storyStyle: "conte du soir",
  emotionalGoal: "",
};

const stepMeta = [
  {
    label: "Moment",
    title: "Choisissez le moment a transformer en histoire",
    icon: Heart,
  },
  {
    label: "Heros",
    title: "Donnez une vraie presence a votre enfant",
    icon: BookOpen,
  },
  {
    label: "Ambiance",
    title: "Choisissez la voix du livre",
    icon: Palette,
  },
  {
    label: "Message",
    title: "Dites ce que l'histoire doit laisser",
    icon: WandSparkles,
  },
  {
    label: "Apercu",
    title: "Validez le livre avant generation",
    icon: Sparkles,
  },
];

function coverForTheme(themeId: string) {
  if (themeId === "school") return "/images/books/school-cover.png";
  if (themeId === "anger") return "/images/books/anger-cover.png";
  return "/images/books/fear-dark-cover.png";
}

export function StoryForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<StoryInput>(initialInput);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTheme = useMemo(
    () => storyThemes.find((theme) => theme.id === input.themeId) ?? storyThemes[0],
    [input.themeId],
  );

  const currentStep = stepMeta[step];
  const cover = coverForTheme(input.themeId);
  const childName = input.childName.trim() || "Votre enfant";

  function update<K extends keyof StoryInput>(key: K, value: StoryInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function canContinue() {
    if (step === 0) return Boolean(input.themeId);
    if (step === 1) {
      return (
        input.childName.trim() &&
        input.childAge.trim() &&
        input.favoriteAnimal.trim() &&
        input.favoriteColor.trim() &&
        input.favoritePlace.trim()
      );
    }
    if (step === 3) return input.emotionalGoal.trim().length > 4;
    return true;
  }

  function handleGenerate() {
    setIsGenerating(true);
    generateMockStory(input);
    window.localStorage.setItem("storykid:lastInput", JSON.stringify(input));
    setTimeout(() => router.push("/story/demo"), 650);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-ink/10 bg-white/70 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            {stepMeta.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => index < step && setStep(index)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition ${
                  index === step
                    ? "bg-ink text-white"
                    : index < step
                      ? "bg-gold/35 text-ink hover:bg-gold/55"
                      : "bg-cream text-ink/48"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {index + 1}. {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 md:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
              Etape {step + 1} sur 5
            </p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl">
              {currentStep.title}
            </h2>
          </div>

          {step === 0 ? (
            <div>
              <p className="max-w-2xl text-base font-bold leading-7 text-ink/62">
                Le theme donne le cadre emotionnel. StoryKid garde ensuite le ton
                doux, concret et non medical.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {storyThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={input.themeId === theme.id}
                    onClick={() => update("themeId", theme.id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <p className="max-w-2xl text-base font-bold leading-7 text-ink/62">
                On ne demande pas de photo. Les bons details suffisent pour creer
                un livre qui semble vraiment adresse a l'enfant.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Input
                  aria-label="Prenom"
                  placeholder="Prenom de l'enfant"
                  value={input.childName}
                  onChange={(event) => update("childName", event.target.value)}
                />
                <Input
                  aria-label="Age"
                  placeholder="Age"
                  value={input.childAge}
                  onChange={(event) => update("childAge", event.target.value)}
                />
                <Input
                  aria-label="Pronom"
                  placeholder="Pronom optionnel"
                  value={input.childPronoun}
                  onChange={(event) => update("childPronoun", event.target.value)}
                />
                <Input
                  aria-label="Animal prefere"
                  placeholder="Animal prefere"
                  value={input.favoriteAnimal}
                  onChange={(event) => update("favoriteAnimal", event.target.value)}
                />
                <Input
                  aria-label="Couleur preferee"
                  placeholder="Couleur preferee"
                  value={input.favoriteColor}
                  onChange={(event) => update("favoriteColor", event.target.value)}
                />
                <Input
                  aria-label="Lieu rassurant"
                  placeholder="Lieu prefere ou rassurant"
                  value={input.favoritePlace}
                  onChange={(event) => update("favoritePlace", event.target.value)}
                />
                <Input
                  aria-label="Personnage secondaire"
                  placeholder="Compagnon optionnel"
                  value={input.secondaryCharacter}
                  onChange={(event) =>
                    update("secondaryCharacter", event.target.value)
                  }
                />
                <Input
                  aria-label="Proche"
                  placeholder="Parent ou proche optionnel"
                  value={input.parentName}
                  onChange={(event) => update("parentName", event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <p className="max-w-2xl text-base font-bold leading-7 text-ink/62">
                Le style change le rythme du livre : plus calme pour le soir, plus
                aventureux pour donner envie d'avancer.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,420px)_1fr]">
                <Select
                  value={input.storyStyle}
                  onValueChange={(value) => update("storyStyle", value as StoryStyle)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Style de l'histoire" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="rounded-[1.5rem] bg-cream p-5 text-sm font-bold leading-6 text-ink/62">
                  Conseil : pour un premier livre emotionnel, "conte du soir" ou
                  "doux et rassurant" donnent le rendu le plus premium.
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <p className="max-w-2xl text-base font-bold leading-7 text-ink/62">
                Une bonne histoire ne force pas une lecon. Elle fait passer une
                phrase que l'enfant peut garder.
              </p>
              <Textarea
                className="mt-8"
                placeholder="Exemple : l'aider a se sentir rassure au moment d'eteindre la lumiere."
                value={input.emotionalGoal}
                onChange={(event) => update("emotionalGoal", event.target.value)}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <p className="max-w-2xl text-base font-bold leading-7 text-ink/62">
                Voici le brief que StoryKid utiliserait pour composer le livre.
                C'est volontairement court : juste assez pour personnaliser sans
                rendre le parent captif du formulaire.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  ["Theme", selectedTheme.title],
                  ["Heros", childName],
                  ["Age", input.childAge ? `${input.childAge} ans` : "A completer"],
                  ["Animal", input.favoriteAnimal || "A completer"],
                  ["Couleur", input.favoriteColor || "A completer"],
                  ["Lieu", input.favoritePlace || "A completer"],
                  ["Style", input.storyStyle],
                  ["Message", input.emotionalGoal || "A completer"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.4rem] bg-cream p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="secondary"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            {step < 4 ? (
              <Button
                disabled={!canContinue()}
                onClick={() => setStep((current) => Math.min(4, current + 1))}
              >
                Continuer le livre
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button disabled={isGenerating} onClick={handleGenerate}>
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Le livre prend forme..." : "Generer l'aperçu"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-[2.2rem] bg-white p-3 shadow-book ring-1 ring-ink/10">
          <div className="relative aspect-[0.78/1] overflow-hidden rounded-[1.7rem]">
            <Image
              src={cover}
              alt="Aperçu de couverture StoryKid"
              fill
              sizes="390px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">
                Aperçu live
              </p>
              <h3 className="mt-2 font-display text-4xl font-black leading-none">
                {childName} et le petit courage
              </h3>
              <p className="mt-3 text-sm font-bold leading-5 text-white/82">
                {selectedTheme.title} - {input.storyStyle}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {[
            ["Format", "8 pages illustrees"],
            ["Ton", "doux, non medical"],
            ["Sortie", "PDF / audio / imprime plus tard"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[1.3rem] bg-white/76 p-4 shadow-sm ring-1 ring-ink/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">
                {label}
              </p>
              <p className="mt-1 font-extrabold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
