"use client";
import type { HTMLAttributes } from "react";
import type { GridListItemProps, GridListProps } from "react-aria-components";

import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  GridListHeader as AriaGridListHeader,
  Button,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Checkbox } from "@/shared/components/ui/Checkbox";
import { cn } from "@/shared/utils/cn";
import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

export function GridList<T extends object>({ children, ...props }: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "overflow-auto w-50 relative bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-sans empty:flex empty:items-center empty:justify-center empty:italic empty:text-sm",
      )}
    >
      {children}
    </AriaGridList>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "relative flex cursor-default gap-3 border-t border-transparent px-3 py-2 text-sm text-neutral-900 -outline-offset-2 select-none first:rounded-t-lg first:border-t-0 last:mb-0 last:rounded-b-lg dark:border-t-neutral-700 dark:text-neutral-200",
  variants: {
    isSelected: {
      false:
        "hover:bg-neutral-100 dark:hover:bg-neutral-700/60 pressed:bg-neutral-100 dark:pressed:bg-neutral-700/60",
      true: "z-20 border-y-blue-200 bg-blue-100 hover:bg-blue-200 dark:border-y-blue-900 dark:bg-blue-700/30 dark:hover:bg-blue-700/40 pressed:bg-blue-200 dark:pressed:bg-blue-700/40",
    },
    isDisabled: {
      true: "z-10 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export function GridListItem({ children, ...props }: GridListItemProps) {
  let textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaGridListItem textValue={textValue} {...props} className={itemStyles}>
      {composeRenderProps(
        children,
        (children, { selectionMode, selectionBehavior, allowsDragging }) => (
          <>
            {/* Add elements for drag and drop and selection. */}
            {allowsDragging && <Button slot="drag">≡</Button>}
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            {children}
          </>
        ),
      )}
    </AriaGridListItem>
  );
}

export function GridListHeader({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <AriaGridListHeader
      {...props}
      className={cn(
        "z-10 -mt-px border-y border-y-neutral-200 bg-neutral-100/60 px-4 py-1 text-sm font-semibold text-neutral-500 backdrop-blur-md supports-[-moz-appearance:none]:bg-neutral-100 dark:border-y-neutral-700 dark:bg-neutral-700/60 dark:text-neutral-300",
        props.className,
      )}
    >
      {children}
    </AriaGridListHeader>
  );
}
