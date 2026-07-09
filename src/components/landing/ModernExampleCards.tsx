"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  KeepsakeStrip,
  PremiumBookCover,
  PremiumBookSpread,
} from "@/components/landing/BookProductMockup";
import { landingBookExamples, type LandingBookExample } from "@/data/landing-examples";

export function ModernExampleCards() {
  const [selected, setSelected] = useState<LandingBookExample | null>(null);

  return (
    <section
      id="exemple"
      className="relative scroll-mt-24 py-12 md:py-16 lg:py-24"
    >
      <button
        type="button"
        aria-label="Exemple précédent"
        className="absolute -left-12 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#070b2d] shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ring-[#e4e6ef] lg:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Exemple suivant"
        className="absolute -right-12 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#070b2d] shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ring-[#e4e6ef] lg:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff6257]/80">
            Exemples
          </p>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em] md:text-[2.65rem] md:leading-tight">
            Des histoires pour les moments qui comptent.
          </h2>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#626b89]">
            Chaque livre part d'une situation réelle : une peur, une rentrée,
            une émotion, une victoire.
          </p>
          <Link
            href="/create-story"
            className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#6b55ef] md:hidden"
          >
            Voir plus d'exemples
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Link
          href="/create-story"
          className="hidden items-center gap-2 text-sm font-extrabold text-[#6b55ef] md:inline-flex"
        >
          Voir plus d'exemples
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {landingBookExamples.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => setSelected(book)}
            className="group grid h-full min-h-[184px] cursor-pointer grid-cols-[126px_1fr] gap-3 rounded-[24px] border border-[#e9ebf4] bg-white p-3 text-left shadow-[0_18px_48px_rgba(15,23,42,0.055)] transition hover:-translate-y-1 hover:border-[#cfd3e1] hover:shadow-[0_24px_68px_rgba(15,23,42,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6257] min-[400px]:grid-cols-[140px_1fr] md:grid-cols-[148px_1fr] md:gap-4 lg:min-h-[194px]"
            style={
              {
                "--book-wash": book.palette.wash,
              } as CSSProperties
            }
          >
            <div className="relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(145deg,var(--book-wash),#fff)] px-2 py-4 md:min-h-[170px] md:px-3">
              <PremiumBookCover
                book={book}
                size="demo"
                className="max-w-[100px] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg] min-[400px]:max-w-[108px] md:max-w-[112px]"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center py-2">
              <p className="text-base font-extrabold leading-tight text-[#070b2d]">{book.title}</p>
              <p className="mt-2 text-sm font-semibold text-[#626b89]">
                {book.theme} · {book.child}
              </p>
              <span className="mt-5 inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#c7cad8] bg-white px-3 text-xs font-extrabold text-[#070b2d] min-[400px]:px-4">
                Lire l'exemple
              </span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#070b2d]/48 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Exemple ${selected.title}`}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[32px] bg-white p-4 shadow-[0_34px_110px_rgba(0,0,0,0.28)]"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer l'exemple"
                className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#070b2d] shadow-sm ring-1 ring-[#e4e6ef] transition hover:bg-[#fbfbff]"
              >
                <X className="h-5 w-5" />
              </button>

              <div
                className="grid gap-5 md:grid-cols-[0.85fr_1.35fr]"
                style={{ "--book-wash": selected.palette.wash } as CSSProperties}
              >
                <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.9),transparent_28%),linear-gradient(150deg,var(--book-wash),#fff)] p-6">
                  <PremiumBookCover book={selected} size="modal" />
                  <div className="mt-8">
                    <KeepsakeStrip book={selected} />
                  </div>
                </div>

                <div className="p-2 md:p-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#6b55ef]">
                    {selected.theme}
                  </p>
                  <h3 className="mt-3 text-4xl font-extrabold leading-[0.98] tracking-[-0.055em] text-[#070b2d] md:text-5xl">
                    {selected.title}
                  </h3>
                  <p className="mt-2 text-base font-semibold text-[#626b89]">
                    {selected.child} · {selected.tag}
                  </p>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4c5578]">
                    {selected.promise}
                  </p>

                  <div className="mt-7">
                    <PremiumBookSpread book={selected} />
                  </div>

                  <Link
                    href="/create-story"
                    className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
                  >
                    Créer un aperçu similaire
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
