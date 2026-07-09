"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { BookPage } from "@/components/book/BookPage";
import type { StoryBook } from "@/types/book";

export function DesktopFlipBook({ book }: { book: StoryBook }) {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const pages = useMemo(
    () => book.pages.filter((page) => page.type !== "cover"),
    [book.pages],
  );
  const totalSpreads = Math.max(1, Math.ceil(pages.length / 2));
  const leftPage = pages[spreadIndex * 2];
  const rightPage = pages[spreadIndex * 2 + 1];
  const canGoBack = spreadIndex > 0;
  const canGoNext = spreadIndex < totalSpreads - 1;

  if (!isOpen) {
    return (
      <div className="hidden lg:block">
        <div className="mx-auto grid max-w-[760px] grid-cols-[330px_1fr] items-center gap-10 rounded-[32px] bg-white/72 p-8 shadow-[0_26px_76px_rgba(15,23,42,0.10)] ring-1 ring-[#eceef6]">
          <div className="relative">
            <div className="absolute -bottom-8 left-8 right-8 h-14 rounded-[50%] bg-slate-950/18 blur-2xl" />
            {book.coverImage && (
              <Image
                src={book.coverImage}
                alt={`Couverture du livre ${book.title}`}
                sizes="320px"
                className="relative h-auto w-full drop-shadow-[18px_26px_42px_rgba(15,23,42,0.24)]"
              />
            )}
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff6257]">
              Aperçu interactif
            </p>
            <h3 className="mt-3 text-4xl font-extrabold leading-[0.98] tracking-[-0.06em] text-[#070b2d]">
              Feuillette le mini-livre avant de payer.
            </h3>
            <p className="mt-4 text-base font-semibold leading-7 text-[#626b89]">
              Lis quelques pages, découvre la morale et vois si l’histoire touche juste.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-6 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.24)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
            >
              Ouvrir le livre
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <div className="relative mx-auto max-w-[900px]">
        <div className="absolute -bottom-8 left-20 right-20 h-14 rounded-[50%] bg-slate-950/16 blur-2xl" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={spreadIndex}
            initial={{ opacity: 0, x: 34, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -34, rotateY: 5 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative grid h-[510px] grid-cols-2 overflow-hidden rounded-[30px] bg-[#fffaf0] shadow-[0_28px_80px_rgba(15,23,42,0.16)] ring-1 ring-[#e6e1d5]"
          >
            {leftPage && (
              <BookPage
                book={book}
                page={leftPage}
                className="rounded-l-[30px] border-r border-[#e9dfcc]"
              />
            )}
            {rightPage ? (
              <BookPage book={book} page={rightPage} className="rounded-r-[30px]" />
            ) : (
              <div className="grid h-full place-items-center bg-[#fffaf0] p-8 text-center">
                <p className="font-editorial text-3xl font-semibold italic text-[#6b55ef]">
                  Fin de l’aperçu
                </p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(7,11,45,0.08),rgba(255,255,255,0.55),rgba(7,11,45,0.08))]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setSpreadIndex((current) => Math.max(0, current - 1))}
          disabled={!canGoBack}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#d9dce8] bg-white text-[#070b2d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6b55ef] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Double-page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-[132px] text-center text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a91a6]">
          {spreadIndex + 1} / {totalSpreads}
        </p>
        <button
          type="button"
          onClick={() => setSpreadIndex((current) => Math.min(totalSpreads - 1, current + 1))}
          disabled={!canGoNext}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#d9dce8] bg-white text-[#070b2d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6b55ef] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Double-page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
