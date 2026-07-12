"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Book3DScene } from "@/components/book/Book3DScene";
import type { BookReaderMode, StoryBook, StoryBookPage } from "@/types/book";

type ReaderStage3D = "cover" | "opening" | "reading";
type TurningState = {
  key: number;
  direction: "next" | "prev";
  targetIndex: number;
  frontPage: StoryBookPage;
  backPage: StoryBookPage;
};

const TURN_DURATION_MS = 620;

function imageSource(image?: StoryBookPage["image"] | StoryBook["coverImage"]) {
  if (!image) return "";
  return typeof image === "string" ? image : image.src;
}

const defaultReaderTheme = {
  background:
    "radial-gradient(circle at 20% 18%, rgba(124,92,255,0.30), transparent 30%), radial-gradient(circle at 82% 22%, rgba(255,98,87,0.14), transparent 24%), linear-gradient(180deg,#07123a 0%,#050b25 62%,#020617 100%)",
  glow: "rgba(124,92,255,0.32)",
  accent: "#ff9d95",
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function StoryBookReader({
  book,
  mode = "example",
  open,
  onClose,
  onPreviewPaywall,
  onPreviewCheckout,
  checkoutBusy = false,
}: {
  book: StoryBook | null;
  mode?: BookReaderMode;
  open: boolean;
  onClose: () => void;
  onPreviewPaywall?: () => void;
  onPreviewCheckout?: () => void;
  checkoutBusy?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [stage, setStage] = useState<ReaderStage3D>("cover");
  const [pageIndex, setPageIndex] = useState(0);
  const [turning, setTurning] = useState<TurningState | null>(null);
  const [coverHovered, setCoverHovered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const openingTimerRef = useRef<number | null>(null);
  const turnEndTimerRef = useRef<number | null>(null);
  const assetsReadyRef = useRef(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const theme = book?.readerTheme ?? defaultReaderTheme;
  const pageStep = isMobile ? 1 : 2;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setStage("cover");
    setPageIndex(0);
    setTurning(null);
    setCoverHovered(false);
    setIsClosing(false);
    setAssetsReady(false);
    setShowPaywall(false);
    assetsReadyRef.current = false;
  }, [book?.id, open]);

  useEffect(() => {
    if (!open || !book) return;

    let cancelled = false;
    const sources = Array.from(
      new Set(
        [book.coverImage, ...book.pages.map((page) => page.image ?? (page.type === "story" ? book.coverImage : undefined))]
          .map(imageSource)
          .filter(Boolean),
      ),
    );

    Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = src;
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      assetsReadyRef.current = true;
      setAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [book, open]);

  useEffect(() => {
    return () => {
      if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
      if (turnEndTimerRef.current) window.clearTimeout(turnEndTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const pageCount = book?.pages.length ?? 0;
  const maxIndex = Math.max(0, isMobile ? pageCount - 1 : pageCount % 2 === 0 ? pageCount - 2 : pageCount - 1);
  const canGoBack = stage === "reading" && pageIndex > 0 && !turning;
  const canGoNext = stage === "reading" && pageIndex < maxIndex && !turning;

  const displayIndex = pageIndex;
  const leftPage = book?.pages[displayIndex];
  const rightPage = !isMobile ? book?.pages[displayIndex + 1] : undefined;
  const singlePage = isMobile ? book?.pages[displayIndex] : undefined;

  const spreadPosition = useMemo(() => {
    if (!book) return "0 / 0";
    if (isMobile) return `${Math.min(displayIndex + 1, pageCount)} / ${pageCount}`;
    const first = Math.min(displayIndex + 1, pageCount);
    const second = rightPage ? `-${Math.min(displayIndex + 2, pageCount)}` : "";
    return `${first}${second} / ${pageCount}`;
  }, [book, displayIndex, isMobile, pageCount, rightPage]);

  const openBook = () => {
    if (stage !== "cover" || isClosing) return;
    setStage("opening");
    if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
    const finishOpening = () => {
      if (assetsReadyRef.current) {
        setStage("reading");
        return;
      }
      openingTimerRef.current = window.setTimeout(finishOpening, 80);
    };
    openingTimerRef.current = window.setTimeout(finishOpening, 1650);
  };

  const closeReader = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTurning(null);
    setCoverHovered(false);
    if (openingTimerRef.current) window.clearTimeout(openingTimerRef.current);
    if (turnEndTimerRef.current) window.clearTimeout(turnEndTimerRef.current);
    onClose();
  };

  const startTurn = (direction: "next" | "prev") => {
    if (!book || stage !== "reading" || turning || isClosing || !assetsReady) return;
    const targetIndex =
      direction === "next"
        ? Math.min(maxIndex, pageIndex + pageStep)
        : Math.max(0, pageIndex - pageStep);
    if (targetIndex === pageIndex) return;

    const frontPage =
      direction === "next"
        ? book.pages[Math.min(pageIndex + pageStep - 1, pageCount - 1)]
        : book.pages[pageIndex];
    const backPage =
      direction === "next"
        ? book.pages[targetIndex]
        : book.pages[Math.min(targetIndex + pageStep - 1, pageCount - 1)];

    // Keep the visible spread stable while the fully prepared page turns over it.
    setTurning({ key: Date.now(), direction, targetIndex, frontPage, backPage });
    if (turnEndTimerRef.current) window.clearTimeout(turnEndTimerRef.current);
    turnEndTimerRef.current = window.setTimeout(() => {
      setPageIndex(targetIndex);
      setTurning(null);
    }, TURN_DURATION_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeReader();
      if (event.key === "ArrowRight") startTurn("next");
      if (event.key === "ArrowLeft") startTurn("prev");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && book && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Lecteur ${book.title}`}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#050b25] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute -inset-6 scale-110 bg-cover bg-center blur-2xl" style={{ background: theme.background, backgroundImage: book.coverImage ? `linear-gradient(180deg,rgba(5,11,37,.64),rgba(5,11,37,.88)),url("${imageSource(book.coverImage)}")` : undefined }} />
          <div className="absolute inset-0 bg-[#07123a]/42" />
          <div
            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ backgroundColor: theme.glow, opacity: stage === "cover" ? 0.42 : 0.28 }}
          />
          <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.55)_1px,transparent_2px),radial-gradient(circle_at_74%_18%,rgba(255,255,255,0.34)_1px,transparent_2px),radial-gradient(circle_at_82%_68%,rgba(255,255,255,0.30)_1px,transparent_2px),radial-gradient(circle_at_36%_78%,rgba(255,255,255,0.34)_1px,transparent_2px)]" />

          <div className="relative flex h-full min-h-0 flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-7">
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
                style={{ color: theme.accent }}
              >
                {mode === "example" ? "Exemple StoryKid" : "Livre StoryKid"}
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  closeReader();
                }}
                aria-label="Fermer le lecteur"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/14 bg-white/10 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0.16, isMobile ? 7.35 : 6.35], fov: isMobile ? 32 : 35 }}
                gl={{ antialias: true, alpha: true }}
                className="absolute inset-0"
              >
                <Suspense fallback={null}>
                  <Book3DScene
                    book={book}
                    stage={stage}
                    leftPage={leftPage}
                    rightPage={rightPage}
                    singlePage={singlePage}
                    turningPage={turning}
                    isMobile={isMobile}
                    coverHovered={coverHovered}
                  />
                </Suspense>
              </Canvas>

              <AnimatePresence>
                {stage === "cover" && !isClosing && (
                  <motion.div
                    className="pointer-events-none absolute inset-x-4 bottom-7 z-10 mx-auto flex max-w-xl flex-col items-center text-center md:bottom-auto md:left-[58%] md:right-10 md:top-1/2 md:mx-0 md:-translate-y-1/2 md:items-start md:text-left"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35 }}
                  >
                    {mode === "example" ? <h2 className="text-[1.65rem] font-extrabold leading-tight md:text-5xl">{book.title}</h2> : null}
                    {mode === "example" ? <p className="mt-2 text-sm font-bold text-white/66 md:text-base">
                      {book.childName}
                      {book.age ? `, ${book.age}` : ""} · {book.theme}
                    </p> : null}
                    <p className="mt-4 hidden max-w-md text-base font-semibold leading-7 text-white/72 md:block">
                      {mode === "preview"
                        ? "Ouvre ton aperçu et lis les premières pages avant de décider."
                        : "Ouvre le livre et découvre quelques pages avant de créer le tien."}
                    </p>
                    <button
                      type="button"
                      onClick={openBook}
                      onMouseEnter={() => setCoverHovered(true)}
                      onMouseLeave={() => setCoverHovered(false)}
                      className="pointer-events-auto mt-5 inline-flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#ff6257] px-6 text-sm font-extrabold text-white shadow-[0_22px_54px_rgba(255,98,87,0.34)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] md:h-[52px] md:px-7"
                    >
                      Ouvrir le livre
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {stage === "cover" && !isClosing && (
                <button
                  type="button"
                  onClick={openBook}
                  onMouseEnter={() => setCoverHovered(true)}
                  onMouseLeave={() => setCoverHovered(false)}
                  aria-label={`Ouvrir le livre ${book.title}`}
                  className="absolute left-1/2 top-[38%] z-10 h-[38vh] max-h-[390px] w-[58vw] max-w-[390px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[28px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35 md:left-[34%] md:top-1/2"
                />
              )}

              {stage !== "cover" && !isClosing && (
                <div className="pointer-events-none absolute inset-x-4 bottom-5 z-10 flex items-center justify-center gap-4 md:bottom-7">
                  <button
                    type="button"
                    onClick={() => startTurn("prev")}
                    disabled={!canGoBack}
                    className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-35 md:h-12 md:w-12"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <p className="min-w-[96px] text-center text-xs font-extrabold uppercase tracking-[0.16em] text-white/68">
                    {spreadPosition}
                  </p>
                  <button
                    type="button"
                    onClick={() => canGoNext ? startTurn("next") : mode === "preview" ? setShowPaywall(true) : undefined}
                    disabled={!canGoNext && mode !== "preview"}
                    className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-white/12 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-35 md:h-12 md:w-12"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
              <AnimatePresence>{showPaywall ? <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-20 grid place-items-center p-5" style={{background:"rgba(5,11,37,.84)",backdropFilter:"blur(18px)"}}><motion.div initial={{opacity:0,y:18,scale:.97}} animate={{opacity:1,y:0,scale:1}} className="w-full max-w-[408px] rounded-[28px] border border-white/20 p-7 text-center shadow-[0_26px_75px_rgba(0,0,0,.56)]" style={{background:"linear-gradient(145deg,#18245b,#0d153b)"}}><motion.div animate={{scale:[1,1.08,1]}} transition={{duration:2.4,repeat:Infinity}} className="mx-auto grid h-14 w-14 place-items-center rounded-[18px] bg-[#ff6257] text-2xl shadow-[0_12px_32px_rgba(255,98,87,.38)]">✦</motion.div><p className="mt-5 text-[10px] font-black uppercase tracking-[.17em] text-[#ffb1a9]">Votre histoire est prête</p><h3 className="mt-2 text-3xl font-extrabold leading-tight">Débloquez l’aventure complète</h3><p className="mt-3 text-sm font-semibold leading-6 text-white/75">Retrouvez l’histoire de {book.childName} dans votre bibliothèque et conservez son PDF privé.</p><div className="mt-5 grid gap-2 text-left text-sm font-bold text-white/84"><p>✓ Histoire complète personnalisée</p><p>✓ Toutes les pages et illustrations</p><p>✓ PDF privé à conserver</p></div><div className="mt-5 flex items-end justify-between border-t border-white/14 pt-4"><span className="text-xs font-bold text-white/62">Paiement unique</span><strong className="text-3xl">3,99 €</strong></div><button type="button" disabled={checkoutBusy} onClick={()=>onPreviewCheckout?onPreviewCheckout():onPreviewPaywall?.()} className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ff6257] px-5 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(255,98,87,.28)]">{checkoutBusy?"Ouverture sécurisée…":"Débloquer mon histoire"}</button><button type="button" onClick={()=>setShowPaywall(false)} className="mt-3 block w-full py-1 text-xs font-bold text-white/65">Revenir à l’aperçu</button></motion.div></motion.div>:null}</AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
