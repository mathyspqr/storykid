"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnchorStep,
  ChildStep,
  FeelingStep,
  FormatStep,
  NeedStep,
  SummaryStep,
} from "@/components/story/create-flow/answer-steps";
import { CreationShell } from "@/components/story/create-flow/creation-shell";
import { PaywallScene } from "@/components/story/create-flow/paywall-scene";
import { PrePaywallTransition } from "@/components/story/create-flow/pre-paywall-transition";
import {
  prepareCheckoutIntent,
  preparePrePaywallTeaser,
} from "@/lib/pre-paywall-teaser";
import type { CreationAnswers } from "@/types/generation";

const SESSION_STORAGE_KEY = "storykid:create-flow:session-v1";
const LAST_ANSWER_STEP = 5;

const initialAnswers: CreationAnswers = {
  need: "",
  customNeed: "",
  childName: "",
  age: "",
  interests: [],
  customInterests: undefined,
  storyAnchor: "",
  customStoryAnchor: "",
  desiredFeeling: "",
  parentIntent: "",
  pageCount: 6,
  audioEnabled: false,
};

type FlowStage = "answers" | "prePaywallTransition" | "paywall";

function validationMessage(step: number, answers: CreationAnswers) {
  if (step === 0 && !answers.need) return "Choisissez le moment qui ressemble le plus au vôtre.";
  if (step === 0 && answers.need === "custom" && !answers.customNeed?.trim()) return "Ajoutez ce petit moment en quelques mots.";
  if (step === 1 && !answers.childName.trim()) return "Ajoutez le prénom de votre enfant pour continuer.";
  if (step === 1 && !answers.age) return "Choisissez son âge pour ajuster le rythme de lecture.";
  if (step === 2 && !answers.storyAnchor) return "Choisissez un petit repère qui accompagnera l’histoire.";
  if (step === 2 && answers.storyAnchor === "custom" && !answers.customStoryAnchor?.trim()) return "Donnez un nom à ce repère familier.";
  if (step === 3 && !answers.desiredFeeling) return "Choisissez la sensation que vous souhaitez laisser.";
  return "";
}

export function StoryForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [stage, setStage] = useState<FlowStage>("answers");
  const [answers, setAnswers] = useState<CreationAnswers>(initialAnswers);
  const [hasRestored, setHasRestored] = useState(false);
  const [error, setError] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { step?: number; answers?: Partial<CreationAnswers> };
        setAnswers({ ...initialAnswers, ...saved.answers, interests: saved.answers?.interests ?? [] });
        setStep(Math.max(0, Math.min(LAST_ANSWER_STEP, saved.step ?? 0)));
      }
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setHasRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ version: 2, step: Math.min(step, LAST_ANSWER_STEP), answers }),
    );
  }, [answers, hasRestored, step]);

  const teaser = useMemo(() => preparePrePaywallTeaser(answers), [answers]);

  const completePrePaywallTransition = useCallback(() => {
    setStage("paywall");
  }, []);

  function update<K extends keyof CreationAnswers>(key: K, value: CreationAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
    setCheckoutMessage("");
  }

  function continueFlow() {
    const message = validationMessage(step, answers);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    if (step === LAST_ANSWER_STEP) {
      setStage("prePaywallTransition");
      return;
    }
    setDirection(1);
    setStep((current) => Math.min(LAST_ANSWER_STEP, current + 1));
  }

  function goBack() {
    setError("");
    setDirection(-1);
    setStep((current) => Math.max(0, current - 1));
  }

  function goToPreviousStep(targetStep: number) {
    if (targetStep >= step) return;
    setError("");
    setDirection(-1);
    setStep(targetStep);
  }

  function editAnswers() {
    setCheckoutMessage("");
    setStage("answers");
    setDirection(-1);
    setStep(LAST_ANSWER_STEP);
  }

  function beginCheckout() {
    const intent = prepareCheckoutIntent(answers);
    setCheckoutMessage(
      `Le checkout sécurisé (${(intent.amountInCents / 100).toFixed(2).replace(".", ",")} €) sera raccordé à Stripe lors de l’ouverture des paiements.`,
    );
  }

  if (stage === "prePaywallTransition") {
    return (
      <PrePaywallTransition
        answers={answers}
        onComplete={completePrePaywallTransition}
      />
    );
  }

  if (stage === "paywall") {
    return (
      <PaywallScene
        teaser={teaser}
        answers={answers}
        checkoutMessage={checkoutMessage}
        onAudioChange={(enabled) => update("audioEnabled", enabled)}
        onCheckout={beginCheckout}
        onEdit={editAnswers}
      />
    );
  }

  const stepContent = [
    <NeedStep key="need" answers={answers} update={update} />,
    <ChildStep key="child" answers={answers} update={update} />,
    <AnchorStep key="anchor" answers={answers} update={update} />,
    <FeelingStep key="feeling" answers={answers} update={update} />,
    <FormatStep key="format" answers={answers} update={update} />,
    <SummaryStep key="summary" answers={answers} update={update} onEdit={goToPreviousStep} />,
  ][step];

  return (
    <CreationShell
      step={step}
      direction={direction}
      answers={answers}
      onBack={goBack}
      onContinue={continueFlow}
      onStepSelect={goToPreviousStep}
      continueLabel={step === LAST_ANSWER_STEP ? "Préparer la révélation" : "Continuer"}
      error={error}
    >
      {stepContent}
    </CreationShell>
  );
}
