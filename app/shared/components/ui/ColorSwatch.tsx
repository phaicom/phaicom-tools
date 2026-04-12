"use client";
import type { ColorSwatchProps } from "react-aria-components";

import { ColorSwatch as AriaColorSwatch } from "react-aria-components";

import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    <AriaColorSwatch
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "w-8 h-8 box-border rounded-md border border-black/10",
      )}
      style={({ color }) => ({
        background: `linear-gradient(${color.toString()}, ${color.toString()}),
          repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      })}
    />
  );
}
