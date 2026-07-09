import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { ArrowRight, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoryBook, StoryBookPage } from "@/types/book";

type BookPageProps = {
  book: StoryBook;
  page: StoryBookPage;
  className?: string;
  compact?: boolean;
};

function getImageAlt(book: StoryBook, page: StoryBookPage) {
  if (page.type === "cover") return `Couverture du livre ${book.title}`;
  return `Illustration du livre ${book.title}`;
}

export const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  ({ book, page, className, compact = false }, ref) => {
    const isCover = page.type === "cover";
    const isMoral = page.type === "moral";
    const isLocked = page.type === "locked";
    const isCta = page.type === "cta";
    const image = page.image ?? (isCover ? book.coverImage : undefined);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-full w-full overflow-hidden bg-[#fffaf0] text-[#070b2d]",
          "shadow-[inset_0_0_0_1px_rgba(7,11,45,0.08)]",
          className,
        )}
      >
        <div className="absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(7,11,45,0.10),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(124,92,255,0.10),transparent_28%)]" />

        <div className={cn("relative flex h-full flex-col p-5", compact ? "p-4" : "sm:p-6")}>
          {isCover ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              {image && (
                <div className="relative mb-4 w-[62%] max-w-[220px]">
                  <div className="absolute -bottom-4 left-5 right-4 h-8 rounded-[50%] bg-slate-950/20 blur-xl" />
                  <Image
                    src={image}
                    alt={getImageAlt(book, page)}
                    sizes="(min-width: 768px) 260px, 70vw"
                    className="relative h-auto w-full drop-shadow-[14px_20px_34px_rgba(15,23,42,0.24)]"
                  />
                </div>
              )}
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6b55ef]">
                {book.theme}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.055em]">
                {book.title}
              </h3>
              <p className="mt-2 text-sm font-bold text-[#626b89]">
                {book.childName}
                {book.age ? `, ${book.age}` : ""}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8a91a6]">
                  {isMoral ? "Morale" : isCta ? "À toi" : isLocked ? "Suite" : `Page ${page.pageNumber}`}
                </p>
                <Sparkles className="h-4 w-4 text-[#6b55ef]" />
              </div>

              {image && !compact && (
                <div className="relative mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
                  <Image
                    src={image}
                    alt={getImageAlt(book, page)}
                    sizes="(min-width: 768px) 320px, 84vw"
                    className="h-auto w-full"
                  />
                </div>
              )}

              {page.imagePrompt && !image && (
                <div className="mt-4 grid min-h-[128px] place-items-center rounded-2xl bg-[linear-gradient(145deg,#f4f0ff,#fffaf0)] p-4 text-center ring-1 ring-[#ebe8ff]">
                  <p className="font-editorial text-xl font-semibold italic leading-snug text-[#6b55ef]">
                    Illustration douce en préparation
                  </p>
                </div>
              )}

              <div className={cn("mt-5", isCta && "mt-auto text-center")}>
                {page.title && (
                  <h3
                    className={cn(
                      "text-xl font-extrabold leading-tight tracking-[-0.04em] text-[#070b2d]",
                      isMoral && "font-editorial text-3xl font-semibold italic tracking-normal text-[#6b55ef]",
                      isCta && "text-2xl",
                    )}
                  >
                    {page.title}
                  </h3>
                )}
                {page.text && (
                  <p
                    className={cn(
                      "mt-3 text-[15px] font-semibold leading-7 text-[#4c5578]",
                      compact && "text-sm leading-6",
                      isMoral && "text-lg leading-8 text-[#303856]",
                    )}
                  >
                    {page.text}
                  </p>
                )}
              </div>

              {isMoral && (
                <div className="mt-auto flex justify-center pb-2">
                  <Heart className="h-7 w-7 fill-[#ff7aa2] text-[#ff7aa2]" />
                </div>
              )}

              {isLocked && (
                <div className="mt-auto rounded-2xl border border-[#e8eaf3] bg-white/80 p-4 text-center">
                  <LockKeyhole className="mx-auto h-5 w-5 text-[#6b55ef]" />
                  <p className="mt-2 text-sm font-extrabold">Débloque le livre complet</p>
                </div>
              )}

              {isCta && (
                <Link
                  href="/create-story"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ff6257] px-5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(255,98,87,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f2554a]"
                >
                  Créer mon aperçu gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

BookPage.displayName = "BookPage";
