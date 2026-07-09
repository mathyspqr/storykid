"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PremiumBookCover, PremiumBookSpread } from "@/components/landing/BookProductMockup";
import { landingBookExamples } from "@/data/landing-examples";

const inputs = ["Peur du noir", "Leo, 4 ans", "Poulpe", "Se sentir rassure"];

export function InputToBookDemo() {
  const book = landingBookExamples[0];

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b4a]">
              Preuve produit
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              De 5 details a une histoire complete.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-slate-500">
            Le parent voit tout de suite ce que StoryKid transforme, sans
            promesse floue ni interface compliquee.
          </p>
        </div>

        <div className="grid items-stretch gap-4 rounded-[32px] border border-slate-950/[0.08] bg-white p-4 shadow-[0_22px_80px_rgba(15,23,42,0.09)] lg:grid-cols-[0.82fr_96px_1.42fr] lg:p-5">
          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="mb-4 text-sm font-extrabold text-slate-950">
              Details ajoutes
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {inputs.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-950/[0.07]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0f172a] text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)]"
            >
              <ArrowRight className="h-6 w-6" />
            </motion.div>
          </div>

          <div className="overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_22%_12%,#fff7e8,transparent_34%),linear-gradient(145deg,#f8fbff,#fff5f0)] p-5">
            <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
              <PremiumBookCover book={book} size="demo" />
              <div className="min-w-0">
                <div className="mb-4 inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-slate-950/[0.07]">
                  Résultat prêt
                </div>
                <h3 className="font-editorial text-4xl font-bold leading-none tracking-[-0.05em] text-slate-950">
                  {book.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                  {book.excerpt}
                </p>
                <div className="mt-5">
                  <PremiumBookSpread book={book} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
