"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { StoryBookPage } from "@/components/book/StoryBookPage";
import type { StoryBook } from "@/types/book";

const bookAsset = (name: string) => `/assets/livre-3d/${name}`;

type MobilePageTurn = {
  direction: "next" | "prev";
};

export function StoryBookMobileReader({
  book,
  onPrimaryAction,
}: {
  book: StoryBook;
  onPrimaryAction?: () => void;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageTurn, setPageTurn] = useState<MobilePageTurn | null>(null);
  const displayPageIndex = pageTurn
    ? pageTurn.direction === "next"
      ? Math.min(book.pages.length - 1, pageIndex + 1)
      : Math.max(0, pageIndex - 1)
    : pageIndex;
  const page = book.pages[displayPageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === book.pages.length - 1;
  const isTurning = Boolean(pageTurn);

  const completeTurn = () => {
    if (!pageTurn) return;
    setPageIndex((current) =>
      pageTurn.direction === "next"
        ? Math.min(book.pages.length - 1, current + 1)
        : Math.max(0, current - 1),
    );
    setPageTurn(null);
  };

  const startTurn = (direction: "next" | "prev") => {
    if (isTurning) return;
    if (direction === "next" && !isLast) setPageTurn({ direction });
    if (direction === "prev" && !isFirst) setPageTurn({ direction });
  };

  return (
    <motion.div
      key="open-mobile"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col justify-center px-4 py-4 lg:hidden"
    >
      <div className="mb-4 text-left text-white">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff9d95]">
          Lecture en ligne
        </p>
        <h2 className="mt-1 text-2xl font-extrabold leading-tight tracking-normal">
          {book.title}
        </h2>
        <p className="mt-1 text-sm font-bold text-white/62">
          {book.childName}
          {book.age ? `, ${book.age}` : ""} · {book.theme}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[352px]">
        <div
          className="pointer-events-none absolute -bottom-[8%] left-[4%] h-[24%] w-[92%] bg-contain bg-center bg-no-repeat opacity-40 blur-[2px]"
          style={{ backgroundImage: `url(${bookAsset("book-cover-shadow.png")})` }}
        />
        <div
          className="relative h-[520px] overflow-hidden rounded-[30px] shadow-[0_30px_88px_rgba(0,0,0,0.34)] ring-1 ring-white/18"
          onPointerUp={(event) => {
            const target = event.currentTarget;
            const startX = Number(target.dataset.startX ?? 0);
            const delta = event.clientX - startX;
            if (delta < -56) startTurn("next");
            if (delta > 56) startTurn("prev");
          }}
          onPointerDown={(event) => {
            event.currentTarget.dataset.startX = String(event.clientX);
          }}
        >
          <div
            className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bookAsset("book-inner-page-right.png")})` }}
          />
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
            style={{ backgroundImage: `url(${bookAsset("book-paper-texture.png")})`, backgroundSize: "240px 240px" }}
          />
          <StoryBookPage
            book={book}
            page={page}
            side="single"
            onPrimaryAction={onPrimaryAction}
            className="bg-transparent p-5"
          />
          {pageTurn && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20 origin-left"
              initial={{ opacity: 0.26, x: 0, rotateY: 0 }}
              animate={{
                opacity: [0.26, 0.34, 0],
                x: pageTurn.direction === "next" ? [-2, -24, -46] : [2, 24, 46],
                rotateY: pageTurn.direction === "next" ? [0, -8, -16] : [0, 8, 16],
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={completeTurn}
            >
              <div
                className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat drop-shadow-[0_10px_20px_rgba(0,0,0,0.10)]"
                style={{ backgroundImage: `url(${bookAsset("book-page-turn-overlay.png")})` }}
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => startTurn("prev")}
          disabled={isFirst || isTurning}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-[104px] text-center text-xs font-extrabold uppercase tracking-[0.18em] text-white/62">
          {pageIndex + 1} / {book.pages.length}
        </p>
        <button
          type="button"
          onClick={() => startTurn("next")}
          disabled={isLast || isTurning}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
