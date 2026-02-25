import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] shadow-sm",
        outline:
          "border border-[var(--brand-700)] bg-white text-[var(--brand-700)] hover:bg-[var(--brand-50)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]",
        destructive: "bg-[var(--danger-500)] text-white hover:bg-[var(--danger-600)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
