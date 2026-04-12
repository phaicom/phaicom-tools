"use client";
import type {
  DisclosureProps as AriaDisclosureProps,
  DisclosurePanelProps as AriaDisclosurePanelProps,
} from "react-aria-components";

import React, { useContext } from "react";
import {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  composeRenderProps,
  Heading,
  DisclosureStateContext,
} from "react-aria-components";
import { LuChevronRight } from "react-icons/lu";
import { tv } from "tailwind-variants";

import { Button } from "@/shared/components/ui/Button";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

const disclosure = tv({
  base: "group min-w-50 rounded-lg font-sans text-neutral-900 dark:text-neutral-200",
});

const chevron = tv({
  base: "h-4 w-4 text-neutral-500 transition-transform duration-200 ease-in-out dark:text-neutral-400",
  variants: {
    isExpanded: {
      true: "rotate-90 transform",
    },
    isDisabled: {
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export interface DisclosureProps extends AriaDisclosureProps {
  children: React.ReactNode;
}

export function Disclosure({ children, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        disclosure({ ...renderProps, className }),
      )}
    >
      {children}
    </AriaDisclosure>
  );
}

export interface DisclosureHeaderProps {
  children: React.ReactNode;
}

export function DisclosureHeader({ children }: DisclosureHeaderProps) {
  let { isExpanded } = useContext(DisclosureStateContext)!;
  return (
    <Heading className="m-0 text-lg font-semibold">
      <Button slot="trigger" variant="quiet" className="w-full justify-start font-medium">
        {({ isDisabled }) => (
          <>
            <LuChevronRight aria-hidden className={chevron({ isExpanded, isDisabled })} />
            <span>{children}</span>
          </>
        )}
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps extends AriaDisclosurePanelProps {
  children: React.ReactNode;
}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "h-(--disclosure-panel-height) motion-safe:transition-[height] overflow-clip",
      )}
    >
      <div className="px-4 py-2">{children}</div>
    </AriaDisclosurePanel>
  );
}
