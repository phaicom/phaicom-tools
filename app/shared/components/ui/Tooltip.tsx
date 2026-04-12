"use client";
import type { TooltipProps as AriaTooltipProps } from "react-aria-components";

import React from "react";
import { Tooltip as AriaTooltip, OverlayArrow, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: React.ReactNode;
}

const styles = tv({
  base: "group box-border rounded-lg border border-neutral-800 bg-neutral-700 px-3 py-1.5 font-sans text-xs text-white drop-shadow-lg will-change-transform dark:border-white/10 dark:bg-neutral-600",
  variants: {
    isEntering: {
      true: "animate-in duration-200 ease-out fade-in placement-left:slide-in-from-right-0.5 placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
    },
    isExiting: {
      true: "animate-out duration-150 ease-in fade-out placement-left:slide-out-to-right-0.5 placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
    },
  },
});

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={10}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className="block fill-neutral-700 stroke-neutral-800 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180 dark:fill-neutral-600 dark:stroke-white/10 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}
