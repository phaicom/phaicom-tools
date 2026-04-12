"use client";
import type { ReactNode } from "react";
import type { TreeItemProps as AriaTreeItemProps, TreeProps } from "react-aria-components";

import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  Button,
} from "react-aria-components";
import { LuChevronRight } from "react-icons/lu";
import { tv } from "tailwind-variants";

import { Checkbox } from "@/shared/components/ui/Checkbox";
import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex gap-3 border-t border-transparent px-3 py-1 font-sans text-sm -outline-offset-2 select-none first:rounded-t-lg first:border-t-0 last:rounded-b-lg",
  variants: {
    isSelected: {
      false:
        "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 pressed:bg-neutral-100 dark:pressed:bg-neutral-800",
      true: "z-20 border-y-blue-200 bg-blue-100 hover:bg-blue-200 dark:border-y-blue-900 dark:bg-blue-700/30 dark:hover:bg-blue-700/40 pressed:bg-blue-200 dark:pressed:bg-blue-700/40",
    },
    isDisabled: {
      true: "z-10 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export function Tree<T extends object>({ children, ...props }: TreeProps<T>) {
  return (
    <AriaTree
      {...props}
      className={composeTailwindRenderProps(props.className, "relative max-w-full overflow-auto")}
    >
      {children}
    </AriaTree>
  );
}

const expandButton = tv({
  extend: focusRing,
  base: "flex h-8 w-8 shrink-0 cursor-default items-center justify-center rounded-lg border-0 bg-transparent p-0 text-start [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

const chevron = tv({
  base: "h-4.5 w-4.5 text-neutral-500 transition-transform duration-200 ease-in-out dark:text-neutral-400",
  variants: {
    isExpanded: {
      true: "rotate-90 transform",
    },
    isDisabled: {
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  content?: ReactNode;
  title: string;
}

export function TreeItem(props: TreeItemProps) {
  const { children, content, ...itemProps } = props;

  return (
    <AriaTreeItem className={itemStyles} textValue={props.title} {...itemProps}>
      <AriaTreeItemContent>
        {({ selectionMode, selectionBehavior, hasChildItems, isExpanded, isDisabled }) => (
          <div className="flex items-center">
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            <div className="w-[calc(calc(var(--tree-item-level)-1)*--spacing(3))] shrink-0" />
            {hasChildItems ? (
              <Button slot="chevron" className={expandButton({ isDisabled })}>
                <LuChevronRight aria-hidden className={chevron({ isExpanded, isDisabled })} />
              </Button>
            ) : (
              <div className="h-8 w-8 shrink-0" />
            )}
            {content ?? props.title}
          </div>
        )}
      </AriaTreeItemContent>
      {children}
    </AriaTreeItem>
  );
}
