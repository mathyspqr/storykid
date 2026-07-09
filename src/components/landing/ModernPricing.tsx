import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Apercu",
    price: "0 €",
    description: "Pour verifier le ton, le theme et la premiere direction.",
    features: ["Sans compte", "Sans carte bancaire", "Premier rendu visible"],
    cta: "Creer mon apercu",
    href: "/create-story",
    featured: false,
  },
  {
    name: "Livre digital",
    price: "4,99 €",
    description: "Le mini-livre complet, pret a lire sur mobile, tablette ou ordinateur.",
    features: ["8 pages illustrees", "Texte structure", "Conseils de lecture"],
    cta: "Debloquer le livre",
    href: "/pricing",
    featured: true,
  },
  {
    name: "Livre + audio",
    price: "7,99 €",
    description: "Une version a lire et a ecouter pour installer le rituel du soir.",
    features: ["Livre digital complet", "Version audio", "Lecture du soir facilitee"],
    cta: "Voir l'offre",
    href: "/pricing",
    featured: false,
  },
];

export function ModernPricing() {
  return (
    <section id="tarifs" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b4a]">
            Tarifs
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Teste gratuitement. Garde le livre si tu l'aimes.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            L'apercu est gratuit. Tu paies seulement pour debloquer le livre complet.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? "relative rounded-[28px] bg-[#0f172a] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                  : "rounded-[28px] border border-slate-950/[0.08] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
              }
            >
              {plan.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-white/12 px-3 py-1 text-xs font-extrabold text-white/80 ring-1 ring-white/12">
                  Le plus choisi
                </span>
              )}
              <p
                className={
                  plan.featured
                    ? "text-sm font-extrabold text-[#ffb199]"
                    : "text-sm font-extrabold text-[#7c5cff]"
                }
              >
                {plan.name}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-extrabold tracking-[-0.05em]">
                  {plan.price}
                </span>
              </div>
              <p
                className={
                  plan.featured
                    ? "mt-4 min-h-16 text-sm leading-6 text-white/68"
                    : "mt-4 min-h-16 text-sm leading-6 text-slate-500"
                }
              >
                {plan.description}
              </p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-semibold">
                    <span
                      className={
                        plan.featured
                          ? "grid h-6 w-6 place-items-center rounded-full bg-white/12 text-[#62d28f]"
                          : "grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[#0f172a]"
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href={plan.href}
                className={
                  plan.featured
                    ? "mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6b4a] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#f45f3e]"
                    : "mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                }
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
