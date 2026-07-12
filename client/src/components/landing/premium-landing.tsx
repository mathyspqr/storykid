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

const checks = ["Pas de photo d'enfant", "Pas de carte bancaire", "Aperçu en ligne immédiat"];

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
    text: "Son prénom, son moment et une ambiance illustrée pour qu’il ait envie d’ouvrir le livre.",
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
  ["2", "Ajoute l'enfant", "Seulement son prénom et son âge."],
  ["3", "Choisis le ton", "Doux, magique, drôle, rassurant ou très simple."],
  ["4", "Lis l'aperçu", "Tu vois le rendu avant de payer."],
];

const plans = [
  {
    name: "Aperçu",
    price: "0 €",
    period: "pour essayer",
    description: "Découvrez la couverture et les deux premières pages avant de décider.",
    features: ["Couverture personnalisée", "2 premières pages illustrées", "Lecture 3D et classique", "Sans carte bancaire"],
    lockedFeatures: ["Histoire complète · 8 pages", "Toutes les illustrations", "PDF à télécharger", "Accès permanent en bibliothèque"],
    cta: "Créer un aperçu",
    featured: false,
  },
  {
    name: "Histoire StoryKid",
    price: "3,99 €",
    period: "une fois",
    description: "Toute l’histoire illustrée, à lire en ligne et à garder pour toujours.",
    features: ["Histoire complète · 8 pages", "Toutes les illustrations", "Couverture personnalisée", "Lecture 3D et classique", "PDF à télécharger", "Accès permanent en bibliothèque"],
    cta: "Créer mon histoire",
    featured: true,
  },
];

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
      "Oui. L’histoire reprend le prénom, l’âge, le moment choisi, les détails donnés et le ton sélectionné. StoryKid est pensé pour les enfants de 3 à 9 ans.",
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
      "Le livre est actuellement conçu pour une lecture en ligne. Le téléchargement sera proposé uniquement lorsqu’il sera disponible de façon fiable.",
  },
];

export function PremiumLanding() {
  return (
    <main className="overflow-hidden bg-[#fbfbff] text-[#070b2d]">
      <Hero />
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 lg:px-8 lg:pb-14">
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
    <section className="relative bg-[radial-gradient(circle_at_82%_42%,rgba(124,92,255,0.12),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] px-5 py-9 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-9">
        <div>
          <h1 className="max-w-[630px] text-[2.12rem] font-extrabold leading-[1.04] tracking-[-0.055em] text-[#070b2d] min-[390px]:text-[2.32rem] sm:text-[4.05rem] sm:leading-[1.02] sm:tracking-[-0.065em]">
            Une histoire personnalisée
            <span className="block">pour les moments de l’enfance.</span>
            <EditorialAccent className="block">En 2 minutes.</EditorialAccent>
          </h1>
          <p className="mt-4 max-w-[500px] text-base font-semibold leading-7 text-[#4c5578] sm:mt-5 sm:text-lg sm:font-normal sm:leading-8">
            Peur du noir, rentrée, colère ou confiance : crée une histoire douce
            où ton enfant devient le héros, à lire en ligne ce soir.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/creer"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-[#ff6257] px-8 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.25)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] sm:w-auto"
            >
              Créer mon aperçu gratuit
            </Link>
            <Link
              href="#exemple"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-white px-8 text-sm font-extrabold text-[#070b2d] ring-1 ring-[#c7cad8] transition hover:-translate-y-0.5 hover:ring-[#070b2d] sm:w-auto"
            >
              Voir un exemple
            </Link>
          </div>
          <div className="mt-5 flex max-w-[520px] flex-wrap gap-x-4 gap-y-2">
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
    <section className="pt-7 lg:-mt-5 lg:pt-5">
      <div className="grid gap-3 md:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="grid min-h-[104px] grid-cols-[60px_1fr] gap-4 rounded-2xl border border-[#e8eaf3] bg-white/90 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.045)] backdrop-blur"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-full shadow-sm ring-1 ring-[#e4e6ef]">
              <Image src={item.avatar} alt="" fill sizes="64px" className="object-cover" />
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
      <div className="mt-5 flex justify-center">
        <p className="rounded-full border border-[#e7e4ff] bg-white/76 px-4 py-2 text-center text-xs font-extrabold text-[#6b55ef] shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
          800+ aperçus créés · paiement seulement si le rendu plaît
        </p>
      </div>
    </section>
  );
}

function InputOutputPanel() {
  const book = landingBookExamples[0];

  return (
    <section id="fonctionnement" className="scroll-mt-24 py-12 md:py-14 lg:py-16">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <SectionKicker>Fonctionnement</SectionKicker>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
            De 5 détails à une <EditorialAccent>vraie histoire.</EditorialAccent>
          </h2>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-[#626b89]">
            Choisis le moment, ajoute quelques détails, et StoryKid crée une
            histoire douce autour de ton enfant.
          </p>
        </div>
      </div>

      <div className="grid items-center gap-4 lg:grid-cols-[1.12fr_72px_1fr] lg:gap-4">
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
        <div className="flex items-center justify-center gap-4 py-1 text-[#98a0b8] lg:gap-0 lg:py-0">
          <span className="hidden h-px flex-1 border-t border-dashed border-[#c7cbd8] lg:block" />
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#20145f] text-white shadow-[0_16px_36px_rgba(32,20,95,0.26)]">
            <WandSparkles className="h-6 w-6" />
          </span>
          <span className="hidden h-px flex-1 border-t border-dashed border-[#c7cbd8] lg:block" />
        </div>
        <div className="grid gap-4 rounded-2xl border border-[#e9ebf4] bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.055)] md:grid-cols-[130px_1fr_1fr]">
          <PremiumBookCover book={book} size="demo" />
          <div className="border-[#e4e6ef] md:border-r md:pr-4">
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
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
    <section className="py-14 md:py-16 lg:py-24">
      <div className="mx-auto mb-8 max-w-2xl text-left md:mb-10 md:text-center">
        <SectionKicker>Résultat</SectionKicker>
        <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
          Ce que ton enfant reçoit <EditorialAccent>vraiment.</EditorialAccent>
        </h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#626b89]">
          Un livre digital, court et illustré, pensé pour être lu le soir.
        </p>
      </div>
      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {productBenefits.map((item) => (
          <div
            key={item.title}
            className="flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9ebf4] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.055)]"
          >
            <div className="flex h-[220px] items-center justify-center bg-[radial-gradient(circle_at_50%_10%,rgba(124,92,255,0.10),transparent_30%),#fcfcff] p-5 md:h-[242px] md:p-6">
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
    <section id="tarifs" className="scroll-mt-24 py-14 md:py-16 lg:py-24">
      <div className="mx-auto mb-8 max-w-2xl text-left md:mb-9 md:text-center">
        <SectionKicker>Tarifs</SectionKicker>
        <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-4xl">
          Teste gratuitement. Paie seulement si l’histoire <EditorialAccent>te plaît.</EditorialAccent>
        </h2>
      </div>

      <div className="mx-auto grid max-w-[780px] items-stretch gap-5 md:grid-cols-2">
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
            <p className="mt-3 text-sm font-semibold leading-6 text-[#626b89] md:min-h-16">
              {plan.description}
            </p>
            <div className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#3f4968]">
                  <Check className="h-4 w-4 shrink-0 text-[#24a64a]" />
                  {feature}
                </p>
              ))}
              {plan.lockedFeatures?.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-[#a2a7b7] line-through decoration-[#c9cdd8] decoration-2">
                  <Check className="h-4 w-4 shrink-0 text-[#c6cad5]" />
                  {feature}
                </p>
              ))}
            </div>
            <Link
              href="/creer"
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

    </section>
  );
}

function FAQPanel() {
  return (
    <section id="faq" className="scroll-mt-24 pb-2 pt-12 md:pb-4 md:pt-16 lg:pb-4 lg:pt-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 text-left md:mb-8 md:text-center">
          <SectionKicker>FAQ</SectionKicker>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em]">
            Questions <EditorialAccent>fréquentes</EditorialAccent>
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#626b89]">
            Tout ce qu’il faut savoir avant de créer ton premier aperçu.
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
