"use client";
import type {
  ListBoxProps as AriaListBoxProps,
  SectionProps,
  ListBoxItemProps,
} from "react-aria-components";

import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Collection,
  Header,
  ListBoxSection,
  composeRenderProps,
} from "react-aria-components";
import { LuCheck } from "react-icons/lu";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

interface ListBoxProps<T> extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({ children, ...props }: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "outline-0 p-1 w-50 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm font-sans",
      )}
    >
      {children}
    </AriaListBox>
  );
}

export const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex cursor-default items-center gap-8 rounded-xs px-2.5 py-1.5 text-sm will-change-transform forced-color-adjust-none select-none",
  variants: {
    isSelected: {
      false:
        "text-neutral-700 -outline-offset-2 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 pressed:bg-neutral-100 dark:pressed:bg-neutral-800",
      true: "bg-blue-600 text-white -outline-offset-4 outline-white dark:outline-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:outline-[HighlightText] [&+[data-selected]]:rounded-t-none [&:has(+[data-selected])]:rounded-b-none",
    },
    isDisabled: {
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export function ListBoxItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue || (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute right-4 bottom-0 left-4 hidden h-px bg-white/20 forced-colors:bg-[HighlightText] [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </AriaListBoxItem>
  );
}

export const dropdownItemStyles = tv({
  base: "group flex cursor-default items-center gap-4 rounded-sm py-2 pr-3 pl-3 text-sm no-underline outline-0 forced-color-adjust-none select-none [-webkit-tap-highlight-color:transparent] selected:pr-1 [[href]]:cursor-pointer",
  variants: {
    isDisabled: {
      false: "text-neutral-900 dark:text-neutral-100",
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
    isPressed: {
      true: "bg-neutral-100 dark:bg-neutral-800",
    },
    isFocused: {
      true: "bg-blue-600 text-white dark:bg-blue-600 forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
  compoundVariants: [
    {
      isFocused: false,
      isOpen: true,
      className: "bg-neutral-100 dark:bg-neutral-700/60",
    },
  ],
});

export function DropdownItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue || (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={dropdownItemStyles}>
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-semibold">
            {children}
          </span>
          <span className="flex w-5 items-center">
            {isSelected && <LuCheck className="h-4 w-4" />}
          </span>
        </>
      ))}
    </AriaListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
  items?: any;
}

export function DropdownSection<T extends object>(props: DropdownSectionProps<T>) {
  return (
    <ListBoxSection className="after:block after:h-1.25 after:content-[''] first:-mt-1.25 last:after:hidden">
      <Header className="sticky -top-1.25 z-10 -mx-1 -mt-px truncate border-y border-y-neutral-200 bg-neutral-100/60 px-4 py-1 text-sm font-semibold text-neutral-500 backdrop-blur-md supports-[-moz-appearance:none]:bg-neutral-100 dark:border-y-neutral-700 dark:bg-neutral-700/60 dark:text-neutral-300 [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  );
}
