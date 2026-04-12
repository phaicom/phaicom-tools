"use client";
import type { ColorThumbProps } from "react-aria-components";

import { ColorThumb as AriaColorThumb } from "react-aria-components";
import { tv } from "tailwind-variants";

const thumbStyles = tv({
  base: "top-[50%] left-[50%] box-border h-4.5 w-4.5 rounded-full border-2 border-white",
  variants: {
    isFocusVisible: {
      true: "h-8 w-8",
    },
    isDragging: {
      true: "bg-neutral-700 dark:bg-neutral-300 forced-colors:bg-[ButtonBorder]",
    },
    isDisabled: {
      true: "border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 forced-colors:border-[GrayText] forced-colors:bg-[GrayText]",
    },
  },
});

export function ColorThumb(props: ColorThumbProps) {
  return (
    <AriaColorThumb
      {...props}
      style={({ defaultStyle, isDisabled }) => ({
        ...defaultStyle,
        backgroundColor: isDisabled ? undefined : defaultStyle.backgroundColor,
        boxShadow: "0 0 0 1px black",
      })}
      className={thumbStyles}
    />
  );
}
