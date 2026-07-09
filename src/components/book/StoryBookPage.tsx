"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoryBook, StoryBookPage as StoryBookPageType } from "@/types/book";

export function StoryBookPage({
  book,
  page,
  side = "single",
  onPrimaryAction,
  className,
}: {
  book: StoryBook;
  page: StoryBookPageType;
  side?: "left" | "right" | "single";
  onPrimaryAction?: () => void;
  className?: string;
}) {
  const isMoral = page.type === "moral";
  const isCta = page.type === "cta";
  const isLocked = page.type === "locked";

  return (
    <article
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden bg-[#fff8ea] p-5 text-[#070b2d]",
        side === "left" && "rounded-l-[30px]",
        side === "right" && "rounded-r-[30px]",
        side === "single" && "rounded-[30px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(124,92,255,0.10),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(7,11,45,0.08),transparent)] opacity-60" />

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#8a91a6]">
            {isMoral ? "Morale" : isCta ? "À toi" : isLocked ? "Suite" : `Page ${page.pageNumber}`}
          </p>
          <Sparkles className="h-4 w-4 text-[#6b55ef]" />
        </div>

        {page.image && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.42, delay: 0.08, ease: "easeOut" }}
            className="relative mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
          >
            <Image
              src={page.image}
              alt={`Illustration du livre ${book.title}`}
              sizes="(min-width: 1024px) 360px, 80vw"
              className="h-auto max-h-[185px] w-full object-cover"
            />
          </motion.div>
        )}

        <div className={cn("relative mt-6", !page.image && "mt-10", isCta && "mt-auto text-center")}>
          {page.title && (
            <motion.h3
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.38, delay: page.image ? 0.18 : 0.08, ease: "easeOut" }}
              className={cn(
                "text-[1.35rem] font-extrabold leading-tight tracking-normal",
                isMoral && "font-editorial text-4xl font-semibold italic text-[#6b55ef]",
                isCta && "text-3xl",
              )}
            >
              {page.title}
            </motion.h3>
          )}
          {page.text && (
            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.42, delay: page.image ? 0.28 : 0.18, ease: "easeOut" }}
              className={cn(
                "mt-4 text-[15px] font-semibold leading-7 text-[#4c5578]",
                isMoral && "text-lg leading-8 text-[#303856]",
                isCta && "mx-auto max-w-sm",
              )}
            >
              {page.text}
            </motion.p>
          )}
        </div>

        {isMoral && (
          <motion.div
            initial={{ opacity: 0, scale: 0.84 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.34, delay: 0.34, ease: "easeOut" }}
            className="relative mt-auto flex justify-center pb-3"
          >
            <Heart className="h-8 w-8 fill-[#ff7aa2] text-[#ff7aa2]" />
          </motion.div>
        )}

        {isLocked && (
          <div className="relative mt-auto rounded-2xl border border-[#e8eaf3] bg-white/82 p-4 text-center">
            <LockKeyhole className="mx-auto h-5 w-5 text-[#6b55ef]" />
            <p className="mt-2 text-sm font-extrabold">Débloque le livre complet</p>
          </div>
        )}

        {isCta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.34, ease: "easeOut" }}
            className="relative mx-auto mt-6"
          >
            {onPrimaryAction ? (
              <button
                type="button"
                onClick={onPrimaryAction}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-6 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.25)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
              >
                Créer mon aperçu gratuit
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/create-story"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-6 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(255,98,87,0.25)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
              >
                Créer mon aperçu gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </article>
  );
}
