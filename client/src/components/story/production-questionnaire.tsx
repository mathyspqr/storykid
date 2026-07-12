"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  CarFront,
  Check,
  CloudMoon,
  Compass,
  Dog,
  Egg,
  Flame,
  Heart,
  HeartHandshake,
  House,
  LockKeyhole,
  Moon,
  MoonStar,
  Mountain,
  PartyPopper,
  PawPrint,
  Rocket,
  Shell,
  Shield,
  Smile,
  Sparkles,
  Squirrel,
  Star,
  WandSparkles,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  QUESTIONNAIRE_OPTIONS,
  type StoryConfiguration,
} from "@/shared/story-production";
import { track } from "@/lib/analytics";
import { apiFetch } from "@/lib/api";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const icons = {
  Backpack,
  CarFront,
  CloudMoon,
  Compass,
  Dog,
  Egg,
  Flame,
  Heart,
  HeartHandshake,
  House,
  Moon,
  MoonStar,
  Mountain,
  PartyPopper,
  PawPrint,
  Rocket,
  Shell,
  Shield,
  Smile,
  Sparkles,
  Squirrel,
  Star,
  WandSparkles,
  Waves,
};
type IconName = keyof typeof icons;
const initial: Partial<StoryConfiguration> = {
  format: "standard",
  childPronoun: "neutral",
};
const stepMeta = [
  ["Quel moment vit votre enfant ?", "moment"],
  ["Comment s’appelle votre enfant ?", "child"],
  ["Quel univers lui plaît le plus ?", "universe"],
  ["Qui l’accompagne dans l’histoire ?", "companion"],
  ["Que doit lui apporter l’histoire ?", "goal"],
  ["Quel ton préférez-vous ?", "tone"],
] as const;

function OptionGrid({
  options,
  value,
  onSelect,
}: {
  options: readonly (readonly [string, string, string])[];
  value?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className={`questionnaire-options questionnaire-options-${options.length}`}>
      {options.map(([id, label, icon], index) => {
        const Icon = icons[icon as IconName] ?? Sparkles;
        const selected = value === id;
        return (
          <motion.button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            whileTap={{ scale: 0.975 }}
            className={`questionnaire-choice ${selected ? "is-selected" : ""}`}
          >
            <span className="questionnaire-choice-icon">
              <Icon aria-hidden="true" />
            </span>
            <span>{label}</span>
            {selected ? (
              <i>
                <Check />
              </i>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}

function goalOptions(pronoun: StoryConfiguration["childPronoun"] | undefined) {
  const feminine = pronoun === "feminine";
  const labels: Record<string, string> = {
    calm: feminine ? "La calmer" : "Le calmer",
    reassure: feminine ? "La rassurer" : "Le rassurer",
    courage: feminine ? "Lui donner du courage" : "Lui donner du courage",
    dream: feminine ? "La faire rêver" : "Le faire rêver",
    smile: feminine ? "La faire sourire" : "Le faire sourire",
  };
  return QUESTIONNAIRE_OPTIONS.emotionalGoal.map(
    ([id, , icon]) => [id, labels[id], icon] as const,
  );
}

const pendingConfigurationKey = "storykid:pending-configuration";

export function ProductionQuestionnaire({
  resumeId,
  restorePending = false,
}: {
  resumeId?: string;
  restorePending?: boolean;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<StoryConfiguration>>(initial);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(false);
  const [accountGate, setAccountGate] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const lastSaved = useRef("");
  const trackedStart = useRef(false);
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      try {
        if (resumeId) {
          const response = await apiFetch(`/api/stories/${resumeId}`);
          if (response.ok) {
            const saved = await response.json();
            if (!cancelled) {
              setAnswers({ ...initial, ...saved.answers, format: "standard" });
              setDraftId(resumeId);
            }
          }
        } else if (restorePending) {
          const saved = sessionStorage.getItem(pendingConfigurationKey);
          if (saved && !cancelled) {
            const parsed = JSON.parse(saved) as Partial<StoryConfiguration>;
            setAnswers({ ...initial, ...parsed, format: "standard" });
            setSummary(true);
            sessionStorage.removeItem(pendingConfigurationKey);
          }
        }
      } catch {
      } finally {
        if (!cancelled) setRestored(true);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, [restorePending, resumeId]);
  useEffect(() => {
    if (!restored || resumeId || draftId) return;
    let cancelled = false;
    (async () => {
      const client = createSupabaseBrowserClient();
      const result = client ? await client.auth.getSession() : null;
      const user = result?.data.session?.user;
      if (!user || user.is_anonymous) return;
      const response = await apiFetch("/api/stories/draft", { method: "POST" });
      if (!response.ok) return;
      const data = await response.json();
      if (!cancelled && data.id) {
        setDraftId(data.id);
        track("create_story_started", {}, data.id);
        trackedStart.current = true;
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [draftId, restored, resumeId]);
  useEffect(() => {
    if (restored && draftId && !trackedStart.current) {
      track("create_story_started", {}, draftId);
      trackedStart.current = true;
    }
  }, [draftId, restored]);
  useEffect(() => {
    if (!draftId || !restored) return;
    const payload = JSON.stringify({ ...answers, format: "standard" });
    if (payload === lastSaved.current) return;
    const timer = window.setTimeout(() => {
      apiFetch(`/api/stories/${draftId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: payload,
      })
        .then((response) => {
          if (response.ok) lastSaved.current = payload;
        })
        .catch(() => {});
    }, 500);
    return () => window.clearTimeout(timer);
  }, [answers, draftId, restored]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [reduce, step, summary]);
  useEffect(() => {
    if (restored && !summary)
      track(
        "questionnaire_step_viewed",
        { step: step + 1 },
        draftId ?? undefined,
      );
  }, [draftId, restored, step, summary]);
  const canContinue = useMemo(
    () =>
      step === 0
        ? Boolean(answers.moment)
        : step === 1
          ? Boolean(answers.childName?.trim() && answers.childAge)
          : step === 2
            ? Boolean(answers.universe)
            : step === 3
              ? Boolean(answers.companion)
              : step === 4
                ? Boolean(answers.emotionalGoal)
                : Boolean(answers.tone),
    [answers, step],
  );
  function update(
    key: keyof StoryConfiguration,
    value: StoryConfiguration[keyof StoryConfiguration],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
    if (key !== "childName")
      track(
        "questionnaire_option_selected",
        { question: key, option: String(value) },
        draftId ?? undefined,
      );
  }
  function next() {
    if (!canContinue) {
      setError(
        step === 1
          ? "Ajoutez son prénom et son âge pour continuer."
          : "Choisissez une réponse pour continuer.",
      );
      return;
    }
    if (step === 5) {
      setSummary(true);
      track(
        "questionnaire_completed",
        { format: "standard" },
        draftId ?? undefined,
      );
      return;
    }
    setStep((value) => value + 1);
  }
  function back() {
    setError("");
    if (summary) {
      setSummary(false);
      return;
    }
    setStep((value) => Math.max(0, value - 1));
  }
  async function requestPreview() {
    setSubmitting(true);
    setError("");
    try {
      const client = createSupabaseBrowserClient();
      const session = client ? await client.auth.getSession() : null;
      const user = session?.data.session?.user;
      if (!user || user.is_anonymous) {
        sessionStorage.setItem(
          pendingConfigurationKey,
          JSON.stringify(answers),
        );
        setAccountGate(true);
        setSubmitting(false);
        return;
      }
      const create = await apiFetch("/api/stories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...answers, format: "standard", id: draftId }),
      });
      const payload = await create.json();
      if (!create.ok)
        throw new Error(
          payload.message ?? "Impossible de sauvegarder le brouillon.",
        );
      track("preview_requested", { format: "standard" }, payload.id);
      const preview = await apiFetch(`/api/stories/${payload.id}/preview`, {
        method: "POST",
      });
      const previewPayload = await preview.json();
      if (!preview.ok)
        throw new Error(
          previewPayload.message ?? "Impossible de préparer l’aperçu.",
        );
      router.push(`/livre/${payload.id}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Une erreur est survenue.",
      );
      setSubmitting(false);
    }
  }
  if (!restored)
    return (
      <main
        className="questionnaire-page questionnaire-loading"
        aria-busy="true"
      />
    );
  const title = summary
    ? `Tout est prêt pour l’histoire de ${answers.childName}`
    : step === 1 && answers.childName
      ? `Quel âge a ${answers.childName} ?`
      : stepMeta[step][0];
  return (
    <main className="questionnaire-page">
      <div className="questionnaire-orb questionnaire-orb-one" />
      <div className="questionnaire-orb questionnaire-orb-two" />
      <header className="questionnaire-header">
        <BrandLogo />
        <div className="questionnaire-progress-copy">
          {summary ? "Récapitulatif" : `Étape ${step + 1} sur 6`}
        </div>
      </header>
      <div className="questionnaire-progress" aria-hidden="true">
        <motion.i animate={{ scaleX: summary ? 1 : (step + 1) / 6 }} />
      </div>
      <section className="questionnaire-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={summary ? "summary" : step}
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -18 }}
            transition={{ duration: reduce ? 0 : 0.28 }}
          >
            <p className="questionnaire-eyebrow">
              {summary ? "Votre direction" : stepMeta[step][1]}
            </p>
            <h1>{title}</h1>
            {!summary && step === 0 ? (
              <OptionGrid
                options={QUESTIONNAIRE_OPTIONS.moment}
                value={answers.moment}
                onSelect={(value) => update("moment", value)}
              />
            ) : null}
            {!summary && step === 1 ? (
              <div className="questionnaire-child">
                <label>
                  <span>Son prénom</span>
                  <input
                    autoFocus
                    aria-label="Prénom de l’enfant"
                    autoComplete="off"
                    maxLength={30}
                    placeholder="Léo"
                    value={answers.childName ?? ""}
                    onChange={(event) =>
                      update("childName", event.target.value)
                    }
                  />
                </label>
                <fieldset>
                  <legend>Son âge</legend>
                  <div>
                    {[3, 4, 5, 6, 7, 8, 9].map((age) => (
                      <button
                        type="button"
                        key={age}
                        aria-pressed={answers.childAge === age}
                        onClick={() => update("childAge", age)}
                        className={
                          answers.childAge === age ? "is-selected" : ""
                        }
                      >
                        {age} ans
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            ) : null}
            {!summary && step === 2 ? (
              <OptionGrid
                options={QUESTIONNAIRE_OPTIONS.universe}
                value={answers.universe}
                onSelect={(value) => update("universe", value)}
              />
            ) : null}
            {!summary && step === 3 ? (
              <OptionGrid
                options={QUESTIONNAIRE_OPTIONS.companion}
                value={answers.companion}
                onSelect={(value) => update("companion", value)}
              />
            ) : null}
            {!summary && step === 4 ? (
              <OptionGrid
                options={goalOptions(answers.childPronoun)}
                value={answers.emotionalGoal}
                onSelect={(value) => update("emotionalGoal", value)}
              />
            ) : null}
            {!summary && step === 5 ? (
              <OptionGrid
                options={QUESTIONNAIRE_OPTIONS.tone}
                value={answers.tone}
                onSelect={(value) => update("tone", value)}
              />
            ) : null}
            {summary ? (
              <><Summary answers={answers as StoryConfiguration} onEdit={(index) => { setSummary(false); setStep(index); }} /><label className="questionnaire-personal-detail"><span>Un petit détail à glisser ? <em>Facultatif</em></span><input maxLength={100} placeholder="Son doudou, son chat, un lieu qu’il aime…" value={answers.personalDetail ?? ""} onChange={(event) => update("personalDetail", event.target.value)} /><small>Nous le glisserons naturellement dans l’histoire et ses illustrations.</small></label></>
            ) : null}
          </motion.div>
        </AnimatePresence>
        {error ? (
          <p role="alert" className="questionnaire-error">
            {error}
          </p>
        ) : null}
      </section>
      <footer className="questionnaire-actions">
        <button
          type="button"
          onClick={back}
          disabled={!summary && step === 0}
          className="questionnaire-back"
        >
          <ArrowLeft /> Retour
        </button>
        {summary ? (
          <button
            type="button"
            onClick={requestPreview}
            disabled={submitting}
            className="questionnaire-next"
          >
            {submitting ? "Création de l’aperçu…" : "Créer mon aperçu gratuit"}
            <ArrowRight />
          </button>
        ) : (
          <button type="button" onClick={next} className="questionnaire-next">
            {step === 5 ? "Voir le récapitulatif" : "Continuer"}
            <ArrowRight />
          </button>
        )}
      </footer>
      <AnimatePresence>
        {accountGate ? (
          <motion.div
            className="reader-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="reader-modal account-gate-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="account-gate-title"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <button type="button" aria-label="Fermer" onClick={() => setAccountGate(false)} className="reader-modal-close"><X /></button>
              <span className="reader-modal-icon"><LockKeyhole /></span>
              <p className="account-gate-kicker">Dernière étape</p>
              <h2 id="account-gate-title">Gardons l’histoire de {answers.childName} au chaud.</h2>
              <p>Créez votre espace gratuit pour lancer l’aperçu et le retrouver dans votre bibliothèque. Vos choix sont déjà sauvegardés.</p>
              <button type="button" onClick={() => router.push(`/connexion?mode=signup&next=${encodeURIComponent("/creer?resume=1")}`)} className="reader-modal-cta">Créer mon espace gratuit <ArrowRight /></button>
              <button type="button" onClick={() => router.push(`/connexion?next=${encodeURIComponent("/creer?resume=1")}`)} className="account-gate-login">J’ai déjà un compte</button>
              <small className="account-gate-note">Aucune carte bancaire demandée pour l’aperçu.</small>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

const labels: Record<string, string> = {
  bedtime: "Le coucher",
  school: "L’école",
  fear: "Une peur",
  anger: "Une grosse colère",
  change: "Un changement",
  confidence: "Manque de confiance",
  animals: "Les animaux",
  space: "L’espace",
  magic: "La magie",
  ocean: "L’océan",
  dinosaurs: "Les dinosaures",
  vehicles: "Les véhicules",
  teddy: "Un doudou",
  fox: "Un renard",
  star: "Une étoile",
  octopus: "Un poulpe",
  dog: "Un petit chien",
  dragon: "Un dragon",
  soft: "Doux et rassurant",
  adventure: "Une petite aventure",
  funny: "Drôle et léger",
  magical: "Magique et merveilleux",
};
function Summary({
  answers,
  onEdit,
}: {
  answers: StoryConfiguration;
  onEdit: (step: number) => void;
}) {
  const goal =
    goalOptions(answers.childPronoun).find(
      ([id]) => id === answers.emotionalGoal,
    )?.[1] ?? answers.emotionalGoal;
  const rows = [
    ["Moment", labels[answers.moment], MoonStar, 0],
    ["Enfant", `${answers.childName} · ${answers.childAge} ans`, Heart, 1],
    ["Univers", labels[answers.universe], Compass, 2],
    ["Compagnon", labels[answers.companion], PawPrint, 3],
    ["Intention", goal, Shield, 4],
    ["Ton", labels[answers.tone], Sparkles, 5],
  ] as const;
  return (
    <div className="questionnaire-summary questionnaire-summary-visual">
      {rows.map(([name, value, Icon, index]) => (
        <article key={name}>
          <span className="questionnaire-summary-icon">
            <Icon />
          </span>
          <div>
            <small>{name}</small>
            <strong>{value}</strong>
          </div>
          <button type="button" onClick={() => onEdit(index)}>
            Modifier
          </button>
        </article>
      ))}
    </div>
  );
}
