"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ReaderStage } from "@/components/book/StoryBookReader";
import type { StoryBook } from "@/types/book";

const bookAsset = (name: string) => `/assets/livre-3d/${name}`;

export function StoryBookCoverView({
  book,
  onOpen,
  stage = "cover",
  accent = "#ff9d95",
  glow = "rgba(124,92,255,0.36)",
}: {
  book: StoryBook;
  onOpen: () => void;
  stage?: ReaderStage;
  accent?: string;
  glow?: string;
}) {
  const isTransitioning = stage === "transitioning";

  return (
    <motion.div
      key="cover"
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid h-full max-h-[780px] w-full max-w-6xl items-center gap-5 px-4 py-3 sm:gap-8 sm:py-9 lg:grid-cols-[0.96fr_1fr] lg:gap-14 lg:px-10"
    >
      <div className="relative mx-auto w-full max-w-[265px] sm:max-w-[420px] lg:max-w-[500px]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-x-20 -inset-y-14"
          animate={{ opacity: isTransitioning ? 0.95 : 0.58, scale: isTransitioning ? 1.08 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="h-full w-full bg-contain bg-center bg-no-repeat mix-blend-screen"
            style={{
              backgroundImage: `url(${bookAsset("book-glow-mask.png")})`,
              filter: `drop-shadow(0 0 52px ${glow})`,
            }}
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={onOpen}
          disabled={isTransitioning}
          aria-label={`Ouvrir le livre ${book.title}`}
          className="group relative block w-full cursor-pointer text-left outline-none disabled:cursor-wait"
          initial={{ rotateZ: -1.2 }}
          animate={
            isTransitioning
              ? { y: -8, scale: 1.045, rotateZ: 0, opacity: 0.16, filter: "blur(6px)" }
              : { y: [0, -8, 0], scale: 1, rotateZ: [-1.2, 0.7, -1.2], opacity: 1, filter: "blur(0px)" }
          }
          whileHover={isTransitioning ? undefined : { scale: 1.015 }}
          whileTap={isTransitioning ? undefined : { scale: 0.992 }}
          transition={
            isTransitioning
              ? { duration: 0.56, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span
            className="pointer-events-none absolute -bottom-[9%] left-[4%] z-0 h-[28%] w-[96%] bg-contain bg-center bg-no-repeat opacity-75 blur-[1px]"
            style={{ backgroundImage: `url(${bookAsset("book-cover-shadow.png")})` }}
          />
          <span
            className="pointer-events-none absolute right-[-7%] top-[8%] z-10 h-[82%] w-[22%] bg-contain bg-right bg-no-repeat opacity-95"
            style={{ backgroundImage: `url(${bookAsset("book-page-stack-right.png")})` }}
          />
          <span
            className="pointer-events-none absolute left-[-5%] top-[8%] z-30 h-[82%] w-[16%] bg-contain bg-left bg-no-repeat opacity-95"
            style={{ backgroundImage: `url(${bookAsset("book-spine.png")})` }}
          />
          <div className="relative z-20 overflow-hidden rounded-[18px] shadow-[24px_34px_78px_rgba(0,0,0,0.42)] ring-1 ring-white/14 transition duration-500 group-hover:shadow-[30px_42px_92px_rgba(0,0,0,0.50)]">
            {book.coverImage && (
              <Image
                src={book.coverImage}
                alt={`Couverture du livre ${book.title}`}
                priority
                sizes="(min-width: 1024px) 500px, 76vw"
                className="h-auto w-full object-contain"
              />
            )}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-[linear-gradient(90deg,rgba(0,0,0,0.36),rgba(0,0,0,0.05),transparent)]" />
            <span className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 transition duration-500 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.20), 0 0 74px ${glow}` }} />
          </div>
        </motion.button>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-42%] top-1/2 z-40 hidden aspect-[1520/980] -translate-y-1/2 sm:block"
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={
            isTransitioning
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.92, filter: "blur(10px)" }
          }
          transition={{ duration: 0.52, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 grid grid-cols-2 overflow-hidden rounded-[32px] shadow-[0_36px_110px_rgba(0,0,0,0.34)]">
            <span
              className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bookAsset("book-inner-page-left.png")})` }}
            />
            <span
              className="h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bookAsset("book-inner-page-right.png")})` }}
            />
            <span
              className="absolute inset-y-0 left-1/2 h-full w-[14%] -translate-x-1/2 bg-[length:100%_100%] bg-center bg-no-repeat opacity-78"
              style={{ backgroundImage: `url(${bookAsset("book-center-shadow.png")})` }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mx-auto max-w-xl text-center text-white lg:text-left"
        animate={isTransitioning ? { opacity: 0, y: 12, filter: "blur(7px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/80">
          <Sparkles className="h-3.5 w-3.5" style={{ color: accent }} />
          Exemple StoryKid
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-normal sm:mt-5 md:text-6xl">
          {book.title}
        </h2>
        <p className="mt-3 text-base font-bold text-white/68">
          {book.childName}
          {book.age ? `, ${book.age}` : ""} · {book.theme}
        </p>
        <p className="mt-5 hidden text-lg font-semibold leading-8 text-white/74 sm:block">
          Ouvre le livre et découvre quelques pages avant de créer le tien.
        </p>
        <button
          type="button"
          onClick={onOpen}
          disabled={isTransitioning}
          className="mt-5 inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#ff6257] px-7 text-sm font-extrabold text-white shadow-[0_22px_54px_rgba(255,98,87,0.34)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] disabled:cursor-wait disabled:opacity-80 sm:mt-7 sm:h-14 sm:px-8"
        >
          {isTransitioning ? "Ouverture..." : "Ouvrir le livre"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
