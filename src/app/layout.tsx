import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

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
    "Creez un mini-livre personnalise et illustre pour votre enfant en quelques minutes. Apercu gratuit, sans compte et sans photo d'enfant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${sans.variable} ${editorial.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
