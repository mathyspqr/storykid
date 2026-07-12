import * as React from "react";
import { cn } from "@/shared/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-ink/10 bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink/75",
        className,
      )}
      {...props}
    />
  );
}
