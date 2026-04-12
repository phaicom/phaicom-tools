"use client";

import { useMemo } from "react";

import { sanitizeHtml } from "../utils/sanitizeHtml";
import { EditorPanel } from "./EditorPanel";

type HtmlPreviewPaneProps = {
  html: string;
};

export function HtmlPreviewPane({ html }: HtmlPreviewPaneProps) {
  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html]);

  return (
    <EditorPanel
      title="Live Preview"
      description="Rendered safely from the current HTML document."
      className="h-full min-h-[36rem]"
      contentClassName="overflow-auto px-4 py-4 md:px-5"
    >
      {sanitizedHtml ? (
        <div
          className="prose-surface html-preview min-h-[31rem] text-sm text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      ) : (
        <div className="flex min-h-[31rem] items-center justify-center rounded-sm border border-dashed border-border/70 bg-card/35 px-6 text-center text-sm text-muted-foreground">
          Start typing on the left to generate HTML and preview it here.
        </div>
      )}
    </EditorPanel>
  );
}
