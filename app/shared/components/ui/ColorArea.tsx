"use client";
import type { ColorAreaProps as AriaColorAreaProps } from "react-aria-components";

import { ColorArea as AriaColorArea } from "react-aria-components";

import { ColorThumb } from "@/shared/components/ui/ColorThumb";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export interface ColorAreaProps extends AriaColorAreaProps {}

export function ColorArea(props: ColorAreaProps) {
  return (
    <AriaColorArea
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "w-full max-w-56 aspect-square rounded-sm bg-neutral-300 dark:bg-neutral-800 forced-colors:bg-[GrayText]",
      )}
      style={({ defaultStyle, isDisabled }) => ({
        ...defaultStyle,
        background: isDisabled ? undefined : defaultStyle.background,
      })}
    >
      <ColorThumb />
    </AriaColorArea>
  );
}
