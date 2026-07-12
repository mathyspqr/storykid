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
    href: "/creer",
  },
  {
    name: "Histoire courte",
    price: "3,99 EUR",
    description: "Un mini-livre personnalise a relire au coucher ou pendant un changement.",
    features: ["6 pages illustrees", "Couverture personnalisee", "Bibliotheque permanente"],
    cta: "Creer mon histoire",
    href: "/creer",
  },
  {
    name: "Histoire complete",
    price: "3,99 EUR",
    description: "Une aventure plus developpee, illustree et accessible a tout moment.",
    features: ["8 pages illustrees", "Couverture personnalisee", "Bibliotheque permanente"],
    cta: "Creer mon histoire",
    href: "/creer",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <SectionTitle
          eyebrow="Tarifs"
          title="Moins complique qu'un livre personnalise classique."
          description="Commencez par un aperçu gratuit. Vous ne payez qu'après avoir vu la couverture et lu la première page."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
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
