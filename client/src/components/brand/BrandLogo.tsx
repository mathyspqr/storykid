import Image from "next/image";
import Link from "next/link";
import logoCrystal from "@/assets/cleaned/logo-crystal-clean.png";
import { cn } from "@/shared/utils";

export function BrandLogo({
  className,
  href = "/",
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="StoryKid"
      className={cn(
        "group inline-flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b4a] focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="relative h-10 w-10 transition-transform duration-200 group-hover:-translate-y-0.5" style={{ position: "relative" }}>
        <Image
          src={logoCrystal}
          alt=""
          fill
          sizes="40px"
          className="object-contain drop-shadow-[0_10px_18px_rgba(108,92,255,0.24)]"
        />
      </span>
      {!compact && (
        <span className="text-[1.45rem] font-extrabold tracking-[-0.045em] text-[#070b2d]">
          StoryKid
        </span>
      )}
    </Link>
  );
}
