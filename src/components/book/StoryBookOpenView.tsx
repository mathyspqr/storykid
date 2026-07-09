"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StoryBookPage } from "@/components/book/StoryBookPage";
import type { StoryBook, StoryBookPage as StoryBookPageType } from "@/types/book";

type PageTurn = {
  direction: "next" | "prev";
  page: StoryBookPageType;
};

export function StoryBookOpenView({ book }: { book: StoryBook }) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pageTurn, setPageTurn] = useState<PageTurn | null>(null);
  const spreads = useMemo(() => {
    const result = [];
    for (let index = 0; index < book.pages.length; index += 2) {
      result.push([book.pages[index], book.pages[index + 1]] as const);
    }
    return result;
  }, [book.pages]);
  const displaySpreadIndex = pageTurn
    ? pageTurn.direction === "next"
      ? Math.min(spreads.length - 1, spreadIndex + 1)
      : Math.max(0, spreadIndex - 1)
    : spreadIndex;
  const [leftPage, rightPage] = spreads[displaySpreadIndex] ?? [];
  const [currentLeftPage, currentRightPage] = spreads[spreadIndex] ?? [];
  const canGoBack = spreadIndex > 0;
  const canGoNext = spreadIndex < spreads.length - 1;
  const isTurning = Boolean(pageTurn);

  const startTurn = useCallback((direction: "next" | "prev") => {
    if (isTurning) return;
    if (direction === "next" && canGoNext && currentRightPage) {
      setPageTurn({ direction, page: currentRightPage });
    }
    if (direction === "prev" && canGoBack && currentLeftPage) {
      setPageTurn({ direction, page: currentLeftPage });
    }
  }, [canGoBack, canGoNext, currentLeftPage, currentRightPage, isTurning]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      if (event.key === "ArrowRight") startTurn("next");
      if (event.key === "ArrowLeft") startTurn("prev");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startTurn]);

  const completeTurn = () => {
    if (!pageTurn) return;
    setSpreadIndex((current) =>
      pageTurn.direction === "next"
        ? Math.min(spreads.length - 1, current + 1)
        : Math.max(0, current - 1),
    );
    setPageTurn(null);
  };

  return (
    <motion.div
      key="open-desktop"
      initial={{ opacity: 0, scale: 0.92, rotateX: 4 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="hidden h-full w-full flex-col items-center justify-center px-8 py-8 lg:flex"
    >
      <div className="mb-5 text-center text-white">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff9d95]">
          Lecture en ligne
        </p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-normal">{book.title}</h2>
        <p className="mt-1 text-sm font-bold text-white/62">
          {book.childName}
          {book.age ? `, ${book.age}` : ""} · {book.theme}
        </p>
      </div>

      <div className="relative w-full max-w-[980px]">
        <div className="absolute -bottom-9 left-20 right-20 h-16 rounded-[50%] bg-black/38 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotateX: 3 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid h-[560px] grid-cols-2 overflow-hidden rounded-[34px] bg-[#fff8ea] shadow-[0_34px_100px_rgba(0,0,0,0.36)] ring-1 ring-white/20 [perspective:1800px] [transform-style:preserve-3d]"
        >
          {leftPage && (
            <StoryBookPage
              book={book}
              page={leftPage}
              side="left"
              className="border-r border-[#e5dccb]"
            />
          )}
          {rightPage ? (
            <StoryBookPage book={book} page={rightPage} side="right" />
          ) : (
            <div className="grid h-full place-items-center bg-[#fff8ea] p-8 text-center">
              <p className="font-editorial text-4xl font-semibold italic text-[#6b55ef]">
                Fin de l’aperçu
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-12 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(7,11,45,0.10),rgba(255,255,255,0.62),rgba(7,11,45,0.10))]" />
          {pageTurn && (
            <motion.div
              key={`${pageTurn.direction}-${spreadIndex}`}
              className={
                pageTurn.direction === "next"
                  ? "pointer-events-none absolute bottom-0 right-0 top-0 z-30 w-1/2 origin-left overflow-hidden rounded-r-[34px] bg-[#fff8ea] shadow-[-20px_0_42px_rgba(7,11,45,0.18)] [backface-visibility:hidden] [transform-style:preserve-3d]"
                  : "pointer-events-none absolute bottom-0 left-0 top-0 z-30 w-1/2 origin-right overflow-hidden rounded-l-[34px] bg-[#fff8ea] shadow-[20px_0_42px_rgba(7,11,45,0.18)] [backface-visibility:hidden] [transform-style:preserve-3d]"
              }
              initial={{ rotateY: 0 }}
              animate={{ rotateY: pageTurn.direction === "next" ? -176 : 176 }}
              transition={{ duration: 0.7, ease: [0.2, 0.72, 0.17, 1] }}
              onAnimationComplete={completeTurn}
            >
              <StoryBookPage
                book={book}
                page={pageTurn.page}
                side={pageTurn.direction === "next" ? "right" : "left"}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.20),transparent_20%,rgba(255,255,255,0.22)_72%,rgba(0,0,0,0.14))]" />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="mt-7 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => startTurn("prev")}
          disabled={!canGoBack || isTurning}
          className="grid h-12 w-12 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Double-page précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-[132px] text-center text-xs font-extrabold uppercase tracking-[0.18em] text-white/62">
          {spreadIndex + 1} / {spreads.length}
        </p>
        <button
          type="button"
          onClick={() => startTurn("next")}
          disabled={!canGoNext || isTurning}
          className="grid h-12 w-12 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Double-page suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
