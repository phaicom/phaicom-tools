"use client";
import type { ToggleButtonProps } from "react-aria-components";

import { ToggleButton as RACToggleButton, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

import { focusRing } from "@/shared/utils/react-aria";

let styles = tv({
  extend: focusRing,
  base: "relative box-border inline-flex h-9 cursor-default items-center justify-center gap-2 rounded-lg border border-black/10 px-3.5 text-center font-sans text-sm transition forced-color-adjust-none [-webkit-tap-highlight-color:transparent] dark:border-white/10 [&:has(>svg:only-child)]:aspect-square [&:has(>svg:only-child)]:h-8 [&:has(>svg:only-child)]:px-0",
  variants: {
    isSelected: {
      false:
        "bg-neutral-50 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600 forced-colors:bg-[ButtonFace]! forced-colors:text-[ButtonText]! pressed:bg-neutral-200 dark:pressed:bg-neutral-500",
      true: "bg-neutral-700 text-white hover:bg-neutral-800 dark:bg-neutral-300 dark:text-black dark:hover:bg-neutral-200 forced-colors:bg-[Highlight]! forced-colors:text-[HighlightText]! pressed:bg-neutral-900 dark:pressed:bg-neutral-100",
    },
    isDisabled: {
      true: "border-transparent bg-neutral-100 text-neutral-300 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-600 forced-colors:bg-[ButtonFace]! forced-colors:text-[GrayText]!",
    },
  },
});

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <RACToggleButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    />
  );
}
