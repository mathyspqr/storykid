"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Settings,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { StoryBookReader } from "@/components/book/StoryBookReader";
import { PremiumBookCover } from "@/components/landing/BookProductMockup";
import { exampleBookById } from "@/data/example-books";
import { landingBookExamples } from "@/data/landing-examples";

const steps = [
  ["Moment", "Peur du noir"],
  ["Enfant", "Léo, 4 ans"],
  ["Détail", "aime les poulpes"],
  ["Ton", "doux et rassurant"],
  ["Résultat", "livre prêt"],
];

const sideIcons = [Sparkles, BookOpen, Volume2, Settings];

export function StoryKidAppMockup() {
  const book = landingBookExamples[0];
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mx-auto grid w-full max-w-[900px] grid-cols-1 items-center gap-6 sm:grid-cols-[0.68fr_1.32fr] lg:gap-8"
      >
        <div className="absolute -inset-8 rounded-[42px] bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.95),transparent_26%),radial-gradient(circle_at_86%_44%,rgba(124,92,255,0.2),transparent_32%),radial-gradient(circle_at_58%_86%,rgba(255,98,87,0.14),transparent_30%)] blur-2xl" />

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 order-2 hidden min-w-0 overflow-hidden rounded-[24px] border border-[#e9eaf3] bg-white/92 shadow-[0_22px_62px_rgba(9,15,48,0.09)] sm:block sm:min-w-[300px] sm:translate-x-6 sm:scale-[0.86] lg:translate-x-8"
        >
          <div className="grid min-h-[315px] grid-cols-[52px_1fr]">
            <aside className="flex flex-col items-center gap-5 border-r border-[#eef0f6] bg-white px-3 py-6">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#070b2d] text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              {sideIcons.map((Icon, index) => (
                <span
                  key={index}
                  className="grid h-8 w-8 place-items-center rounded-xl text-[#4d5575]"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </aside>
            <div className="p-5">
              <p className="mb-5 text-[15px] font-extrabold tracking-[-0.02em] text-[#070b2d]">
                StoryKid Studio
              </p>
              <div className="space-y-0.5">
                {steps.map(([label, value], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.09, duration: 0.25 }}
                    className="grid grid-cols-[22px_68px_minmax(0,1fr)] items-center gap-2 border-b border-[#eff1f6] py-2.5 text-[12.5px]"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#45b96a] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="whitespace-nowrap font-extrabold text-[#101735]">
                      {label}
                    </span>
                    <span className="whitespace-nowrap text-[#4d5575]">
                      : {value}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold text-[#707895]">
                  <span>Préparation de ton histoire...</span>
                  <span>100 %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e8e6ff]">
                  <motion.div
                    initial={{ width: "18%" }}
                    animate={{ width: ["18%", "100%", "100%"] }}
                    transition={{
                      delay: 0.3,
                      duration: 2.8,
                      times: [0, 0.72, 1],
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeInOut",
                    }}
                    className="h-full rounded-full bg-[#6b55ef]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setReaderOpen(true)}
          aria-label="Lire l'exemple La nuit devient moins grande"
          initial={{ opacity: 0, x: 20, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          whileHover={{ y: -8, scale: 1.018 }}
          whileTap={{ scale: 0.992 }}
          transition={{ delay: 0.25, duration: 0.55, ease: "easeOut" }}
          className="group relative z-20 order-1 -ml-0 cursor-pointer rounded-[28px] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#6b55ef]/25 sm:order-2 sm:-ml-8 lg:-ml-10"
        >
          <span className="pointer-events-none absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle,rgba(255,98,87,0.20),transparent_62%)] opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 1.2, -0.4, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <PremiumBookCover
              book={book}
              size="hero"
              className="max-w-[300px] transition duration-500 group-hover:drop-shadow-[0_30px_70px_rgba(255,98,87,0.22)] min-[390px]:max-w-[330px] sm:max-w-[405px]"
              priority
            />
          </motion.div>
        </motion.button>
      </motion.div>
      <StoryBookReader
        book={exampleBookById[book.id]}
        mode="example"
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
      />
    </>
  );
}
