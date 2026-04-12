"use client";

import { useId } from "react";
import { Group, Heading } from "react-aria-components";

type HtmlSourcePaneProps = {
  html: string;
};

export function HtmlSourcePane({ html }: HtmlSourcePaneProps) {
  const titleId = useId();

  return (
    <Group
      aria-labelledby={titleId}
      className="flex min-h-[20rem] flex-col overflow-hidden rounded-sm border border-border/60 bg-background"
    >
      <div className="border-b border-border/60 px-4 py-3">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          HTML Output
        </Heading>
        <p className="mt-1 text-sm text-muted-foreground">
          Raw HTML generated from <code>editor.getHTML()</code>.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 py-4 md:px-5">
        <pre className="min-h-[14rem] overflow-auto rounded-sm border border-border/70 bg-card/35 px-4 py-4 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground">
          {html || "<p></p>"}
        </pre>
      </div>
    </Group>
  );
}
