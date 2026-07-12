"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFocusedExperience = ["/creer","/connexion","/compte","/bibliotheque","/paiement"].some(prefix=>pathname.startsWith(prefix)) || pathname.startsWith("/livre/");

  if (isFocusedExperience) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
