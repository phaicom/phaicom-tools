"use client";

import { useMemo } from "react";

import { formatHtmlDocument } from "../utils/formatHtmlDocument";
import { EditorPanel } from "./EditorPanel";

type HtmlSourcePaneProps = {
  html: string;
};

export function HtmlSourcePane({ html }: HtmlSourcePaneProps) {
  const formattedHtml = useMemo(() => formatHtmlDocument(html), [html]);

  return (
    <EditorPanel
      title="HTML Output"
      description="Formatted HTML generated from editor.getHTML()."
      className="min-h-80"
      contentClassName="overflow-auto px-4 py-4 md:px-5"
    >
      <pre className="min-h-56 overflow-auto rounded-sm bg-card/35 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground">
        {formattedHtml || ""}
      </pre>
    </EditorPanel>
  );
}
