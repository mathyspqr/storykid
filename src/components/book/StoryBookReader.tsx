"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StoryBookCoverView } from "@/components/book/StoryBookCoverView";
import { StoryBookMobileReader } from "@/components/book/StoryBookMobileReader";
import { StoryBookOpenView } from "@/components/book/StoryBookOpenView";
import type { BookReaderMode, StoryBook } from "@/types/book";

export type ReaderStage = "cover" | "transitioning" | "reading";

const defaultReaderTheme = {
  background:
    "radial-gradient(circle at 20% 18%, rgba(124,92,255,0.30), transparent 30%), radial-gradient(circle at 82% 22%, rgba(255,98,87,0.14), transparent 24%), linear-gradient(180deg,#07123a 0%,#050b25 62%,#020617 100%)",
  glow: "rgba(124,92,255,0.32)",
  accent: "#ff9d95",
};

export function StoryBookReader({
  book,
  mode = "example",
  open,
  onClose,
  onPrimaryAction,
}: {
  book: StoryBook | null;
  mode?: BookReaderMode;
  open: boolean;
  onClose: () => void;
  onPrimaryAction?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [stage, setStage] = useState<ReaderStage>("cover");
  const openingTimerRef = useRef<number | null>(null);
  const theme = book?.readerTheme ?? defaultReaderTheme;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setStage("cover");
    }
  }, [book?.id, open]);

  useEffect(() => {
    return () => {
      if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!isMounted) return null;

  const openBook = () => {
    if (stage !== "cover") return;
    setStage("transitioning");
    if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
    openingTimerRef.current = window.setTimeout(() => {
      setStage("reading");
    }, 780);
  };

  return createPortal(
    <AnimatePresence>
      {open && book && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Lecteur ${book.title}`}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#050b25] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{ background: theme.background }} />
          <div
            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: theme.glow, opacity: 0.45 }}
          />
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.65)_1px,transparent_2px),radial-gradient(circle_at_74%_18%,rgba(255,255,255,0.45)_1px,transparent_2px),radial-gradient(circle_at_82%_68%,rgba(255,255,255,0.36)_1px,transparent_2px),radial-gradient(circle_at_36%_78%,rgba(255,255,255,0.42)_1px,transparent_2px)]" />

          <div className="relative flex h-full min-h-0 flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-7">
              <div>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
                  style={{ color: theme.accent }}
                >
                  {mode === "example" ? "Exemple StoryKid" : "Livre StoryKid"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le lecteur"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/14 bg-white/10 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <AnimatePresence mode="wait">
                {stage !== "reading" ? (
                  <StoryBookCoverView
                    key="cover"
                    book={book}
                    onOpen={openBook}
                    stage={stage}
                    accent={theme.accent}
                    glow={theme.glow}
                  />
                ) : (
                  <>
                    <StoryBookOpenView
                      key="desktop-open"
                      book={book}
                      onPrimaryAction={onPrimaryAction}
                    />
                    <StoryBookMobileReader
                      key="mobile-open"
                      book={book}
                      onPrimaryAction={onPrimaryAction}
                    />
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
