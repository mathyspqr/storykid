"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RotateCcw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { STORY_OFFERS } from "@/shared/story-production";
import { apiFetch } from "@/lib/api";
import { track } from "@/lib/analytics";
import openBook from "@/assets/cleaned/book-open-structured-clean.png";

type StoryPreview = {
  id: string;
  status: string;
  title: string | null;
  child_name: string;
  page_count: number;
  format: "standard";
  generationError?: string | null;
};
type Page = { pageNumber: number; text: string; illustrationUrl: string };

export function PreviewReader({
  story,
  pages,
  coverUrl,
  anonymous,
  claimToken,
  initialPage,
  initialPaywall = false,
}: {
  story: StoryPreview;
  pages: Page[];
  coverUrl: string;
  anonymous: boolean;
  claimToken: string;
  initialPage: number;
  initialPaywall?: boolean;
}) {
  const [view, setView] = useState<"cover" | "page">(
    story.status === "ready" && initialPage > 1 ? "page" : "cover",
  );
  const [pageIndex, setPageIndex] = useState(
    Math.max(
      0,
      pages.findIndex((page) => page.pageNumber === initialPage),
    ),
  );
  const [gate, setGate] = useState<"auth" | "paywall" | null>(
    initialPaywall ? "paywall" : null,
  );
  const [authMode, setAuthMode] = useState<"create" | "login">("create");
  const [isAnonymous, setIsAnonymous] = useState(anonymous);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(5);
  const touchStart = useRef<number | null>(null);
  const offer = STORY_OFFERS[story.format] ?? STORY_OFFERS.standard;
  const current = pages[pageIndex];
  const isPreviewLoading = ["preview_queued", "preview_generating"].includes(
    story.status,
  );
  const isFullLoading = [
    "paid",
    "full_generation_queued",
    "full_generating",
  ].includes(story.status);

  useEffect(() => {
    if (!isPreviewLoading && !isFullLoading) return;
    const timer = window.setInterval(async () => {
      const response = await apiFetch(`/api/stories/${story.id}/status`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.progress === "number")
        setGenerationProgress(data.progress);
      if (
        [
          "preview_ready",
          "ready",
          "preview_failed",
          "generation_failed",
        ].includes(data.status)
      )
        location.reload();
    }, 1200);
    return () => window.clearInterval(timer);
  }, [isFullLoading, isPreviewLoading, story.id]);
  useEffect(() => {
    if (story.status !== "ready" || !current || current.pageNumber > story.page_count) return;
    const timer = window.setTimeout(
      () =>
        apiFetch(`/api/stories/${story.id}/progress`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ page: current.pageNumber }),
        }).catch(() => {}),
      500,
    );
    return () => window.clearTimeout(timer);
  }, [current, story.id, story.status, story.page_count]);
  useEffect(() => {
    track(
      story.status === "ready" ? "story_opened" : "preview_opened",
      {},
      story.id,
    );
  }, [story.id, story.status]);
  useEffect(() => {
    if (view === "page" && current)
      track("preview_page_read", { page: current.pageNumber }, story.id);
  }, [current, story.id, view]);

  const continueStory = useCallback(() => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((index) => index + 1);
      return;
    }
    if (story.status === "ready") {
      location.href = "/bibliotheque";
      return;
    }
    const next = isAnonymous ? "auth" : "paywall";
    setGate(next);
    track(
      next === "auth" ? "auth_gate_viewed" : "paywall_viewed",
      {},
      story.id,
    );
  }, [isAnonymous, pageIndex, pages.length, story.id, story.status]);
  useEffect(() => {
    if (view !== "page" || gate) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") continueStory();
      if (event.key === "ArrowLeft" && pageIndex > 0)
        setPageIndex((index) => index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [continueStory, gate, pageIndex, view]);

  async function authenticate() {
    setBusy(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("L’authentification n’est pas configurée.");
      setBusy(false);
      return;
    }
    if (authMode === "create") {
      const { error } = await supabase.auth.updateUser(
        { email, password },
        { emailRedirectTo: location.href },
      );
      if (error) {
        setMessage(
          "Ce compte n’a pas pu être créé. Vérifiez l’adresse et choisissez au moins 8 caractères.",
        );
        setBusy(false);
        return;
      }
      track("account_created", {}, story.id);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage("Adresse ou mot de passe incorrect.");
        setBusy(false);
        return;
      }
      const claim = await apiFetch(`/api/stories/${story.id}/claim`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claimToken }),
      });
      if (!claim.ok) {
        const data = await claim.json();
        setMessage(data.message ?? "L’histoire n’a pas pu être rattachée.");
        setBusy(false);
        return;
      }
    }
    setIsAnonymous(false);
    setGate("paywall");
    track("paywall_viewed", {}, story.id);
    setBusy(false);
  }
  async function checkout() {
    setBusy(true);
    setMessage("");
    track("checkout_started", { offer: story.format }, story.id);
    const response = await apiFetch(`/api/stories/${story.id}/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ offerId: story.format }),
    });
    const data = await response.json();
    if (response.ok && data.url) location.href = data.url;
    else {
      setMessage(
        data.message ?? "Le paiement est temporairement indisponible.",
      );
      setBusy(false);
    }
  }
  async function retry() {
    setBusy(true);
    const response = await apiFetch(`/api/stories/${story.id}/retry`, {
      method: "POST",
    });
    if (response.ok) location.reload();
    else setBusy(false);
  }
  function endSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (distance < -55) continueStory();
    if (distance > 55 && pageIndex > 0) setPageIndex((index) => index - 1);
  }

  if (isPreviewLoading)
    return (
      <PreparationState
        progress={generationProgress}
        title={`L’aperçu de ${story.child_name} prend forme`}
        text="Couverture et deux premières pages en préparation."
      />
    );
  if (isFullLoading)
    return (
      <PreparationState
        progress={generationProgress}
        title="Merci pour votre commande"
        text={`Votre paiement est confirmé. Nous préparons maintenant le livre complet de ${story.child_name}.`}
        eyebrow="Paiement confirmé"
        artLabel="StoryKid prépare votre livre"
        library
      />
    );
  if (story.status === "preview_failed" || story.status === "generation_failed") {
    const serviceBusy = story.generationError === "GEMINI_429";
    return (
      <main className="reader-state">
        <RotateCcw />
        <h1>
          {serviceBusy
            ? "Le service d’illustration est très demandé"
            : "La création s’est interrompue"}
        </h1>
        <p>
          {serviceBusy
            ? "Votre aperçu est conservé. Attendez une minute avant de relancer : rien n’est à recommencer."
            : "Votre aperçu est conservé. Vous pouvez relancer la préparation sans recommencer le questionnaire."}
        </p>
        <button type="button" onClick={retry} disabled={busy}>
          {busy ? "Relance…" : "Réessayer"}
        </button>
        <Link href="/bibliotheque">Revenir à la bibliothèque</Link>
      </main>
    );
  }

  return (
    <main className="preview-reader">
      <header>
        <BrandLogo />
      </header>
      <section className={`preview-stage is-${view}`}>
        {view === "cover" ? (
          <div className="preview-cover">
            <div className="preview-cover-art">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={`Couverture de ${story.title}`}
                  fill
                  unoptimized
                  priority
                />
              ) : (
                <div />
              )}
              <div className="preview-cover-title"><small>StoryKid</small><strong>{story.title}</strong></div>
            </div>
            <button type="button" onClick={() => setView("page")}>
              <BookOpen /> Ouvrir le livre
            </button>
          </div>
        ) : (
          <div
            className={`preview-page ${current?.pageNumber && current.pageNumber % 2 === 0 ? "is-illustration-bottom" : ""}`}
            onPointerDown={(event) => {
              touchStart.current = event.clientX;
            }}
            onPointerUp={(event) => endSwipe(event.clientX)}
          >
            {current?.illustrationUrl && current.pageNumber % 2 !== 0 ? (
              <div className="preview-page-image">
                <Image
                  src={current.illustrationUrl}
                  alt={`Illustration de la page ${current.pageNumber}`}
                  fill
                  unoptimized
                />
              </div>
            ) : null}
            <div className="preview-page-number">
              {current?.pageNumber && current.pageNumber > story.page_count ? "Mot de fin" : story.status === "ready"
                ? `Page ${current?.pageNumber ?? 1} sur ${pages.length}`
                : `Aperçu gratuit · page ${current?.pageNumber ?? 1} sur ${pages.length}`}
            </div>
            <article className={current?.pageNumber && current.pageNumber > story.page_count ? "preview-final-note" : ""}>
              {current?.text ?? "L’aperçu est en cours de préparation."}
            </article>
            {current?.illustrationUrl && current.pageNumber % 2 === 0 ? (
              <div className="preview-page-image">
                <Image src={current.illustrationUrl} alt={`Illustration de la page ${current.pageNumber}`} fill unoptimized />
              </div>
            ) : null}
            <div className="preview-page-nav">
              {pageIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setPageIndex((index) => index - 1)}
                  className="is-secondary"
                >
                  <ArrowLeft /> Précédent
                </button>
              ) : null}
              <button type="button" onClick={continueStory}>
                {story.status === "ready"
                  ? pageIndex < pages.length - 1
                    ? "Page suivante"
                    : "Retour à la bibliothèque"
                  : pageIndex < pages.length - 1
                    ? "Page suivante"
                    : "Débloquer la suite"}{" "}
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </section>
      {gate ? (
        <div className="reader-modal-backdrop">
          <section
            className={`reader-modal ${gate === "paywall" ? "reader-modal-paywall" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gate-title"
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setGate(null)}
              className="reader-modal-close"
            >
              <X />
            </button>
            {gate === "auth" ? (
              <>
                <span className="reader-modal-icon">
                  <Mail />
                </span>
                <h2 id="gate-title">
                  Enregistrez l’histoire de {story.child_name}
                </h2>
                <p>
                  Créez votre compte pour conserver cet aperçu et retrouver le
                  livre dans votre bibliothèque après l’achat.
                </p>
                <div className="reader-auth-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authMode === "create"}
                    onClick={() => setAuthMode("create")}
                  >
                    Créer mon compte
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authMode === "login"}
                    onClick={() => setAuthMode("login")}
                  >
                    J’ai déjà un compte
                  </button>
                </div>
                <label>
                  <span>Votre adresse email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@exemple.fr"
                  />
                </label>
                <label>
                  <span>Votre mot de passe</span>
                  <input
                    type="password"
                    autoComplete={
                      authMode === "create"
                        ? "new-password"
                        : "current-password"
                    }
                    value={password}
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                  />
                </label>
                <button
                  type="button"
                  onClick={authenticate}
                  disabled={busy || !email.includes("@") || password.length < 8}
                  className="reader-modal-cta"
                >
                  {busy
                    ? "Connexion…"
                    : authMode === "create"
                      ? "Créer et enregistrer"
                      : "Me connecter"}
                </button>
              </>
            ) : (
              <>
                <span className="reader-modal-icon">
                  <LockKeyhole />
                </span>
                <h2 id="gate-title">Votre histoire est prête à continuer</h2>
                <p>
                  Débloquez l’aventure complète de {story.child_name} et
                  gardez-la dans votre bibliothèque.
                </p>
                <ul>
                  <li>
                    <Check /> Histoire complète personnalisée
                  </li>
                  <li>
                    <Check /> Toutes les pages et illustrations
                  </li>
                  <li>
                    <Check /> PDF privé à conserver
                  </li>
                </ul>
                <div className="reader-price">
                  <span>Paiement unique, sans abonnement</span>
                  <strong>
                    {(offer.priceCents / 100).toFixed(2).replace(".", ",")} €
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={checkout}
                  disabled={busy}
                  className="reader-modal-cta"
                >
                  {busy
                    ? "Ouverture du paiement…"
                    : `Débloquer l’histoire — ${(offer.priceCents / 100).toFixed(2).replace(".", ",")} €`}
                </button>
              </>
            )}
            {message ? (
              <p role="status" className="reader-message">
                {message}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}

function PreparationState({
  title,
  text,
  library = false,
  progress = 5,
  kind = "preview",
  coverUrl = "",
  eyebrow = "Aperçu en préparation",
  artLabel = "StoryKid crée votre aperçu",
}: {
  title: string;
  text: string;
  library?: boolean;
  progress?: number;
  kind?: "preview" | "full";
  coverUrl?: string;
  eyebrow?: string;
  artLabel?: string;
}) {
  return (
    <main className={`reader-state reader-preparation is-${kind}`} aria-live="polite">
      <div className="preparation-art" aria-hidden="true">
        <i className="preparation-orbit one" />
        <i className="preparation-orbit two" />
        <div className="preparation-book">
          {kind === "full" && coverUrl ? <Image src={coverUrl} alt="" fill unoptimized priority /> : <Image src={openBook} alt="" priority />}
          <span>
            {kind === "full" ? <BookOpen /> : <LoaderCircle />}
          </span>
        </div>
        <b>{artLabel}</b>
      </div>
      <div className="preparation-copy">
        <p className="preparation-kicker">
          {eyebrow} · {Math.min(99, Math.max(1, progress))} %
        </p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div
          className="preparation-progress"
          aria-label={`Préparation à ${progress} %`}
        >
          <i style={{ width: `${Math.min(99, Math.max(3, progress))}%` }} />
        </div>
        <small>
          Texte, illustrations et mise en page se préparent ensemble.
        </small>
      </div>
      <Link href="/bibliotheque">
        {library ? "Suivre dans ma bibliothèque" : "Voir ma bibliothèque"}
      </Link>
    </main>
  );
}
