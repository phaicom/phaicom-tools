"use client";

import { useId, useMemo } from "react";
import { Group, Heading } from "react-aria-components";

import { sanitizeHtml } from "../utils/sanitizeHtml";

type HtmlPreviewPaneProps = {
  html: string;
};

export function HtmlPreviewPane({ html }: HtmlPreviewPaneProps) {
  const titleId = useId();
  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html]);

  return (
    <Group
      aria-labelledby={titleId}
      className="flex h-full min-h-[36rem] flex-col overflow-hidden rounded-sm border border-border/60 bg-background"
    >
      <div className="border-b border-border/60 px-4 py-3">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          Live Preview
        </Heading>
        <p className="mt-1 text-sm text-muted-foreground">
          Rendered safely from the current HTML document.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 py-4 md:px-5">
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
      </div>
    </Group>
  );
}
