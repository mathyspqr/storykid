"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon } from "lucide-react";
import { StudioAsset } from "@/components/story/create-flow/studio-asset";
import type { CreationAnswers } from "@/types/generation";

const objectLabels: Record<string, string> = {
  evening: "Le soir",
  school: "Un départ",
  emotion: "Une émotion",
  confidence: "Oser",
  sibling: "Sa place",
  change: "Un changement",
};

export function StudioBook({ answers, step }: { answers: CreationAnswers; step: number }) {
  const reduceMotion = useReducedMotion();
  const childName = answers.childName.trim();

  return (
    <motion.div
      className={`studio-book-wrap studio-pages-${answers.pageCount} studio-mood-${answers.desiredFeeling || "neutral"}`}
      animate={{
        x: step === 1 ? "12%" : step >= 4 ? "4%" : 0,
        y: step === 1 ? 8 : 0,
        rotateZ: step === 1 ? 1.5 : -1.2,
        scale: step === 1 ? 1.04 : 1,
      }}
      transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Livre StoryKid fermé et scellé"
    >
      <div className="studio-book-shadow" />
      <div className="studio-book-pages" />
      <div className="studio-book-cover">
        <span className="studio-book-spine" />
        <div className="studio-book-medallion"><Moon className="h-5 w-5" strokeWidth={1.4} /></div>
        <AnimatePresence>
          {answers.need ? (
            <motion.div
              key={answers.need}
              initial={{ opacity: 0, scale: 1.8, x: -90, y: 70, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              className="studio-book-token"
              aria-label={`Moment retenu : ${objectLabels[answers.need] ?? "Autre"}`}
            >
              <StudioAsset id={answers.need} variant="book" />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {step >= 2 && answers.storyAnchor ? <motion.div key={answers.storyAnchor} initial={{ opacity: 0, scale: .3, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} className="studio-book-anchor"><StudioAsset id={answers.storyAnchor} variant="book" /></motion.div> : null}
        </AnimatePresence>
        <AnimatePresence>
          {answers.desiredFeeling ? <motion.div key={answers.desiredFeeling} initial={{ opacity: 0, scale: .35, y: -30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="studio-book-emotion"><StudioAsset id={answers.desiredFeeling} variant="book" /></motion.div> : null}
        </AnimatePresence>
        <AnimatePresence>
          {step >= 1 && childName ? (
            <motion.span
              key={childName}
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0 }}
              className="studio-book-name"
              style={{ fontSize: `${Math.max(11, 19 - Math.max(0, childName.length - 9) * .72)}px` }}
            >
              {childName}
            </motion.span>
          ) : null}
        </AnimatePresence>
        {answers.audioEnabled ? <span className="studio-book-audio"><StudioAsset id="audio" variant="book" /></span> : null}
        <span className="studio-book-ribbon"><i /></span>
        <span className="studio-book-seal"><b /><i /></span>
      </div>
    </motion.div>
  );
}
