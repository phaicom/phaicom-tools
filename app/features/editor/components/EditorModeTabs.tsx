"use client";

import { Tab, TabList, Tabs } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

export type EditorMode = "rich-text" | "html";

const modeOptions: Array<{ id: EditorMode; label: string }> = [
  { id: "rich-text", label: "Rich Text" },
  { id: "html", label: "HTML" },
];

type EditorModeTabsProps = {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

export function EditorModeTabs({ mode, onChange }: EditorModeTabsProps) {
  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(key) => onChange(key as EditorMode)}
      className="w-full md:w-auto"
    >
      <TabList
        aria-label="Editor mode"
        className="flex w-full items-center gap-2 rounded-sm border border-border/70 bg-secondary p-1 md:w-auto"
      >
        {modeOptions.map((option) => (
          <Tab
            key={option.id}
            id={option.id}
            className={({ isFocusVisible, isHovered, isPressed, isSelected }) =>
              cn(
                "flex flex-1 cursor-pointer items-center justify-center rounded-sm px-4 py-2.5 text-center transition outline-none select-none md:flex-none",
                isSelected ? "bg-background text-foreground shadow-xs" : "text-muted-foreground",
                !isSelected && isHovered && "bg-muted/50 text-foreground",
                !isSelected && isPressed && "bg-muted/70 text-foreground",
                isFocusVisible && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )
            }
          >
            <span className="text-sm font-medium">{option.label}</span>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
