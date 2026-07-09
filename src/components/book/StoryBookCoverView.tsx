"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ReaderStage } from "@/components/book/StoryBookReader";
import type { StoryBook } from "@/types/book";

export function StoryBookCoverView({
  book,
  onOpen,
  stage = "preview",
  accent = "#ff9d95",
  glow = "rgba(124,92,255,0.36)",
}: {
  book: StoryBook;
  onOpen: () => void;
  stage?: ReaderStage;
  accent?: string;
  glow?: string;
}) {
  const isOpening = stage === "opening";
  const firstPage = book.pages[0];
  const secondPage = book.pages[1];

  return (
    <motion.div
      key="cover"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, rotateY: -16 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="mx-auto grid h-full max-h-[760px] w-full max-w-6xl items-center gap-4 px-4 py-3 sm:gap-8 sm:py-10 lg:grid-cols-[0.92fr_1fr] lg:gap-12 lg:px-10"
    >
      <motion.div
        animate={isOpening ? { x: [0, 18, 0], scale: [1, 1.04, 1.02] } : { x: 0, scale: 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-[255px] sm:max-w-[390px] lg:max-w-[460px] [perspective:1600px]"
      >
        <div
          className="absolute -inset-10 rounded-[46px] blur-2xl"
          style={{ background: `radial-gradient(circle at 50% 35%, ${glow}, transparent 58%)` }}
        />
        <motion.div
          className="absolute inset-y-[6%] -right-[52%] left-[50%] hidden rounded-r-[20px] bg-[#fff8ea] shadow-[22px_24px_70px_rgba(0,0,0,0.24)] ring-1 ring-white/20 sm:block"
          initial={{ opacity: 0, scaleX: 0.35 }}
          animate={isOpening ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.35 }}
          transition={{ duration: 0.54, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
        >
          <div className="absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(7,11,45,0.16),transparent)]" />
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={isOpening ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
            transition={{ duration: 0.42, delay: 0.46, ease: "easeOut" }}
            className="flex h-full flex-col justify-center p-7 text-[#070b2d]"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a91a6]">
              Page 1
            </p>
            <h3 className="mt-3 text-xl font-extrabold leading-tight">{firstPage?.title}</h3>
            <p className="mt-3 line-clamp-5 text-sm font-semibold leading-6 text-[#4c5578]">
              {firstPage?.text ?? secondPage?.text}
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ rotateY: -10, rotateZ: -1.5 }}
          animate={
            isOpening
              ? { y: -4, rotateY: -8, rotateZ: -0.5, scale: 1.01 }
              : { y: [0, -10, 0], rotateY: [-10, -4, -10], rotateZ: [-1.5, 1, -1.5] }
          }
          transition={
            isOpening
              ? { duration: 0.24, ease: "easeOut" }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative [transform-style:preserve-3d]"
        >
          <div className="absolute -bottom-10 left-8 right-4 h-16 rounded-[50%] bg-black/32 blur-2xl" />
          <div className="absolute -right-3 top-3 h-[95%] w-full rounded-[18px] bg-[#d9d2b9] shadow-[18px_22px_50px_rgba(0,0,0,0.22)]" />
          <div className="absolute -right-5 top-5 h-[91%] w-full rounded-[18px] bg-[#8d86c9]" />
          <motion.button
            type="button"
            onClick={onOpen}
            disabled={isOpening}
            aria-label={`Ouvrir le livre ${book.title}`}
            className="group relative block w-full cursor-pointer rounded-[18px] text-left outline-none focus-visible:ring-4 focus-visible:ring-white/45 disabled:cursor-wait"
            whileHover={isOpening ? undefined : { scale: 1.015, rotateY: -7 }}
            whileTap={isOpening ? undefined : { scale: 0.99 }}
            animate={
              isOpening
                ? {
                    rotateY: -66,
                    x: -22,
                    scale: 1.02,
                  }
                : { rotateY: 0, x: 0, scale: 1 }
            }
            transition={{ duration: 0.86, ease: [0.18, 0.84, 0.28, 1] }}
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          >
            {book.coverImage && (
              <Image
                src={book.coverImage}
                alt={`Couverture du livre ${book.title}`}
                priority
                sizes="(min-width: 1024px) 460px, 76vw"
                className="relative h-auto w-full rounded-[18px] drop-shadow-[24px_34px_58px_rgba(0,0,0,0.38)] transition duration-500 group-hover:drop-shadow-[28px_42px_74px_rgba(0,0,0,0.46)]"
              />
            )}
            <span
              className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 transition duration-500 group-hover:opacity-100"
              style={{ boxShadow: `0 0 74px ${glow}` }}
            />
            <span className="pointer-events-none absolute inset-y-0 left-0 w-7 rounded-l-[18px] bg-[linear-gradient(90deg,rgba(0,0,0,0.34),transparent)]" />
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-xl text-center text-white lg:text-left">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/80">
          <Sparkles className="h-3.5 w-3.5" style={{ color: accent }} />
          Exemple à feuilleter
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-normal sm:mt-5 md:text-6xl">
          {book.title}
        </h2>
        <p className="mt-3 text-base font-bold text-white/68">
          {book.childName}
          {book.age ? `, ${book.age}` : ""} · {book.theme}
        </p>
        <p className="mt-5 hidden text-lg font-semibold leading-8 text-white/74 sm:block">
          Ouvre le livre, lis quelques pages et découvre si l’histoire touche juste avant de payer.
        </p>
        <button
          type="button"
          onClick={onOpen}
          disabled={isOpening}
          className="mt-5 inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#ff6257] px-7 text-sm font-extrabold text-white shadow-[0_22px_54px_rgba(255,98,87,0.34)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] disabled:cursor-wait disabled:opacity-80 sm:mt-7 sm:h-14 sm:px-8"
        >
          {isOpening ? "Le livre s’ouvre..." : "Ouvrir le livre"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
