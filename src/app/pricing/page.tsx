import { Container } from "@/components/layout/container";
import { PricingCard } from "@/components/pricing/pricing-card";
import { SectionTitle } from "@/components/section-title";

const plans = [
  {
    name: "Apercu gratuit",
    price: "0 EUR",
    description: "Pour voir si StoryKid parle vraiment a votre famille.",
    features: ["Apercu court", "1 histoire demo", "Sans carte bancaire"],
    cta: "Tester l'aperçu",
  },
  {
    name: "Histoire digitale",
    price: "4,99 EUR",
    description: "Le livre complet a relire au coucher ou pendant un changement.",
    features: ["Histoire complete", "PDF", "Modifications simples"],
    cta: "Bientot disponible",
    disabled: true,
  },
  {
    name: "Histoire + audio",
    price: "7,99 EUR",
    description: "Pour transformer l'histoire en rituel audio du soir.",
    features: ["Histoire complete", "PDF", "Audio raconte", "Couverture personnalisee"],
    cta: "Bientot disponible",
    highlighted: true,
    disabled: true,
  },
  {
    name: "Livre imprime",
    price: "des 24,99 EUR",
    description: "Un souvenir physique pour une etape qui compte.",
    features: ["Livre physique", "Couverture personnalisee", "Livraison domicile"],
    cta: "Bientot disponible",
    disabled: true,
  },
];

export default function PricingPage() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <SectionTitle
          eyebrow="Tarifs"
          title="Moins complique qu'un livre personnalise classique."
          description="Commencez par un aperçu gratuit. Si l'histoire touche juste, gardez-la en digital, en audio ou en livre imprime."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink/10 bg-white/65 p-5 text-sm leading-6 text-ink/65">
          StoryKid cree des histoires educatives et rassurantes. Le produit ne
          remplace pas l'avis d'un professionnel de sante, de l'enfance ou de
          l'accompagnement familial.
        </div>
      </Container>
    </main>
  );
}
