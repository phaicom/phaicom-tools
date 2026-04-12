"use client";
import type {
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabProps,
  TabsProps,
} from "react-aria-components";

import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanels as RACTabPanels,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  SelectionIndicator,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/utils/cn";
import { focusRing } from "@/shared/utils/react-aria";

const tabsStyles = tv({
  base: "flex max-w-full gap-4 font-sans",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row",
    },
  },
});

export function Tabs(props: TabsProps) {
  return (
    <RACTabs
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabsStyles({ ...renderProps, className }),
      )}
    />
  );
}

const tabListStyles = tv({
  base: "-m-1 flex max-w-full overflow-x-auto overflow-y-clip p-1 [scrollbar-width:none]",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
});

export function TabList<T extends object>(props: TabListProps<T>) {
  return (
    <RACTabList
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabListStyles({ ...renderProps, className }),
      )}
    />
  );
}

const tabProps = tv({
  extend: focusRing,
  base: "group relative flex cursor-default items-center rounded-full px-3 py-1.5 text-sm font-medium transition forced-color-adjust-none [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      true: "text-neutral-200 dark:text-neutral-600 forced-colors:text-[GrayText] selected:bg-neutral-200 selected:text-white dark:selected:bg-neutral-600 dark:selected:text-neutral-500 forced-colors:selected:bg-[GrayText] forced-colors:selected:text-[HighlightText]",
    },
  },
});

export function Tab(props: TabProps) {
  return (
    <RACTab
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabProps({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <SelectionIndicator className="absolute top-0 left-0 z-10 h-full w-full rounded-full bg-white mix-blend-difference group-disabled:-z-1 group-disabled:bg-neutral-400 group-disabled:mix-blend-normal motion-safe:transition-[translate,width,height] group-disabled:dark:bg-neutral-600" />
        </>
      ))}
    </RACTab>
  );
}

export function TabPanels<T extends object>(props: TabPanelsProps<T>) {
  return (
    <RACTabPanels
      {...props}
      className={cn(
        "relative h-(--tab-panel-height) overflow-clip motion-safe:transition-[height]",
        props.className,
      )}
    />
  );
}

const tabPanelStyles = tv({
  extend: focusRing,
  base: "box-border flex-1 p-4 text-sm text-neutral-900 transition dark:text-neutral-100 entering:opacity-0 exiting:absolute exiting:top-0 exiting:left-0 exiting:w-full exiting:opacity-0",
});

export function TabPanel(props: TabPanelProps) {
  return (
    <RACTabPanel
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tabPanelStyles({ ...renderProps, className }),
      )}
    />
  );
}
