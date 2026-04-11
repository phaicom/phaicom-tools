"use client";
import type { SliderProps as AriaSliderProps } from "react-aria-components";

import {
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Label } from "@/components/ui/Field";
import { composeTailwindRenderProps, focusRing } from "@/lib/react-aria-utils";

const trackStyles = tv({
  base: "rounded-full",
  variants: {
    orientation: {
      horizontal: "h-1.5 w-full",
      vertical: "ml-[50%] h-full w-1.5 -translate-x-[50%]",
    },
    isDisabled: {
      false: "bg-neutral-300 dark:bg-neutral-700 forced-colors:bg-[ButtonBorder]",
      true: "bg-neutral-200 dark:bg-neutral-800 forced-colors:bg-[ButtonBorder]",
    },
  },
});

const fillStyles = tv({
  base: "absolute rounded-full",
  variants: {
    orientation: {
      horizontal: "inset-s-(--start,0) h-1.5 w-(--size)",
      vertical: "bottom-(--start,0) ml-[50%] h-(--size) w-1.5 -translate-x-[50%]",
    },
    isDisabled: {
      false: "bg-blue-500 forced-colors:bg-[Highlight]",
      true: "bg-neutral-300 dark:bg-neutral-600 forced-colors:bg-[GrayText]",
    },
  },
});

const thumbStyles = tv({
  extend: focusRing,
  base: "h-4.5 w-4.5 rounded-full border border-neutral-700 bg-neutral-50 group-orientation-horizontal:mt-5 group-orientation-vertical:ml-2.5 dark:border-neutral-300 dark:bg-neutral-900",
  variants: {
    isDragging: {
      true: "bg-neutral-700 dark:bg-neutral-300 forced-colors:bg-[ButtonBorder]",
    },
    isDisabled: {
      true: "border-neutral-300 dark:border-neutral-700 forced-colors:border-[GrayText]",
    },
  },
});

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  return (
    <AriaSlider
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "font-sans orientation-horizontal:grid orientation-vertical:flex grid-cols-[1fr_auto] flex-col items-center gap-2 orientation-horizontal:w-64 orientation-horizontal:max-w-[calc(100%-10px)]",
      )}
    >
      <Label>{label}</Label>
      <SliderOutput className="text-sm text-neutral-500 dark:text-neutral-400 orientation-vertical:hidden">
        {({ state }) => state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")}
      </SliderOutput>
      <SliderTrack className="group col-span-2 flex items-center orientation-horizontal:h-5 orientation-vertical:h-38 orientation-vertical:w-5">
        {({ state, ...renderProps }) => (
          <>
            <div className={trackStyles(renderProps)} />
            {state.values.length === 1 ? (
              // Single thumb, render fill from the end
              <div
                className={fillStyles(renderProps)}
                style={{ "--size": state.getThumbPercent(0) * 100 + "%" } as any}
              />
            ) : state.values.length === 2 ? (
              // Range slider, render fill between the thumbs
              <div
                className={fillStyles(renderProps)}
                style={
                  {
                    "--start": state.getThumbPercent(0) * 100 + "%",
                    "--size": (state.getThumbPercent(1) - state.getThumbPercent(0)) * 100 + "%",
                  } as any
                }
              />
            ) : null}
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className={thumbStyles}
              />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
