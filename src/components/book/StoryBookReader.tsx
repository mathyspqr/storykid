"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StoryBookCoverView } from "@/components/book/StoryBookCoverView";
import { StoryBookMobileReader } from "@/components/book/StoryBookMobileReader";
import { StoryBookOpenView } from "@/components/book/StoryBookOpenView";
import type { BookReaderMode, StoryBook } from "@/types/book";

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
}: {
  book: StoryBook | null;
  mode?: BookReaderMode;
  open: boolean;
  onClose: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const theme = book?.readerTheme ?? defaultReaderTheme;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIsBookOpen(false);
      setIsOpening(false);
    }
  }, [book?.id, open]);

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
    if (isOpening || isBookOpen) return;
    setIsOpening(true);
    window.setTimeout(() => {
      setIsBookOpen(true);
      setIsOpening(false);
    }, 880);
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
                {!isBookOpen ? (
                  <StoryBookCoverView
                    key="cover"
                    book={book}
                    onOpen={openBook}
                    isOpening={isOpening}
                    accent={theme.accent}
                    glow={theme.glow}
                  />
                ) : (
                  <>
                    <StoryBookOpenView key="desktop-open" book={book} />
                    <StoryBookMobileReader key="mobile-open" book={book} />
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
