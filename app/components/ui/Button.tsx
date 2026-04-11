"use client";

import {
  composeRenderProps,
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { focusRing } from "@/lib/react-aria-utils";

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "destructive" | "quiet";
}

export const button = tv({
  extend: focusRing,
  base: "relative box-border inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-0 text-center font-sans text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,transform,opacity] duration-200 ease-out outline-none select-none [-webkit-tap-highlight-color:transparent] disabled:pointer-events-none pressed:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&:has(>svg:only-child)]:h-9 [&:has(>svg:only-child)]:w-9 [&:has(>svg:only-child)]:px-0",
  variants: {
    variant: {
      primary:
        "border-primary/35 bg-primary text-primary-foreground hover:border-primary/40 hover:bg-primary/90 pressed:bg-primary/80",

      secondary:
        "border-border bg-secondary text-secondary-foreground hover:border-primary/20 hover:bg-secondary/90 pressed:bg-secondary/80",

      destructive:
        "border-destructive/40 bg-destructive text-white hover:bg-destructive/90 pressed:bg-destructive/80",

      quiet:
        "border-transparent bg-transparent text-foreground/80 hover:bg-accent/60 hover:text-accent-foreground pressed:bg-accent",
    },

    isDisabled: {
      true: "border-transparent bg-muted text-muted-foreground/50 opacity-60 dark:bg-muted/80 dark:text-muted-foreground/40",
    },

    isPending: {
      true: "text-transparent opacity-70",
    },
  },

  compoundVariants: [
    {
      variant: "quiet",
      isDisabled: true,
      class: "bg-transparent dark:bg-transparent",
    },
    {
      variant: "primary",
      isDisabled: true,
      class: "border-primary/15 bg-primary/40 text-primary-foreground/60",
    },
    {
      variant: "secondary",
      isDisabled: true,
      class: "border-border/40 bg-secondary/50",
    },
    {
      variant: "destructive",
      isDisabled: true,
      class: "border-destructive/20 bg-destructive/40 text-white/60",
    },
  ],

  defaultVariants: {
    variant: "primary",
  },
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({
          ...renderProps,
          variant: props.variant,
          className,
        }),
      )}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {children}
          {isPending && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                stroke={
                  props.variant === "secondary" || props.variant === "quiet"
                    ? "var(--foreground)"
                    : "var(--primary-foreground)"
                }
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4" fill="none" className="opacity-25" />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="100"
                  strokeDasharray="60 140"
                  strokeDashoffset="0"
                />
              </svg>
            </span>
          )}
        </>
      ))}
    </RACButton>
  );
}
