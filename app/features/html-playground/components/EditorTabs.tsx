"use client";

import { cn } from "@/shared/utils/cn";

import type { PlaygroundLanguage } from "../types";

const tabs: { id: PlaygroundLanguage; label: string; shortLabel: string }[] = [
  { id: "html", label: "HTML", shortLabel: "HTML" },
  { id: "css", label: "CSS", shortLabel: "CSS" },
  { id: "javascript", label: "JavaScript", shortLabel: "JS" },
];

export function EditorTabs({
  activeTab,
  onChange,
}: {
  activeTab: PlaygroundLanguage;
  onChange: (tab: PlaygroundLanguage) => void;
}) {
  return (
    <div role="tablist" aria-label="Code language" className="flex min-w-0 items-stretch">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`playground-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-controls="playground-editor-panel"
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative min-h-11 min-w-16 border-r border-border px-3 text-sm font-medium text-muted-foreground transition outline-none hover:bg-accent/60 hover:text-foreground focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:min-w-24",
            activeTab === tab.id &&
              "bg-background text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary",
          )}
        >
          <span className="sm:hidden">{tab.shortLabel}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
