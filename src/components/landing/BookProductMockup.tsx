import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { LandingBookExample } from "@/data/landing-examples";
import bookOpenStructured from "@/assets/cleaned/book-open-structured-clean.png";

type Size = "hero" | "card" | "modal" | "demo";

const sizeClasses: Record<Size, string> = {
  hero: "max-w-[310px]",
  card: "max-w-[220px]",
  modal: "max-w-[360px]",
  demo: "max-w-[170px]",
};

export function PremiumBookCover({
  book,
  size = "card",
  className,
  priority = false,
}: {
  book: LandingBookExample;
  size?: Size;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        sizeClasses[size],
        className,
      )}
      style={
        {
          "--book-cover": book.palette.cover,
          "--book-accent": book.palette.accent,
          "--book-paper": book.palette.paper,
          "--book-wash": book.palette.wash,
        } as CSSProperties
      }
    >
      <div className="absolute -bottom-7 left-6 right-3 h-12 rounded-[50%] bg-slate-950/18 blur-xl" />
      <Image
        src={book.image}
        alt={`Couverture du livre ${book.title}`}
        priority={priority}
        sizes="(min-width: 1024px) 360px, 72vw"
        className="relative h-auto w-full drop-shadow-[18px_24px_42px_rgba(15,23,42,0.24)]"
      />
    </div>
  );
}

export function PremiumBookSpread({
  book,
  className,
  compact = false,
}: {
  book: LandingBookExample;
  className?: string;
  compact?: boolean;
}) {
  const [left, right] = book.pages;

  return (
    <div
      className={cn("relative", className)}
      style={
        {
          "--book-paper": book.palette.paper,
          "--book-wash": book.palette.wash,
          "--book-accent": book.palette.accent,
        } as CSSProperties
      }
    >
      <div className="absolute -bottom-8 left-8 right-8 h-12 rounded-[50%] bg-slate-950/14 blur-xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-slate-950/[0.08] bg-white shadow-[0_18px_52px_rgba(15,23,42,0.1)]">
        <Image
          src={bookOpenStructured}
          alt="Mini-livre ouvert avec pages illustrées"
          sizes="(min-width: 1024px) 560px, 92vw"
          className="h-auto w-full"
        />
        {!compact && (
          <div className="grid gap-3 border-t border-slate-950/[0.07] bg-white/90 p-4 md:grid-cols-2">
            <p className="text-sm font-semibold leading-6 text-slate-600">{left?.text}</p>
            <p className="text-sm font-semibold leading-6 text-slate-600">{right?.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KeepsakeStrip({ book }: { book: LandingBookExample }) {
  return (
    <div
      className="rounded-[22px] border border-slate-950/[0.07] bg-white/76 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
      style={
        {
          "--book-accent": book.palette.accent,
        } as CSSProperties
      }
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
        Souvenir
      </p>
      <p className="mt-2 font-editorial text-xl font-semibold leading-snug tracking-[-0.03em] text-slate-950">
        {book.keepsake}
      </p>
      <div className="mt-4 h-1 w-16 rounded-full bg-[var(--book-accent)]" />
    </div>
  );
}
