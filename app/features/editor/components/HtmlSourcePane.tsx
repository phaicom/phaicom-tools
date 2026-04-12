"use client";

import { useMemo } from "react";

import { cn } from "@/shared/utils/cn";

import { formatHtmlDocument } from "../utils/formatHtmlDocument";
import { EditorPanel } from "./EditorPanel";

type HtmlSourcePaneProps = {
  className?: string;
  html: string;
};

export function HtmlSourcePane({ className, html }: HtmlSourcePaneProps) {
  const formattedHtml = useMemo(() => formatHtmlDocument(html), [html]);

  return (
    <EditorPanel
      title="Formatted HTML"
      className={cn("min-h-80", className)}
      contentClassName="overflow-auto px-4 py-4 md:px-5"
    >
      {formattedHtml ? (
        <pre className="min-h-56 overflow-auto rounded-sm bg-card/35 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground">
          {formattedHtml}
        </pre>
      ) : (
        <div className="flex h-full min-h-56 items-center justify-center rounded-sm border border-dashed border-border/70 bg-card/35 px-6 text-center text-sm text-muted-foreground">
          Start typing on the left to generate formatted HTML here.
        </div>
      )}
    </EditorPanel>
  );
}
