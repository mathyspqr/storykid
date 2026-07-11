"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import loadingBook from "@/assets/tunnel/open-book-editorial-clean.png";
import progressSceneAnchor from "@/assets/tunnel/progress-scene-anchor-clean.png";
import progressSceneChild from "@/assets/tunnel/progress-scene-child-clean.png";
import progressSceneFeeling from "@/assets/tunnel/progress-scene-feeling-clean.png";
import progressSceneNeed from "@/assets/tunnel/progress-scene-need-clean.png";
import { creationSteps } from "@/components/story/create-flow/create-flow-data";
import { PaintedChoiceIcon } from "@/components/story/create-flow/painted-choice-icon";
import {
  labelForFeeling,
  labelForStoryAnchor,
} from "@/lib/pre-paywall-teaser";
import type { CreationAnswers } from "@/types/generation";

function sceneLabel(step: number, answers: CreationAnswers) {
  if (step === 0) return answers.need ? "Lumière choisie" : "Un moment à choisir";
  if (step === 1) return answers.childName.trim() ? `${answers.childName.trim().slice(0, 18)} a sa place` : "Le prénom viendra ici";
  if (step === 2) return answers.storyAnchor ? "Compagnon installé" : "Un compagnon à inviter";
  if (step === 3) return answers.desiredFeeling ? `Fin ${labelForFeeling(answers)}` : "Une sensation à déposer";
  if (step === 4) return `${answers.pageCount} pages${answers.audioEnabled ? " · avec audio" : ""}`;
  return "Atelier prêt";
}

export function BedsideStoryScene({
  answers,
  step,
}: {
  answers: CreationAnswers;
  step: number;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const progressScene = [
    progressSceneNeed,
    progressSceneChild,
    progressSceneAnchor,
    progressSceneFeeling,
    progressSceneFeeling,
    progressSceneFeeling,
  ][step];

  return (
    <div
      className="relative isolate h-full min-h-[184px] w-full overflow-hidden rounded-[2rem] border border-[#17243a]/8 bg-[#f7f9f8] shadow-[0_24px_70px_rgba(31,43,51,0.09)] lg:min-h-[540px] lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none"
      aria-label={`Scène illustrée évolutive, ${creationSteps[step].short}`}
    >
      <div className="absolute inset-[4%] overflow-hidden rounded-[1.65rem] bg-[radial-gradient(circle_at_67%_42%,#fff8ec_0%,#f8f5ee_42%,#eef1ee_100%)] lg:inset-0 lg:rounded-none">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(23,36,58,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(23,36,58,0.025)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="absolute left-[7%] top-[7%] z-20 rounded-full border border-[#17243a]/8 bg-[#fffaf0]/88 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#37485a] shadow-sm backdrop-blur lg:text-[9px]">
        {step === 5 ? "Atelier prêt" : creationSteps[step].short}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={progressScene.src}
          initial={{ opacity: 0, x: 18, scale: 0.965 }}
          animate={{ opacity: step >= 4 ? 0.72 : 1, x: 0, scale: step >= 4 ? 0.91 : 1 }}
          exit={{ opacity: 0, x: -14, scale: 1.015 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-[5%] z-10 lg:inset-[2%]"
        >
          <Image
            src={progressScene}
            alt="Table de chevet illustrée qui se compose au fil des réponses"
            fill
            priority={step === 0}
            sizes="(max-width: 1024px) 360px, 540px"
            className="object-contain object-center drop-shadow-[0_22px_28px_rgba(38,42,40,0.14)]"
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {step >= 1 && answers.childName.trim() ? (
          <motion.span
            key={answers.childName}
            initial={{ opacity: 0, scale: 0.82, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.86 }}
            className="absolute left-[47%] top-[61.5%] z-20 max-w-[30%] -translate-x-1/2 -rotate-[0.5deg] truncate font-serif text-[7px] font-bold tracking-[0.08em] text-[#6b4635] lg:left-[48%] lg:top-[63%] lg:text-[12px]"
          >
            {answers.childName.trim()}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 2 && answers.storyAnchor ? (
          <motion.div
            key={answers.storyAnchor + answers.customStoryAnchor}
            initial={{ opacity: 0, scale: 0.45, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="absolute left-[35%] top-[41%] z-20 h-10 w-10 overflow-hidden lg:left-[34.5%] lg:top-[41%] lg:h-16 lg:w-16"
            aria-label={`Compagnon choisi : ${labelForStoryAnchor(answers)}`}
          >
            <PaintedChoiceIcon choice={answers.storyAnchor} sizes="72px" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 4 ? (
          <motion.div
            initial={{ opacity: 0, x: -24, y: 18, scale: 0.75 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -18, scale: 0.8 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[3%] left-[1%] z-20 h-[62%] w-[63%] lg:bottom-[1%] lg:left-[1%] lg:h-[58%] lg:w-[66%]"
          >
            <Image
              src={loadingBook}
              alt="Livre ouvert aux pages vierges, baigné d’une lumière douce"
              fill
              sizes="(max-width: 1024px) 230px, 360px"
              className="object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.30)]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute bottom-[5%] right-[6%] z-30 w-[58%] max-w-[260px] lg:bottom-[7%] lg:right-[7%] lg:w-[52%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${sceneLabel(step, answers)}`}
            initial={{ opacity: 0, y: 12, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: -8, rotate: -2 }}
            transition={{ duration: reduceMotion ? 0 : 0.26 }}
            className="relative bg-[#fff9eb]/95 px-3 py-2.5 text-[#614b3d] shadow-[0_10px_26px_rgba(62,49,37,0.15)] backdrop-blur-sm [clip-path:polygon(2%_1%,98%_0,100%_91%,96%_100%,3%_97%,0_8%)] lg:px-4 lg:py-3"
          >
            <span className="absolute -top-1 left-[42%] h-2.5 w-10 rotate-2 bg-[#d8b787]/45" />
            <p className="truncate font-editorial text-[11px] font-semibold italic text-[#665548] lg:text-sm">{sceneLabel(step, answers)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
