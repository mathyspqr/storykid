"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { BookPage } from "@/components/book/BookPage";
import type { StoryBook } from "@/types/book";

export function MobileBookReader({ book }: { book: StoryBook }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pages = useMemo(
    () => book.pages.filter((page) => page.type !== "cover"),
    [book.pages],
  );
  const page = pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pages.length - 1;

  if (!isOpen) {
    return (
      <div className="lg:hidden">
        <div className="mx-auto max-w-[330px] rounded-[28px] bg-white/78 p-5 text-center shadow-[0_24px_64px_rgba(15,23,42,0.13)] ring-1 ring-[#eceef6]">
          <div className="relative mx-auto max-w-[210px]">
            <div className="absolute -bottom-6 left-8 right-8 h-12 rounded-[50%] bg-slate-950/18 blur-xl" />
            {book.coverImage && (
              <Image
                src={book.coverImage}
                alt={`Couverture du livre ${book.title}`}
                sizes="240px"
                className="relative h-auto w-full drop-shadow-[16px_22px_36px_rgba(15,23,42,0.24)]"
              />
            )}
          </div>
          <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff6257]">
            Aperçu interactif
          </p>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.05em] text-[#070b2d]">
            Feuillette le mini-livre avant de payer.
          </h3>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.22)]"
          >
            Ouvrir le livre
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <div className="relative mx-auto max-w-[330px]">
        <div className="absolute -bottom-7 left-8 right-8 h-12 rounded-[50%] bg-slate-950/18 blur-2xl" />
        <div className="relative h-[500px] overflow-hidden rounded-[28px] border border-[#e6e8f1] bg-[#fffaf0] shadow-[0_26px_70px_rgba(15,23,42,0.18)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 && !isLast) setPageIndex((current) => current + 1);
                if (info.offset.x > 60 && !isFirst) setPageIndex((current) => current - 1);
              }}
              initial={{ opacity: 0, x: 42, rotateY: -12 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -42, rotateY: 12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="h-full"
            >
              <BookPage book={book} page={page} compact />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
          disabled={isFirst}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#d9dce8] bg-white text-[#070b2d] shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-[104px] text-center text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a91a6]">
          {pageIndex + 1} / {pages.length}
        </p>
        <button
          type="button"
          onClick={() => setPageIndex((current) => Math.min(pages.length - 1, current + 1))}
          disabled={isLast}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#d9dce8] bg-white text-[#070b2d] shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
