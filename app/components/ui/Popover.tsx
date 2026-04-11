"use client";
import type { PopoverProps as AriaPopoverProps } from "react-aria-components";

import React from "react";
import { OverlayArrow, Popover as AriaPopover, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
  showArrow?: boolean;
  children: React.ReactNode;
}

const styles = tv({
  base: "rounded-xl border border-black/10 bg-white bg-clip-padding font-sans text-neutral-700 shadow-2xl outline-0 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas]",
  variants: {
    isEntering: {
      true: "animate-in duration-200 ease-out fade-in placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 placement-top:slide-in-from-bottom-1 placement-bottom:slide-in-from-top-1",
    },
    isExiting: {
      true: "animate-out duration-150 ease-in fade-out placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 placement-top:slide-out-to-bottom-1 placement-bottom:slide-out-to-top-1",
    },
  },
});

export function Popover({ children, showArrow, className, ...props }: PopoverProps) {
  let offset = showArrow ? 12 : 8;
  return (
    <AriaPopover
      offset={offset}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    >
      {showArrow && (
        <OverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="block fill-white stroke-black/10 stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 dark:fill-[#1f1f21] dark:stroke-neutral-700 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      {children}
    </AriaPopover>
  );
}
