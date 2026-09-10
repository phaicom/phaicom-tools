"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";

import { useRef, useState } from "react";

import { cn } from "@/shared/utils/cn";

import type {
  ConsoleEntry,
  EditorTheme,
  PlaygroundCode,
  PlaygroundLanguage,
  PlaygroundOrientation,
} from "../types";

import { CodeEditor } from "./CodeEditor";
import { ConsolePanel } from "./ConsolePanel";
import { EditorTabs } from "./EditorTabs";
import { PreviewPane } from "./PreviewPane";

export function PlaygroundWorkbench({
  activeTab,
  code,
  consoleEntries,
  editorTheme,
  iframeRef,
  orientation,
  previewDocument,
  runCount,
  onActiveTabChange,
  onClearConsole,
  onCodeChange,
}: {
  activeTab: PlaygroundLanguage;
  code: PlaygroundCode;
  consoleEntries: ConsoleEntry[];
  editorTheme: EditorTheme;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  orientation: PlaygroundOrientation;
  previewDocument: string;
  runCount: number;
  onActiveTabChange: (tab: PlaygroundLanguage) => void;
  onClearConsole: () => void;
  onCodeChange: (value: string) => void;
}) {
  const [split, setSplit] = useState(50);
  const panesRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  function startResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const element = panesRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const onMove = (moveEvent: PointerEvent) => {
      const position =
        orientation === "horizontal"
          ? ((moveEvent.clientX - rect.left) / rect.width) * 100
          : ((moveEvent.clientY - rect.top) / rect.height) * 100;
      const minimum =
        orientation === "horizontal" ? (300 / rect.width) * 100 : (280 / rect.height) * 100;
      setSplit(Math.min(100 - minimum, Math.max(minimum, position)));
    };
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = orientation === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop, { once: true });
  }

  const gridStyle = (
    orientation === "horizontal"
      ? {
          gridTemplateColumns: `calc(${split}% - 4px) 8px calc(${100 - split}% - 4px)`,
          gridTemplateRows: "minmax(0, 1fr)",
        }
      : {
          gridTemplateColumns: "minmax(0, 1fr)",
          gridTemplateRows: `calc(${split}% - 4px) 8px calc(${100 - split}% - 4px)`,
        }
  ) satisfies CSSProperties;

  function resizeWithKeyboard(delta: number) {
    setSplit((value) => Math.min(75, Math.max(25, value + delta)));
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card shadow-xs">
      <div
        ref={panesRef}
        style={gridStyle}
        className={cn(
          "flex min-h-220 flex-col min-[900px]:grid min-[900px]:h-[min(72vh,760px)] min-[900px]:min-h-150",
          orientation === "vertical" && "min-[900px]:h-[900px] min-[900px]:max-h-[82vh]",
        )}
      >
        <section
          id="playground-editor-panel"
          role="tabpanel"
          aria-labelledby={`playground-tab-${activeTab}`}
          className="flex min-h-115 min-w-0 flex-col overflow-hidden bg-background min-[900px]:min-h-0"
        >
          <header className="border-b border-border bg-card">
            <EditorTabs activeTab={activeTab} onChange={onActiveTabChange} />
          </header>
          <div className="min-h-0 flex-1 overflow-auto">
            <CodeEditor
              key={activeTab}
              language={activeTab}
              value={code[activeTab]}
              theme={editorTheme}
              onChange={onCodeChange}
            />
          </div>
        </section>

        <div
          role="separator"
          aria-label="Resize editor and preview"
          aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
          aria-valuemin={25}
          aria-valuemax={75}
          aria-valuenow={Math.round(split)}
          tabIndex={0}
          onPointerDown={startResize}
          onKeyDown={(event) => {
            const previous = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
            const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
            if (event.key === previous || event.key === next) {
              event.preventDefault();
              resizeWithKeyboard(event.key === previous ? -5 : 5);
            }
          }}
          className={cn(
            "group relative z-10 hidden bg-border outline-none min-[900px]:block",
            orientation === "horizontal" ? "cursor-col-resize" : "cursor-row-resize",
            "hover:bg-primary/45 focus-visible:bg-primary/60",
          )}
        >
          <span
            className={cn(
              "absolute rounded-full bg-muted-foreground/45 group-hover:bg-primary",
              orientation === "horizontal"
                ? "top-1/2 left-1/2 h-12 w-0.5 -translate-1/2"
                : "top-1/2 left-1/2 h-0.5 w-12 -translate-1/2",
            )}
          />
        </div>

        <div
          ref={previewRef}
          className="min-h-115 min-w-0 overflow-hidden min-[900px]:min-h-0 [&:fullscreen]:h-screen [&:fullscreen]:bg-background [&:fullscreen]:p-3"
        >
          <PreviewPane
            iframeRef={iframeRef}
            previewDocument={previewDocument}
            runCount={runCount}
            onFullscreen={() => void previewRef.current?.requestFullscreen?.()}
          />
        </div>
      </div>
      <ConsolePanel entries={consoleEntries} onClear={onClearConsole} />
    </div>
  );
}
