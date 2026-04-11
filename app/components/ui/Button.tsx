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

const button = tv({
  extend: focusRing,
  base: "relative box-border inline-flex h-9 cursor-default items-center justify-center gap-2 rounded-lg border border-transparent px-3.5 py-0 text-center font-sans text-sm transition [-webkit-tap-highlight-color:transparent] dark:border-white/10 [&:has(>svg:only-child)]:h-8 [&:has(>svg:only-child)]:w-8 [&:has(>svg:only-child)]:px-0",
  variants: {
    variant: {
      primary: "bg-blue-600 text-white hover:bg-blue-700 pressed:bg-blue-800",
      secondary:
        "border-black/10 bg-neutral-50 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600 pressed:bg-neutral-200 dark:pressed:bg-neutral-500",
      destructive: "bg-red-700 text-white hover:bg-red-800 pressed:bg-red-900",
      quiet:
        "border-0 bg-transparent text-neutral-800 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-700 pressed:bg-neutral-300 dark:pressed:bg-neutral-600",
    },
    isDisabled: {
      true: "border-transparent bg-neutral-100 text-neutral-300 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
    isPending: {
      true: "text-transparent",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
  compoundVariants: [
    {
      variant: "quiet",
      isDisabled: true,
      class: "bg-transparent dark:bg-transparent",
    },
  ],
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className }),
      )}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {children}
          {isPending && (
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              {/** biome-ignore lint/a11y/noSvgWithoutTitle: spinner icon, title not needed */}
              <svg
                className="h-4 w-4 animate-spin text-white"
                viewBox="0 0 24 24"
                stroke={
                  props.variant === "secondary" || props.variant === "quiet"
                    ? "light-dark(black, white)"
                    : "white"
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
