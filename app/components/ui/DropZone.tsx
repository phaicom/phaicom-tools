"use client";
import type { DropZoneProps } from "react-aria-components";

import { composeRenderProps, DropZone as RACDropZone } from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZone = tv({
  base: "flex min-h-24 w-[30%] items-center justify-center rounded-lg border border-neutral-300 bg-white p-8 text-center font-sans text-base text-balance dark:border-neutral-800 dark:bg-neutral-900",
  variants: {
    isFocusVisible: {
      true: "outline-2 -outline-offset-1 outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight]",
    },
    isDropTarget: {
      true: "bg-blue-200 outline-2 -outline-offset-1 outline-blue-600 dark:bg-blue-800 dark:outline-blue-500 forced-colors:outline-[Highlight]",
    },
  },
});

export function DropZone(props: DropZoneProps) {
  return (
    <RACDropZone
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        dropZone({ ...renderProps, className }),
      )}
    />
  );
}
