"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { creationSteps } from "@/components/story/create-flow/create-flow-data";
import { StudioBook } from "@/components/story/create-flow/studio-object";
import type { CreationAnswers } from "@/types/generation";

export function CreationShell({
  step,
  direction,
  answers,
  children,
  onBack,
  onContinue,
  continueLabel = "Continuer",
  error,
}: {
  step: number;
  direction: 1 | -1;
  answers: CreationAnswers;
  children: ReactNode;
  onBack: () => void;
  onContinue: () => void;
  onStepSelect: (step: number) => void;
  continueLabel?: string;
  error?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <main className={`binding-studio binding-step-${step} binding-mood-${answers.desiredFeeling || "neutral"}`}>
      <div className="binding-grain" />
      <header className="binding-header">
        <BrandLogo className="[&_span:last-child]:text-[#f4ead9]" />
        <div className="binding-progress" aria-label={`Étape ${step + 1} sur ${creationSteps.length}`}>
          <span>{String(step + 1).padStart(2, "0")}</span>
          <i><motion.b animate={{ scaleX: (step + 1) / creationSteps.length }} /></i>
          <span>{String(creationSteps.length).padStart(2, "0")}</span>
        </div>
        <span className="binding-private"><LockKeyhole /> Privé</span>
      </header>

      <section className="binding-stage" aria-live="polite">
        <div className="binding-light" />
        <div className="binding-table-edge" />
        <div className="binding-book-zone"><StudioBook answers={answers} step={step} /></div>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={{
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="binding-interaction"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <footer className="binding-controls">
          <button type="button" onClick={onBack} disabled={step === 0} className="binding-back" aria-label="Revenir à l’étape précédente">
            <ArrowLeft /> <span>Retour</span>
          </button>
          <p role={error ? "alert" : "status"}>{error ?? creationSteps[step].eyebrow}</p>
          <button type="button" onClick={onContinue} className="binding-next">
            <span>{continueLabel}</span><ArrowRight />
          </button>
        </footer>
      </section>
    </main>
  );
}
