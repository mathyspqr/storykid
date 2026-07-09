"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { StoryBookPage } from "@/components/book/StoryBookPage";
import type { StoryBook, StoryBookPage as StoryBookPageType } from "@/types/book";

type MobilePageTurn = {
  direction: "next" | "prev";
  page: StoryBookPageType;
};

export function StoryBookMobileReader({ book }: { book: StoryBook }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageTurn, setPageTurn] = useState<MobilePageTurn | null>(null);
  const page = book.pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === book.pages.length - 1;
  const isTurning = Boolean(pageTurn);

  const startTurn = (direction: "next" | "prev") => {
    if (isTurning) return;
    if (direction === "next" && !isLast) setPageTurn({ direction, page });
    if (direction === "prev" && !isFirst) setPageTurn({ direction, page });
  };

  const completeTurn = () => {
    if (!pageTurn) return;
    setPageIndex((current) =>
      pageTurn.direction === "next"
        ? Math.min(book.pages.length - 1, current + 1)
        : Math.max(0, current - 1),
    );
    setPageTurn(null);
  };

  return (
    <motion.div
      key="open-mobile"
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.34, ease: "easeOut" }}
      className="flex h-full flex-col justify-center px-4 py-5 lg:hidden"
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

      <div className="relative mx-auto w-full max-w-[350px]">
        <div className="absolute -bottom-7 left-8 right-8 h-12 rounded-[50%] bg-black/38 blur-2xl" />
        <div className="relative h-[520px] overflow-hidden rounded-[30px] bg-[#fff8ea] shadow-[0_30px_88px_rgba(0,0,0,0.34)] ring-1 ring-white/18 [perspective:1400px]">
          <motion.div
            key={page.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) startTurn("next");
              if (info.offset.x > 60) startTurn("prev");
            }}
            className="h-full"
          >
            <StoryBookPage book={book} page={page} side="single" />
          </motion.div>
          {pageTurn && (
            <motion.div
              key={`${pageTurn.direction}-${pageTurn.page.id}`}
              className={
                pageTurn.direction === "next"
                  ? "pointer-events-none absolute inset-0 z-20 origin-left overflow-hidden rounded-[30px] bg-[#fff8ea] shadow-[-18px_0_34px_rgba(7,11,45,0.18)] [backface-visibility:hidden] [transform-style:preserve-3d]"
                  : "pointer-events-none absolute inset-0 z-20 origin-right overflow-hidden rounded-[30px] bg-[#fff8ea] shadow-[18px_0_34px_rgba(7,11,45,0.18)] [backface-visibility:hidden] [transform-style:preserve-3d]"
              }
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageTurn.direction === "next" ? -174 : 174 }}
              transition={{ duration: 0.62, ease: [0.2, 0.72, 0.17, 1] }}
              onAnimationComplete={completeTurn}
            >
              <StoryBookPage book={book} page={pageTurn.page} side="single" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18),transparent_25%,rgba(255,255,255,0.20)_72%,rgba(0,0,0,0.12))]" />
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
