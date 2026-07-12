import * as React from "react";
import { cn } from "@/shared/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-base text-ink shadow-sm outline-none transition focus:border-ink/35 focus:ring-4 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
