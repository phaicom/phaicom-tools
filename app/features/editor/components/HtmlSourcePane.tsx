"use client";

import { EditorPanel } from "./EditorPanel";

type HtmlSourcePaneProps = {
  html: string;
};

export function HtmlSourcePane({ html }: HtmlSourcePaneProps) {
  return (
    <EditorPanel
      title="HTML Output"
      description={
        <>
          Raw HTML generated from <code>editor.getHTML()</code>.
        </>
      }
      className="min-h-80"
      contentClassName="overflow-auto px-4 py-4 md:px-5"
    >
      <pre className="min-h-56 overflow-auto rounded-sm bg-card/35 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground">
        {html || "<p></p>"}
      </pre>
    </EditorPanel>
  );
}
