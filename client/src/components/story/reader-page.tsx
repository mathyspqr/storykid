/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Download, Expand, FileText, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StoryBookReader } from "@/components/book/StoryBookReader";
import type { StoryBook } from "@/types/book";
import { apiFetch } from "@/lib/api";
import { PreviewReader } from "@/components/story/preview-reader";

function StoryExperience({ data }: { data: any }) {
  const [open, setOpen] = useState(true);
  const [classic, setClassic] = useState(false);
  const [classicPaywall, setClassicPaywall] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [leavingReader, setLeavingReader] = useState(false);
  const purchased = data.story.status === "ready";
  const book = useMemo<StoryBook>(
    () => ({
      id: data.story.id,
      title: data.story.title ?? `L’histoire de ${data.story.child_name}`,
      childName: data.story.child_name,
      coverImage: data.coverUrl,
      pages: data.pages.map((page: any) => ({
        id: `page-${page.pageNumber}`,
        pageNumber: page.pageNumber,
        title: data.story.title,
        text: page.text,
        image: page.illustrationUrl,
        type: page.pageNumber > data.story.page_count ? "moral" as const : "story" as const,
      })),
    }),
    [data],
  );
  async function download() {
    setDownloading(true);
    try {
      const response = await apiFetch(`/api/stories/${data.story.id}/pdf`);
      const payload = await response.json();
      if (response.ok && payload.url) window.location.assign(payload.url);
    } finally {
      setDownloading(false);
    }
  }
  async function checkout() {
    if (data.anonymous) {
      setClassicPaywall(true);
      setClassic(true);
      return;
    }
    setCheckoutBusy(true);
    setCheckoutError("");
    try {
      const response = await apiFetch(`/api/stories/${data.story.id}/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ offerId: "standard" }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.url) window.location.href = payload.url;
      else setCheckoutError(payload.message ?? "Le paiement sécurisé n’a pas pu s’ouvrir. Réessayez dans un instant.");
    } catch {
      setCheckoutError("La connexion a été interrompue. Votre histoire est conservée : vous pouvez relancer le paiement.");
    } finally {
      setCheckoutBusy(false);
    }
  }
  if (classic)
    return <PreviewReader {...data} initialPaywall={classicPaywall} />;
  return (
    <>
      <main className="reader-state">
        <FileText />
        <h1>{book.title}</h1>
        <p>
          {purchased
            ? "Votre livre est prêt. Ouvrez-le en 3D ou conservez sa version PDF."
            : "Votre aperçu est disponible en 3D. La suite reste à débloquer."}
        </p>
        <div className="reader-ready-actions">
          <button type="button" onClick={() => setOpen(true)}>
            <Expand /> Ouvrir le livre en 3D
          </button>
          {purchased ? (
            <button type="button" onClick={download} disabled={downloading}>
              <Download /> {downloading ? "Préparation…" : "Télécharger le PDF"}
            </button>
          ) : null}
        </div>
        <Link href="/bibliotheque">Ma bibliothèque</Link>
      </main>
      <StoryBookReader
        book={book}
        mode={purchased ? "full" : "preview"}
        open={open}
        checkoutBusy={checkoutBusy}
        onPreviewCheckout={checkout}
        onPreviewPaywall={() => {
          setClassicPaywall(true);
          setClassic(true);
        }}
        onClose={() => {
          setOpen(false);
          setLeavingReader(true);
          window.setTimeout(() => window.location.replace(data.anonymous ? "/" : "/bibliotheque"), 80);
        }}
      />
      {leavingReader ? <div className="fixed inset-0 z-[200] bg-[#050b25]" aria-hidden="true" /> : null}
      {checkoutError ? <div className="reader-modal-backdrop"><section className="reader-modal" role="alertdialog" aria-modal="true" aria-labelledby="checkout-error-title"><button type="button" aria-label="Fermer" onClick={() => setCheckoutError("")} className="reader-modal-close"><X /></button><h2 id="checkout-error-title">Paiement non ouvert</h2><p>{checkoutError}</p><button type="button" onClick={() => setCheckoutError("")} className="reader-modal-cta">Revenir au livre</button></section></div> : null}
    </>
  );
}

export function ReaderPage({
  id,
  classic = false,
  initialPaywall = false,
}: {
  id: string;
  classic?: boolean;
  initialPaywall?: boolean;
}) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch(`/api/stories/${id}/reader`)
      .then(async (response) =>
        response.ok
          ? setData(await response.json())
          : setError("Cette histoire est indisponible."),
      )
      .catch(() => setError("Le lecteur est temporairement indisponible."));
  }, [id]);
  if (error)
    return (
      <main className="reader-state">
        <h1>Histoire indisponible</h1>
        <p>{error}</p>
        <Link href="/bibliotheque">Ma bibliothèque</Link>
      </main>
    );
  if (!data)
    return (
      <main className="reader-state" aria-busy="true">
        <h1>Ouverture du livre…</h1>
      </main>
    );
  return !classic &&
    ["preview_ready", "checkout_created", "ready"].includes(
      data.story.status,
    ) ? (
    <StoryExperience data={data} />
  ) : (
    <PreviewReader {...data} initialPaywall={initialPaywall} />
  );
}
