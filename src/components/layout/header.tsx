import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navItems = [
  { href: "/#exemple", label: "Exemples" },
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ececf4] bg-white/90 backdrop-blur-xl">
      <Container className="flex h-[64px] items-center justify-between gap-3">
        <BrandLogo />
        <nav className="hidden items-center gap-10 text-sm font-semibold text-[#303856] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="h-10 shrink-0 rounded-xl bg-[#ff6257] px-3 text-xs font-extrabold text-white shadow-[0_12px_28px_rgba(255,98,87,0.24)] hover:bg-[#f2554a] sm:px-5 sm:text-sm">
          <Link href="/create-story">
            <span className="hidden sm:inline">Créer gratuitement</span>
            <span className="sm:hidden">Aperçu gratuit</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Container>
    </header>
  );
}
