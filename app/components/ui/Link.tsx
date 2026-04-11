"use client";
import type { LinkProps as AriaLinkProps } from "react-aria-components";

import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

import { focusRing } from "@/lib/react-aria-utils";

interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary";
}

const styles = tv({
  extend: focusRing,
  base: "rounded-xs underline transition [-webkit-tap-highlight-color:transparent] disabled:cursor-default disabled:no-underline forced-colors:disabled:text-[GrayText]",
  variants: {
    variant: {
      primary:
        "text-blue-600 underline decoration-blue-600/60 hover:decoration-blue-600 dark:text-blue-500 dark:decoration-blue-500/60 dark:hover:decoration-blue-500",
      secondary:
        "text-neutral-700 underline decoration-neutral-700/50 hover:decoration-neutral-700 dark:text-neutral-300 dark:decoration-neutral-300/70 dark:hover:decoration-neutral-300",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant }),
      )}
    />
  );
}
