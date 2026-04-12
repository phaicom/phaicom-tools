"use client";
import type { SwitchProps as AriaSwitchProps } from "react-aria-components";

import React from "react";
import { Switch as AriaSwitch } from "react-aria-components";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

export interface SwitchProps extends Omit<AriaSwitchProps, "children"> {
  children: React.ReactNode;
}

const track = tv({
  extend: focusRing,
  base: "box-border flex h-5 w-9 shrink-0 cursor-default items-center rounded-full border border-transparent px-px font-sans shadow-inner transition duration-200 ease-in-out",
  variants: {
    isSelected: {
      false:
        "border-neutral-400 bg-neutral-100 group-pressed:bg-neutral-200 dark:border-neutral-400 dark:bg-neutral-800 dark:group-pressed:bg-neutral-700",
      true: "bg-neutral-700 group-pressed:bg-neutral-800 dark:bg-neutral-300 dark:group-pressed:bg-neutral-200 forced-colors:bg-[Highlight]!",
    },
    isDisabled: {
      true: "border-neutral-300 bg-neutral-100 group-selected:bg-neutral-300 dark:border-neutral-900 dark:bg-neutral-800 dark:group-selected:bg-neutral-800 forced-colors:border-[GrayText] forced-colors:group-selected:bg-[GrayText]!",
    },
  },
});

const handle = tv({
  base: "h-4 w-4 transform rounded-full shadow-xs outline-1 -outline-offset-1 outline-transparent transition duration-200 ease-in-out",
  variants: {
    isSelected: {
      false: "translate-x-0 bg-neutral-900 dark:bg-neutral-300",
      true: "translate-x-full bg-white dark:bg-neutral-900",
    },
    isDisabled: {
      true: "forced-colors:outline-[GrayText]",
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      isDisabled: true,
      class: "bg-neutral-300 dark:bg-neutral-700",
    },
    {
      isSelected: true,
      isDisabled: true,
      class: "bg-neutral-50 dark:bg-neutral-700",
    },
  ],
});

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group relative flex gap-2 items-center text-neutral-800 disabled:text-neutral-300 dark:text-neutral-200 dark:disabled:text-neutral-600 forced-colors:disabled:text-[GrayText] text-sm transition [-webkit-tap-highlight-color:transparent]",
      )}
    >
      {(renderProps) => (
        <>
          <div className={track(renderProps)}>
            <span className={handle(renderProps)} />
          </div>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
