"use client";
import type {
  MenuProps,
  MenuItemProps,
  MenuSectionProps as AriaMenuSectionProps,
  SeparatorProps,
  SubmenuTriggerProps,
  MenuTriggerProps as AriaMenuTriggerProps,
} from "react-aria-components";

import React from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  Separator,
  composeRenderProps,
  Header,
  Collection,
} from "react-aria-components";
import { LuCheck, LuChevronRight } from "react-icons/lu";

import type { PopoverProps } from "@/components/ui/Popover";

import { dropdownItemStyles } from "@/components/ui/ListBox";
import { Popover } from "@/components/ui/Popover";

export function Menu<T extends object>(props: MenuProps<T>) {
  return (
    <AriaMenu
      {...props}
      className="max-h-[inherit] overflow-auto p-1 font-sans outline-0 [clip-path:inset(0_0_0_0_round_.75rem)] empty:pb-2 empty:text-center"
    />
  );
}

export function MenuItem(props: MenuItemProps) {
  let textValue =
    props.textValue || (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaMenuItem textValue={textValue} {...props} className={dropdownItemStyles}>
      {composeRenderProps(props.children, (children, { selectionMode, isSelected, hasSubmenu }) => (
        <>
          {selectionMode !== "none" && (
            <span className="flex w-4 items-center">
              {isSelected && <LuCheck aria-hidden className="h-4 w-4" />}
            </span>
          )}
          <span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-semibold">
            {children}
          </span>
          {hasSubmenu && <LuChevronRight aria-hidden className="absolute right-2 h-4 w-4" />}
        </>
      ))}
    </AriaMenuItem>
  );
}

export function MenuSeparator(props: SeparatorProps) {
  return (
    <Separator
      {...props}
      className="mx-3 my-1 border-b border-neutral-300 dark:border-neutral-700"
    />
  );
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  title?: string;
  items?: any;
}

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  return (
    <AriaMenuSection
      {...props}
      className="after:block after:h-1.25 after:content-[''] first:-mt-1.25"
    >
      {props.title && (
        <Header className="sticky -top-1.25 z-10 -mx-1 -mt-px truncate border-y border-y-neutral-200 bg-neutral-100/60 px-4 py-1 text-sm font-semibold text-neutral-500 backdrop-blur-md supports-[-moz-appearance:none]:bg-neutral-100 dark:border-y-neutral-700 dark:bg-neutral-700/60 dark:text-neutral-300 [&+*]:mt-1">
          {props.title}
        </Header>
      )}
      <Collection items={props.items}>{props.children}</Collection>
    </AriaMenuSection>
  );
}

interface MenuTriggerProps extends AriaMenuTriggerProps {
  placement?: PopoverProps["placement"];
}

export function MenuTrigger(props: MenuTriggerProps) {
  let [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaMenuTrigger {...props}>
      {trigger}
      <Popover placement={props.placement} className="min-w-37.5">
        {menu}
      </Popover>
    </AriaMenuTrigger>
  );
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  let [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover offset={-2} crossOffset={-4}>
        {menu}
      </Popover>
    </AriaSubmenuTrigger>
  );
}
