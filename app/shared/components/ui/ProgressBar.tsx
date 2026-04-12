"use client";
import type { ProgressBarProps as AriaProgressBarProps } from "react-aria-components";

import { ProgressBar as AriaProgressBar } from "react-aria-components";

import { Label } from "@/shared/components/ui/Field";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export interface ProgressBarProps extends AriaProgressBarProps {
  label?: string;
}

export function ProgressBar({ label, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-2 font-sans w-64 max-w-full",
      )}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="flex justify-between gap-2">
            <Label>{label}</Label>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{valueText}</span>
          </div>
          <div className="relative h-2 max-w-full overflow-hidden rounded-full bg-neutral-300 outline-1 -outline-offset-1 outline-transparent dark:bg-neutral-700">
            <div
              className={`absolute top-0 h-full rounded-full bg-blue-500 forced-colors:bg-[Highlight] ${isIndeterminate ? "left-full animate-in duration-1000 ease-out repeat-infinite slide-in-from-left-[20rem]" : "left-0"}`}
              style={{ width: (isIndeterminate ? 40 : percentage) + "%" }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
