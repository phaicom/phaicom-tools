"use client";

import type { RefObject } from "react";

import { LuExternalLink, LuRefreshCw } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";

export function PreviewPane({
  iframeRef,
  previewDocument,
  runCount,
  onFullscreen,
}: {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  previewDocument: string;
  runCount: number;
  onFullscreen: () => void;
}) {
  return (
    <section className="flex h-full min-h-105 min-w-0 flex-col bg-white" aria-label="Live preview">
      <header className="flex min-h-11 items-center justify-between gap-3 border-b border-border bg-card px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <h2 className="truncate text-sm font-semibold text-card-foreground">Live preview</h2>
          <span className="hidden text-xs text-muted-foreground sm:inline" aria-live="polite">
            Run {runCount}
          </span>
        </div>
        <Button
          variant="quiet"
          aria-label="Open preview in fullscreen"
          onPress={onFullscreen}
          className="h-9 px-2 text-xs"
        >
          <LuExternalLink aria-hidden="true" />
          <span className="hidden sm:inline">Fullscreen</span>
        </Button>
      </header>
      {previewDocument ? (
        <iframe
          ref={iframeRef}
          key={runCount}
          title="HTML Playground live preview"
          sandbox="allow-scripts"
          srcDoc={previewDocument}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-slate-500">
          <LuRefreshCw className="animate-spin" aria-hidden="true" /> Preparing preview…
        </div>
      )}
    </section>
  );
}
