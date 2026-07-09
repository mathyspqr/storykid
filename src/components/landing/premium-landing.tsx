import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import {
  Baby,
  Check,
  ChevronDown,
  Heart,
  Moon,
  Sparkles,
  Star,
  WandSparkles,
  X,
} from "lucide-react";
import avatarCamille from "@/assets/cleaned/avatar-camille-clean.png";
import avatarSofia from "@/assets/cleaned/avatar-sofia-clean.png";
import avatarThomas from "@/assets/cleaned/avatar-thomas-clean.png";
import bookOpenStructured from "@/assets/cleaned/book-open-structured-clean.png";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { PremiumBookCover } from "@/components/landing/BookProductMockup";
import { ModernExampleCards } from "@/components/landing/ModernExampleCards";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { StoryKidAppMockup } from "@/components/landing/StoryKidAppMockup";
import { landingBookExamples } from "@/data/landing-examples";

const checks = ["Pas de photo d'enfant", "Pas de carte bancaire", "Aperçu immédiat"];

const testimonials = [
  {
    quote: "On voit tout de suite ce qu'on achète.",
    name: "Camille, maman de Léo",
    avatar: avatarCamille,
  },
  {
    quote: "Le rendu est assez beau pour avoir envie de le garder.",
    name: "Thomas, papa d'Emma",
    avatar: avatarThomas,
  },
  {
    quote: "L'aperçu m'a rassurée avant de payer.",
    name: "Sofia, maman de Noah",
    avatar: avatarSofia,
  },
] satisfies Array<{ quote: string; name: string; avatar: StaticImageData }>;

const inputs = [
  { icon: Moon, title: "Peur du noir", label: "Moment" },
  { icon: Baby, title: "Léo", meta: "4 ans", label: "Enfant" },
  { icon: Sparkles, title: "Poulpe", label: "Détail" },
  { icon: Heart, title: "Se sentir rassuré", label: "Objectif" },
];

const productBenefits = [
  {
    title: "Une couverture qui lui ressemble",
    text: "Son prénom, son moment et une ambiance illustrée qui donnent envie d’ouvrir le livre.",
    visual: "cover",
  },
  {
    title: "Des pages faciles à lire le soir",
    text: "Des scènes courtes, douces et illustrées pour garder son attention jusqu’au bout.",
    visual: "spread",
  },
  {
    title: "Une petite phrase à retenir",
    text: "Une morale simple pour reparler du moment après la lecture, sans faire la leçon.",
    visual: "moral",
  },
];

const howSteps = [
  ["1", "Choisis le moment", "Une peur, une émotion, une rentrée, un anniversaire…"],
  ["2", "Ajoute l'enfant", "Prénom, âge, goûts, petit détail qui compte."],
  ["3", "Choisis le ton", "Doux, magique, drôle, rassurant ou très simple."],
  ["4", "Lis l'aperçu", "Tu vois le rendu avant de payer."],
];

const plans = [
  {
    name: "Aperçu",
    price: "0 €",
    period: "pour essayer",
    description: "Pour voir le rendu sans compte et sans risque.",
    features: ["Premier rendu visible", "Sans compte", "Sans carte bancaire"],
    missingFeatures: ["Histoire complète", "8 à 12 pages", "Audio doux"],
    cta: "Créer un aperçu",
    featured: false,
  },
  {
    name: "Livre digital",
    price: "4,99 €",
    period: "une fois",
    description: "Le meilleur premier achat : simple, immédiat, facile à garder.",
    features: ["Histoire complète", "8 à 12 pages", "Couverture illustrée", "PDF à garder"],
    missingFeatures: [],
    cta: "Débloquer le livre",
    featured: true,
  },
  {
    name: "Livre + audio",
    price: "7,99 €",
    period: "une fois",
    description: "Pour lire ensemble ou écouter l’histoire au moment du coucher.",
    features: ["Tout le livre digital", "Audio narré", "PDF + MP3", "À relire le soir"],
    missingFeatures: [],
    cta: "Choisir livre + audio",
    featured: false,
  },
];

const subscriptionPlan = {
  label: "Pour créer souvent",
  name: "Abonnement parent",
  price: "6,99 €",
  period: "/mois",
  description:
    "4 nouvelles histoires chaque mois pour les petits moments qui reviennent : peurs, émotions, progrès, anniversaires.",
  features: [
    "4 livres digitaux / mois",
    "2 audios inclus",
    "Bibliothèque familiale",
    "Sans engagement",
  ],
};

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff6257]/80">
      {children}
    </p>
  );
}

function EditorialAccent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-editorial font-semibold italic tracking-normal text-[#6b55ef] ${className}`}>
      {children}
    </span>
  );
}

const faqs = [
  {
    question: "Est-ce vraiment personnalisé ?",
    answer:
      "Oui. L’histoire reprend le prénom, l’âge, le moment choisi, les détails donnés et le ton sélectionné. Tu vois un aperçu avant de payer.",
  },
  {
    question: "Dois-je ajouter une photo ?",
    answer:
      "Non. StoryKid n’a pas besoin de photo d’enfant. Le livre est illustré à partir des informations que tu donnes.",
  },
  {
    question: "Puis-je modifier l’histoire ?",
    answer:
      "Oui. Tu peux ajuster les détails ou le ton avant de débloquer le livre complet.",
  },
  {
    question: "Est-ce thérapeutique ?",
    answer:
      "Non. StoryKid ne remplace pas l’avis d’un professionnel. C’est un support doux pour ouvrir la discussion et créer un rituel.",
  },
  {
    question: "Puis-je imprimer le livre ?",
    answer:
      "Oui. La version digitale peut être gardée en PDF et imprimée chez toi si tu le souhaites.",
  },
];

export function PremiumLanding() {
  return (
    <main className="overflow-hidden bg-[#fbfbff] text-[#070b2d]">
      <Hero />
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <TestimonialsStrip />
        </RevealOnScroll>
        <RevealOnScroll delay={0.04}>
          <InputOutputPanel />
        </RevealOnScroll>
        <RevealOnScroll delay={0.04}>
          <WhatChildGetsSection />
        </RevealOnScroll>
        <RevealOnScroll delay={0.04}>
          <ModernExampleCards />
        </RevealOnScroll>
        <RevealOnScroll delay={0.04}>
          <PricingSection />
        </RevealOnScroll>
        <RevealOnScroll delay={0.04}>
          <FAQPanel />
        </RevealOnScroll>
      </div>
      <FinalCTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative bg-[radial-gradient(circle_at_82%_42%,rgba(124,92,255,0.12),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <h1 className="max-w-[560px] text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.065em] text-[#070b2d] sm:text-[4.05rem]">
            Crée une histoire du soir où ton enfant devient le héros.
            <EditorialAccent className="block">En 2 minutes.</EditorialAccent>
          </h1>
          <p className="mt-5 max-w-[500px] text-lg leading-8 text-[#4c5578]">
            Choisis un moment, ajoute quelques détails sur ton enfant, et découvre
            un mini-livre illustré prêt à lire ce soir.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create-story"
              className="inline-flex h-[52px] items-center justify-center rounded-xl bg-[#ff6257] px-8 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.25)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
            >
              Créer mon aperçu gratuit
            </Link>
            <Link
              href="#exemple"
              className="inline-flex h-[52px] items-center justify-center rounded-xl bg-white px-8 text-sm font-extrabold text-[#070b2d] ring-1 ring-[#c7cad8] transition hover:-translate-y-0.5 hover:ring-[#070b2d]"
            >
              Voir un exemple
            </Link>
          </div>
          <div className="mt-5 grid max-w-[520px] gap-2 sm:grid-cols-3">
            {checks.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#5f6886]">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#dff7e5] text-[#24a64a]">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <StoryKidAppMockup />
      </div>
    </section>
  );
}

function TestimonialsStrip() {
  return (
    <section className="-mt-2 pt-5 lg:-mt-5">
      <div className="grid gap-3 md:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="grid min-h-[104px] grid-cols-[60px_1fr] gap-4 rounded-2xl border border-[#e8eaf3] bg-white/90 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.045)] backdrop-blur"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-full shadow-sm ring-1 ring-[#e4e6ef]">
              <Image
                src={item.avatar}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="relative text-[0.95rem] font-extrabold italic leading-5 text-[#141936]">
                <span className="mr-2 text-3xl leading-none text-[#7c5cff]/70">“</span>
                {item.quote}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#626b89]">{item.name}</p>
              <div className="mt-2 flex gap-0.5 text-[#ffb021]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-5 text-center text-sm font-semibold text-[#7a8199]">
        Déjà 800+ aperçus créés par des parents curieux.
      </p>
    </section>
  );
}

function InputOutputPanel() {
  const book = landingBookExamples[0];

  return (
    <section id="fonctionnement" className="py-12 md:py-16 lg:py-24">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <SectionKicker>Fonctionnement</SectionKicker>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
            De 5 détails à une <EditorialAccent>vraie histoire.</EditorialAccent>
          </h2>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-[#626b89]">
            Tu donnes le prénom, l’âge, le moment et le ton. StoryKid transforme
            ces détails en une histoire courte, douce et illustrée.
          </p>
        </div>
      </div>

      <div className="grid items-center gap-5 lg:grid-cols-[1.12fr_84px_1fr]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {inputs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex min-h-[132px] flex-col items-center rounded-2xl border border-[#e9ebf4] bg-white p-4 text-center shadow-[0_12px_32px_rgba(15,23,42,0.035)]"
              >
                <Icon className="mx-auto h-8 w-8 text-[#4e67d8]" />
                <div className="mt-3 flex min-h-[40px] flex-col items-center justify-center">
                  <p className="text-sm font-extrabold leading-5 text-[#151b3a]">{item.title}</p>
                  {item.meta && <p className="text-sm font-extrabold leading-5 text-[#151b3a]">{item.meta}</p>}
                </div>
                <p className="mt-auto pt-2 text-xs font-semibold text-[#747c98]">{item.label}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 text-[#98a0b8] lg:gap-0">
          <span className="hidden h-px flex-1 border-t border-dashed border-[#c7cbd8] lg:block" />
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#20145f] text-white shadow-[0_16px_36px_rgba(32,20,95,0.26)]">
            <WandSparkles className="h-7 w-7" />
          </span>
          <span className="hidden h-px flex-1 border-t border-dashed border-[#c7cbd8] lg:block" />
        </div>
        <div className="grid gap-4 rounded-2xl border border-[#e9ebf4] bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.055)] md:grid-cols-[130px_1fr_1fr]">
          <PremiumBookCover book={book} size="demo" />
          <div className="border-r border-[#e4e6ef] pr-4">
            <p className="text-xs font-extrabold text-[#070b2d]">Page 1</p>
            <p className="mt-3 text-sm leading-6 text-[#4c5578]">{book.excerpt}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#070b2d]">Morale</p>
            <p className="mt-3 text-sm leading-6 text-[#4c5578]">
              La lumière peut être petite, mais elle suffit quand on n'est pas seul.
            </p>
            <Heart className="mt-3 h-4 w-4 fill-[#ff7aa2] text-[#ff7aa2]" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {howSteps.map(([number, title, text]) => (
          <div key={number} className="flex gap-3 rounded-2xl bg-white/60 p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f0edff] text-xs font-extrabold text-[#6b55ef]">
              {number}
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#070b2d]">{title}</p>
              <p className="mt-1 text-xs leading-5 text-[#626b89]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatChildGetsSection() {
  const book = landingBookExamples[0];

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <SectionKicker>Résultat</SectionKicker>
        <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
          Ce que ton enfant reçoit <EditorialAccent>vraiment.</EditorialAccent>
        </h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#626b89]">
          Un mini-livre court, doux, illustré et pensé pour être lu le soir.
        </p>
      </div>
      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {productBenefits.map((item) => (
          <div
            key={item.title}
            className="flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9ebf4] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.055)]"
          >
            <div className="flex h-[242px] items-center justify-center bg-[radial-gradient(circle_at_50%_10%,rgba(124,92,255,0.10),transparent_30%),#fcfcff] p-6">
              {item.visual === "cover" && <PremiumBookCover book={book} size="demo" />}
              {item.visual === "spread" && (
                <Image
                  src={bookOpenStructured}
                  alt="Livre ouvert avec pages illustrées"
                  sizes="340px"
                  className="h-auto w-full"
                />
              )}
              {item.visual === "moral" && (
                <div className="w-full max-w-[230px] rounded-[22px] bg-[#fffaf0] p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-[#eee3ce]">
                  <div className="rounded-[17px] bg-white p-4 text-center">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ff6257]">
                      Morale
                    </p>
                    <p className="mt-3 font-editorial text-xl font-semibold italic leading-snug text-[#070b2d]">
                      “Une petite lumière suffit quand on n’est pas seul.”
                    </p>
                    <Heart className="mx-auto mt-3 h-5 w-5 fill-[#ff7aa2] text-[#ff7aa2]" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-extrabold text-[#070b2d]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4c5578]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="tarifs" className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto mb-9 max-w-2xl text-center">
        <SectionKicker>Tarifs</SectionKicker>
        <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
          Teste gratuitement. Paie seulement si l’histoire <EditorialAccent>te plaît.</EditorialAccent>
        </h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#626b89]">
          L’aperçu est gratuit et sans carte bancaire. Tu débloques le livre complet
          seulement si le rendu te plaît.
        </p>
      </div>

      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={
              plan.featured
                ? "relative flex h-full flex-col rounded-[28px] border-2 border-[#ff6257] bg-white p-6 shadow-[0_22px_60px_rgba(255,98,87,0.13)]"
                : "flex h-full flex-col rounded-[28px] border border-[#e8eaf3] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.055)]"
            }
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ff6257] px-4 py-1 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(255,98,87,0.22)]">
                ★ Offre de lancement
              </span>
            )}
            <p className="text-sm font-extrabold text-[#6b55ef]">{plan.name}</p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-5xl font-extrabold tracking-[-0.065em] text-[#070b2d]">{plan.price}</p>
              <p className="pb-1 text-sm font-extrabold text-[#8a91a6]">{plan.period}</p>
            </div>
            <p className="mt-3 min-h-16 text-sm font-semibold leading-6 text-[#626b89]">
              {plan.description}
            </p>
            <div className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#3f4968]">
                  <Check className="h-4 w-4 shrink-0 text-[#24a64a]" />
                  {feature}
                </p>
              ))}
              {plan.missingFeatures.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#a4a9b8]">
                  <X className="h-4 w-4 shrink-0 text-[#c2c6d3]" />
                  <span className="line-through decoration-[#b4b8c6] decoration-2">{feature}</span>
                </p>
              ))}
            </div>
            <Link
              href={plan.featured ? "/pricing" : plan.name === "Aperçu" ? "/create-story" : "/pricing"}
              className={
                plan.featured
                  ? "mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#ff6257] text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(255,98,87,0.2)]"
                  : "mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#cfd3e1] bg-white text-sm font-extrabold text-[#070b2d] transition hover:border-[#070b2d]"
              }
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-7 rounded-[26px] border border-[#d8d2ff] bg-[#f7f4ff]/75 p-5 shadow-[0_16px_42px_rgba(91,71,210,0.07)] md:grid md:grid-cols-[1.1fr_1fr_auto] md:items-center md:gap-6 md:p-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6b55ef]">{subscriptionPlan.label}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.045em] text-[#070b2d]">
            {subscriptionPlan.name}
          </h3>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#626b89]">
            {subscriptionPlan.description}
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 md:mt-0">
          {subscriptionPlan.features.map((feature) => (
            <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#3f4968]">
              <Check className="h-4 w-4 shrink-0 text-[#6b55ef]" />
              {feature}
            </p>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4 text-left shadow-[0_12px_30px_rgba(91,71,210,0.08)] md:mt-0 md:min-w-[188px]">
          <div className="flex items-end gap-1">
            <p className="text-4xl font-extrabold tracking-[-0.065em] text-[#070b2d]">
              {subscriptionPlan.price}
            </p>
            <p className="pb-1 text-sm font-extrabold text-[#8a91a6]">
              {subscriptionPlan.period}
            </p>
          </div>
          <Link
            href="/pricing"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#c9c3ff] bg-white text-sm font-extrabold text-[#6b55ef] transition hover:border-[#6b55ef] hover:bg-[#f2efff]"
          >
            Voir l’abonnement
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQPanel() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <SectionKicker>FAQ</SectionKicker>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em]">
            Questions <EditorialAccent>fréquentes</EditorialAccent>
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#626b89]">
            Les réponses importantes avant de créer un premier aperçu.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[#e8eaf3] bg-white shadow-[0_14px_38px_rgba(15,23,42,0.045)]"
            >
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-extrabold text-[#070b2d] marker:hidden">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-[#626b89] transition group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 pt-0 text-[15px] font-semibold leading-7 text-[#626b89]">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm font-semibold text-[#626b89]">
          Une autre question ?{" "}
          <a
            href="mailto:hello@storykid.app"
            className="font-extrabold text-[#6b55ef] underline decoration-[#d8d2ff] underline-offset-4 transition hover:text-[#ff6257]"
          >
            Écris-nous, on répond vraiment.
          </a>
        </p>
      </div>
    </section>
  );
}
