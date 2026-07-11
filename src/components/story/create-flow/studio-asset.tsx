"use client";

import type { CSSProperties } from "react";
import { getStudioAsset } from "@/components/story/create-flow/studio-system";

export function StudioAsset({ id, variant = "choice", className = "" }: { id: string; variant?: "choice" | "book" | "summary"; className?: string }) {
  const asset = getStudioAsset(id);
  if (!asset) return null;
  const scale = variant === "book" ? asset.bookScale : variant === "summary" ? .82 : asset.scale;
  return <span
    role="img"
    aria-label={asset.accessibleLabel}
    className={`studio-asset studio-asset-${variant} ${className}`}
    style={{ "--asset-url": `url(${asset.sprite})`, "--asset-position": asset.spritePosition, "--asset-scale": scale } as CSSProperties}
  />;
}
