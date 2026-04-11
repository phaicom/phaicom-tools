"use client";

import { Tab, TabList, TabPanel, Tabs, type TabsProps } from "react-aria-components";

import { cn } from "@/lib/utils";

export type ConverterMode = "gradient-bg" | "gradient-text";

type ModeOption = {
  id: ConverterMode;
  label: string;
};

const modeOptions: ModeOption[] = [
  { id: "gradient-bg", label: "Background" },
  { id: "gradient-text", label: "Text" },
];

type ConverterModeTabsProps = {
  mode: ConverterMode;
  onChange: (mode: ConverterMode) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function ConverterModeTabs({ mode, onChange, actions, children }: ConverterModeTabsProps) {
  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(key) => onChange(key as ConverterMode)}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <TabList
          aria-label="Converter mode"
          className="flex w-full items-center gap-2 rounded-2xl bg-secondary p-1.5 md:max-w-140"
        >
          {modeOptions.map((option) => (
            <ModeTab key={option.id} id={option.id} label={option.label} />
          ))}
        </TabList>

        {actions ? <div className="w-full md:w-auto md:shrink-0 md:pt-2">{actions}</div> : null}
      </div>

      {modeOptions.map((option) => (
        <TabPanel key={option.id} id={option.id} className="outline-hidden">
          {children}
        </TabPanel>
      ))}
    </Tabs>
  );
}

function ModeTab({ id, label }: { id: TabsProps["selectedKey"]; label: string }) {
  return (
    <Tab
      id={id}
      className={({ isFocusVisible, isHovered, isPressed, isSelected }) =>
        cn(
          "flex w-full flex-1 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-center transition outline-none select-none",
          isSelected
            ? "bg-background text-foreground shadow-[0_(15,23,42,01px_2px_rgba.06),0_6px_16px_rgba(15,23,42,0.06)]"
            : "bg-transparent text-muted-foreground",
          !isSelected && "mx-0.5",
          !isSelected && isHovered && "bg-muted/50 text-foreground",
          !isSelected && isPressed && "bg-muted/70 text-foreground",
          isFocusVisible && "ring-2 ring-ring ring-offset-2 ring-offset-background",
        )
      }
    >
      <span className="text-sm font-medium">{label}</span>
    </Tab>
  );
}
