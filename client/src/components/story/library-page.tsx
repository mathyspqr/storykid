"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  LoaderCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HeaderAccount } from "@/components/layout/header-account";
import { apiFetch } from "@/lib/api";
import { track } from "@/lib/analytics";

type Book = {
  id: string;
  title: string | null;
  child_name: string | null;
  status: string;
  page_count: number | null;
  cover: string;
  pdf_storage_path: string | null;
  expiresAt: string | null;
  progress: number | null;
  created_at: string;
};
type ClassicReader = {
  story: {
    id: string;
    status: string;
    title: string | null;
    child_name: string;
  };
  pages: { pageNumber: number; text: string; illustrationUrl: string }[];
};

const actions: Record<string, string> = {
  draft: "Reprendre la création",
  preview_ready: "Ouvrir en 3D",
  preview_queued: "Suivre la création",
  preview_generating: "Suivre la création",
  checkout_created: "Continuer et débloquer",
  paid: "Livre en préparation",
  full_generation_queued: "Livre en préparation",
  full_generating: "Livre en préparation",
  ready: "Lire le livre",
  preview_failed: "Réessayer",
  generation_failed: "Réessayer",
};

function expiryLabel(expiresAt: string, now: number) {
  const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  return `${String(hours).padStart(2, "0")} h ${String(minutes).padStart(2, "0")} min ${String(seconds).padStart(2, "0")} s`;
}
function StoryCard({
  book,
  now,
  onClassic,
}: {
  book: Book;
  now: number;
  onClassic: (book: Book) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const title =
    book.title ?? `Histoire de ${book.child_name ?? "votre enfant"}`;
  const href =
    book.status === "draft" ? `/creer?story=${book.id}` : `/livre/${book.id}`;
  const generating = [
    "preview_queued",
    "preview_generating",
    "full_generation_queued",
    "full_generating",
    "paid",
  ].includes(book.status);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const response = await apiFetch(`/api/stories/${book.id}/pdf`);
      const payload = await response.json();
      if (response.ok && payload.url) window.location.assign(payload.url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article
      className={`library-card ${book.status === "ready" ? "is-ready" : "is-draft"}`}
    >
      <div className="library-cover">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Couverture de ${title}`}
            fill
            unoptimized
            sizes="150px"
          />
        ) : (
          <BookOpen />
        )}
        <div className="library-cover-title"><small>StoryKid</small><strong>{title}</strong></div>
        {generating ? (
          <div className="library-cover-progress">
            <LoaderCircle />
            <strong>{Math.min(99, Math.max(1, book.progress ?? 5))} %</strong>
          </div>
        ) : null}
        <span className="library-card-status">
          {book.status === "ready"
            ? "Terminé"
            : generating
              ? "Création en cours"
              : "Brouillon"}
        </span>
      </div>
      <div className="library-card-copy">
        {book.status === "ready" ? (
          <span>{book.page_count ?? "—"} pages</span>
        ) : book.expiresAt ? (
          <div className="library-expiry" aria-live="polite">
            <small>Suppression dans</small>
            <strong>{expiryLabel(book.expiresAt, now)}</strong>
          </div>
        ) : (
          <span>Aperçu à poursuivre</span>
        )}
        <h3>{title}</h3>
        <p>
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
            new Date(book.created_at),
          )}
        </p>
        <div className="library-card-actions">
          <Link href={href}>{actions[book.status] ?? "Voir le livre"}</Link>
          {[
            "preview_ready",
            "checkout_created",
            "ready",
          ].includes(book.status) ? (
            <button
              type="button"
              className="library-classic"
              onClick={() => onClassic(book)}
            >
              Lecture classique
            </button>
          ) : null}
          {book.status === "ready" && book.pdf_storage_path ? (
            <button
              type="button"
              className="library-pdf"
              onClick={downloadPdf}
              disabled={downloading}
              aria-label={`Télécharger ${title} en PDF`}
            >
              <Download /> {downloading ? "Préparation…" : "PDF"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function LibraryPage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [reader, setReader] = useState<ClassicReader | null>(null);
  const [readerPage, setReaderPage] = useState(0);
  const [classicPaywall, setClassicPaywall] = useState(false);

  useEffect(() => {
    track("library_opened");
    apiFetch("/api/library")
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = "/connexion?next=/bibliotheque";
          return;
        }
        if (!response.ok) throw new Error("library_unavailable");
        setBooks((await response.json()).books);
      })
      .catch(() =>
        setError("La bibliothèque est temporairement indisponible."),
      );
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!books?.some((book) => ["preview_queued", "preview_generating", "full_generation_queued", "full_generating", "paid"].includes(book.status))) return;
    const timer = window.setInterval(() => {
      apiFetch("/api/library").then(async (response) => { if (response.ok) setBooks((await response.json()).books); }).catch(() => {});
    }, 2_500);
    return () => window.clearInterval(timer);
  }, [books]);
  function openClassic(book: Book) {
    window.location.href = `/livre/${book.id}?mode=classic`;
  }

  if (error)
    return (
      <main className="reader-state">
        <h1>Bibliothèque indisponible</h1>
        <p>{error}</p>
        <Link href="/creer">Créer une histoire</Link>
      </main>
    );
  const ready = books?.filter((book) => book.status === "ready") ?? [];
  const inProgress = books?.filter((book) => book.status !== "ready") ?? [];

  return (
    <main className="library-page">
      <header>
        <BrandLogo />
        <nav>
          <Link href="/creer">
            <Plus /> Créer une histoire
          </Link>
          <HeaderAccount />
        </nav>
      </header>
      <section>
        <div className="library-intro">
          <div>
            <p className="library-eyebrow">
              <Sparkles /> Votre espace
            </p>
            <h1>Ma bibliothèque</h1>
            <p>
              Vos histoires, vos aperçus et les souvenirs à relire quand vous
              voulez.
            </p>
          </div>
          {books?.length ? (
            <div className="library-count">
              <BookOpen />
              <strong>{books.length}</strong>
              <span>{books.length > 1 ? "histoires" : "histoire"}</span>
            </div>
          ) : null}
        </div>
        {books === null ? (
          <div className="library-loading" role="status">
            <LoaderCircle aria-hidden="true" />
            <span>Ouverture de votre bibliothèque…</span>
          </div>
        ) : books.length ? (
          <div className="library-sections">
            {ready.length ? (
              <div className="library-group">
                <div className="library-section-heading">
                  <div>
                    <p>À conserver</p>
                    <h2>Mes livres</h2>
                  </div>
                  <span>{ready.length}</span>
                </div>
                <div className="library-grid">
                  {ready.map((book) => (
                    <StoryCard
                      key={book.id}
                      book={book}
                      now={now}
                      onClassic={openClassic}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            {inProgress.length ? (
              <div className="library-group">
                <div className="library-section-heading">
                  <div>
                    <p>À finaliser</p>
                    <h2>Mes brouillons</h2>
                  </div>
                </div>
                <div className="library-grid">
                  {inProgress.map((book) => (
                    <StoryCard
                      key={book.id}
                      book={book}
                      now={now}
                      onClassic={openClassic}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="library-empty">
            <BookOpen />
            <h2>Votre première histoire vous attend</h2>
            <p>
              Quelques choix suffisent pour préparer un aperçu personnalisé.
            </p>
            <Link href="/creer">Créer une histoire</Link>
          </div>
        )}
      </section>
      <AnimatePresence>
        {reader ? (
          <motion.div
            className="classic-reader-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReader(null)}
          >
            <motion.section
              className="classic-reader-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 290 }}
              onClick={(event) => event.stopPropagation()}
            >
              <header>
                <div>
                  <p>Lecture classique</p>
                  <h2>
                    {reader.story.title ??
                      `L’histoire de ${reader.story.child_name}`}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setReader(null)}
                  aria-label="Fermer"
                >
                  <X />
                </button>
              </header>
              <div className="classic-reader-page">
                {reader.pages[readerPage]?.illustrationUrl ? (
                  <Image
                    src={reader.pages[readerPage].illustrationUrl}
                    alt="Illustration de l’histoire"
                    fill
                    unoptimized
                    sizes="700px"
                  />
                ) : null}
                <article>
                  <small>
                    Page {reader.pages[readerPage]?.pageNumber ?? 1}
                  </small>
                  <p>{reader.pages[readerPage]?.text}</p>
                </article>
                {classicPaywall ? (
                  <div className="classic-paywall">
                    <div>
                      <p>La suite est prête</p>
                      <h3>Débloquez l’histoire complète</h3>
                      <span>
                        Retrouvez-la en 3D et conservez son PDF privé.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          (location.href = `/livre/${reader.story.id}?mode=classic&paywall=1`)
                        }
                      >
                        Continuer
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <footer>
                <button
                  type="button"
                  onClick={() =>
                    setReaderPage((value) => Math.max(0, value - 1))
                  }
                  disabled={!readerPage}
                >
                  <ArrowLeft /> Précédent
                </button>
                <span>
                  {readerPage + 1} / {reader.pages.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    readerPage >= reader.pages.length - 1 &&
                    reader.story.status !== "ready"
                      ? setClassicPaywall(true)
                      : setReaderPage((value) =>
                          Math.min(reader.pages.length - 1, value + 1),
                        )
                  }
                  disabled={
                    readerPage >= reader.pages.length - 1 &&
                    reader.story.status === "ready"
                  }
                >
                  Suivant <ArrowRight />
                </button>
              </footer>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
