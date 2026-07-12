import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/layout/container";

const productLinks = [
  { label: "Exemples", href: "/#exemple" },
  { label: "Fonctionnement", href: "/#fonctionnement" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Créer un aperçu", href: "/creer" },
];

const trustLinks = [
  { label: "Support", href: "mailto:hello@storykid.app" },
  { label: "Confidentialité", href: "/privacy" },
  { label: "Conditions", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#eceef6] bg-[#fbfbff] py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1.35fr_0.8fr_0.8fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-[#626b89]">
              Des mini-livres personnalisés pour accompagner les petits moments de l’enfance.
              Aperçu gratuit, sans compte et sans photo d’enfant.
            </p>
          </div>

          <nav aria-label="Produit">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a91a6]">
              Produit
            </p>
            <div className="mt-4 grid gap-3">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-bold text-[#3f4968] transition hover:text-[#ff6257]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Confiance">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a91a6]">
              Confiance
            </p>
            <div className="mt-4 grid gap-3">
              {trustLinks.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold text-[#3f4968] transition hover:text-[#ff6257]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold text-[#3f4968] transition hover:text-[#ff6257]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </nav>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-[#eceef6] pt-5 text-xs font-semibold text-[#8a91a6] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StoryKid. Tous droits réservés.</p>
          <p>
            StoryKid aide à créer un moment de lecture. Il ne remplace pas l’avis
            d’un professionnel de l’enfance ou de santé.
          </p>
        </div>
      </Container>
    </footer>
  );
}
