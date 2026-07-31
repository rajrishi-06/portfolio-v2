import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // A datasheet control: square (2px so it reads as interactive), 1px rule,
  // mono uppercase label. active:scale-[0.98] is the whole press interaction —
  // the control yields under the pointer and returns. No lift, no shadow.
  // Focus is the global :focus-visible rule in index.css; nothing here.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border font-mono text-xs font-medium uppercase tracking-[0.08em] transition-all duration-150 active:scale-[0.98] motion-reduce:active:scale-100 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-ink bg-ink text-bg hover:border-accent hover:bg-accent",
        outline: "border-overlay/[0.28] text-ink hover:border-ink",
        // Transparent rule keeps ghost the same height as the other two.
        ghost: "border-transparent text-muted hover:bg-surface hover:text-ink",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-7 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
