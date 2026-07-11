import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const editorial = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "StoryKid - Mini-livres personnalises pour enfants",
  description:
    "Préparez un mini-livre personnalisé et illustré pour votre enfant, sans compte et sans photo d’enfant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${sans.variable} ${editorial.variable} font-sans antialiased`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
