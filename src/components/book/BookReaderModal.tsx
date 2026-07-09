"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DesktopFlipBook } from "@/components/book/DesktopFlipBook";
import { MobileBookReader } from "@/components/book/MobileBookReader";
import type { BookReaderMode, StoryBook } from "@/types/book";

export function BookReaderModal({
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

  useEffect(() => {
    setIsMounted(true);
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

  return createPortal(
    <AnimatePresence>
      {open && book && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-[#070b2d]/72 p-3 backdrop-blur-md sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex h-full items-center justify-center">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Lecteur ${book.title}`}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative max-h-[calc(100vh-24px)] w-full max-w-6xl overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_16%_12%,rgba(124,92,255,0.16),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.32)] ring-1 ring-white/70 sm:max-h-[calc(100vh-40px)] sm:p-6 lg:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le lecteur"
                className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-2xl bg-white/92 text-[#070b2d] shadow-sm ring-1 ring-[#e4e6ef] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 pr-12 text-left lg:mb-5 lg:text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff6257]">
                  {mode === "example" ? "Exemple à feuilleter" : "Aperçu du livre"}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.055em] text-[#070b2d] sm:text-4xl">
                  {book.title}
                </h2>
                <p className="mt-2 text-sm font-bold text-[#626b89]">
                  {book.childName}
                  {book.age ? `, ${book.age}` : ""} · {book.theme}
                </p>
              </div>

              <DesktopFlipBook book={book} />
              <MobileBookReader book={book} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
