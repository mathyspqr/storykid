import Link from "next/link";
import { HeaderAccount } from "@/components/layout/header-account";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navItems = [
  { href: "/#exemple", label: "Exemples" },
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
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
        <HeaderAccount />
      </Container>
    </header>
  );
}
