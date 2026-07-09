"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StoryBookPage } from "@/components/book/StoryBookPage";
import type { StoryBook } from "@/types/book";

const bookAsset = (name: string) => `/assets/livre-3d/${name}`;

type PageTurn = {
  direction: "next" | "prev";
};

function BookPageFrame({
  book,
  page,
  side,
  onPrimaryAction,
}: {
  book: StoryBook;
  page: StoryBook["pages"][number] | undefined;
  side: "left" | "right";
  onPrimaryAction?: () => void;
}) {
  if (!page) {
    return (
      <div className="relative h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bookAsset(side === "left" ? "book-inner-page-left.png" : "book-inner-page-right.png")})`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bookAsset(side === "left" ? "book-inner-page-left.png" : "book-inner-page-right.png")})`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{ backgroundImage: `url(${bookAsset("book-paper-texture.png")})`, backgroundSize: "260px 260px" }}
      />
      <StoryBookPage
        book={book}
        page={page}
        side={side}
        onPrimaryAction={onPrimaryAction}
        className="bg-transparent p-7 md:p-8"
      />
    </div>
  );
}

export function StoryBookOpenView({
  book,
  onPrimaryAction,
}: {
  book: StoryBook;
  onPrimaryAction?: () => void;
}) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pageTurn, setPageTurn] = useState<PageTurn | null>(null);
  const spreads = useMemo(() => {
    const result = [];
    for (let index = 0; index < book.pages.length; index += 2) {
      result.push([book.pages[index], book.pages[index + 1]] as const);
    }
    return result;
  }, [book.pages]);
  const targetSpreadIndex = pageTurn
    ? pageTurn.direction === "next"
      ? Math.min(spreads.length - 1, spreadIndex + 1)
      : Math.max(0, spreadIndex - 1)
    : spreadIndex;
  const [leftPage, rightPage] = spreads[targetSpreadIndex] ?? [];
  const canGoBack = spreadIndex > 0;
  const canGoNext = spreadIndex < spreads.length - 1;
  const isTurning = Boolean(pageTurn);

  const completeTurn = () => {
    if (!pageTurn) return;
    setSpreadIndex((current) =>
      pageTurn.direction === "next"
        ? Math.min(spreads.length - 1, current + 1)
        : Math.max(0, current - 1),
    );
    setPageTurn(null);
  };

  const startTurn = useCallback(
    (direction: "next" | "prev") => {
      if (isTurning) return;
      if (direction === "next" && canGoNext) setPageTurn({ direction });
      if (direction === "prev" && canGoBack) setPageTurn({ direction });
    },
    [canGoBack, canGoNext, isTurning],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      if (event.key === "ArrowRight") startTurn("next");
      if (event.key === "ArrowLeft") startTurn("prev");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startTurn]);

  return (
    <motion.div
      key="open-desktop"
      initial={{ opacity: 0, scale: 0.975 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

      <div className="relative w-[min(1080px,86vw)]">
        <div
          className="pointer-events-none absolute -bottom-[12%] left-[10%] h-[30%] w-[80%] bg-contain bg-center bg-no-repeat opacity-45 blur-[2px]"
          style={{ backgroundImage: `url(${bookAsset("book-cover-shadow.png")})` }}
        />
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[1520/980] overflow-hidden rounded-[30px] shadow-[0_30px_88px_rgba(0,0,0,0.34)]"
        >
          <div className="absolute inset-y-[7%] -left-[2.2%] z-0 w-[8%]">
            <div
              className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat opacity-38"
              style={{ backgroundImage: `url(${bookAsset("book-page-stack-left.png")})` }}
            />
          </div>
          <div className="absolute inset-y-[7%] -right-[2.2%] z-0 w-[8%]">
            <div
              className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat opacity-38"
              style={{ backgroundImage: `url(${bookAsset("book-page-stack-right.png")})` }}
            />
          </div>
          <div className="relative z-10 grid h-full grid-cols-2 overflow-hidden rounded-[34px]">
            <BookPageFrame
              book={book}
              page={leftPage}
              side="left"
              onPrimaryAction={onPrimaryAction}
            />
            <BookPageFrame
              book={book}
              page={rightPage}
              side="right"
              onPrimaryAction={onPrimaryAction}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 h-full w-9 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(118,89,52,0.08),rgba(32,24,18,0.13),rgba(255,255,255,0.16),rgba(118,89,52,0.07))]"
          />
          {pageTurn && (
            <motion.div
              className={
                pageTurn.direction === "next"
                  ? "pointer-events-none absolute bottom-0 right-0 top-0 z-30 w-1/2 origin-left"
                  : "pointer-events-none absolute bottom-0 left-0 top-0 z-30 w-1/2 origin-right"
              }
              initial={{ opacity: 0.26, x: 0, rotateY: 0 }}
              animate={{
                opacity: [0.26, 0.34, 0],
                x: pageTurn.direction === "next" ? [-2, -28, -54] : [2, 28, 54],
                rotateY: pageTurn.direction === "next" ? [0, -10, -18] : [0, 10, 18],
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={completeTurn}
            >
              <div
                className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat drop-shadow-[0_12px_22px_rgba(0,0,0,0.10)]"
                style={{ backgroundImage: `url(${bookAsset("book-page-turn-overlay.png")})` }}
              />
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
