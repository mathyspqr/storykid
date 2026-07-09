"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { StoryBookReader } from "@/components/book/StoryBookReader";
import { PremiumBookCover } from "@/components/landing/BookProductMockup";
import { exampleBookById } from "@/data/example-books";
import { landingBookExamples } from "@/data/landing-examples";
import type { StoryBook } from "@/types/book";

export function ModernExampleCards() {
  const [selected, setSelected] = useState<StoryBook | null>(null);

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
            Des histoires pour les petits moments qui comptent.
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
            onClick={() => setSelected(exampleBookById[book.id])}
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

      <StoryBookReader
        book={selected}
        mode="example"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
