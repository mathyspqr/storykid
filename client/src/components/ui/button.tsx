import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-white shadow-[0_14px_30px_rgba(23,32,51,0.16)] hover:-translate-y-0.5 hover:bg-[#0f1728]",
        secondary:
          "bg-white text-ink ring-1 ring-ink/10 shadow-sm hover:-translate-y-0.5 hover:bg-cream",
        ghost: "text-ink hover:bg-white/60",
        gold:
          "bg-gold text-ink shadow-[0_14px_30px_rgba(242,198,109,0.22)] hover:-translate-y-0.5 hover:bg-[#eabf63]",
        ink: "bg-ink text-white hover:bg-[#17213b]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
