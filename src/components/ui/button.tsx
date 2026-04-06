"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue-linen/45",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-bordeaux text-rose-white shadow-[0_18px_50px_-24px_rgba(72,33,34,0.55)] hover:bg-night",
        light:
          "bg-rose-white text-night shadow-[0_20px_54px_-28px_rgba(250,235,230,0.48)] hover:bg-pure-white",
        outline:
          "border border-night/12 bg-pure-white/70 text-night hover:bg-rose-white",
        ghost: "text-night/70 hover:bg-night/5 hover:text-night",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
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
