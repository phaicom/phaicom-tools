"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useId } from "react";
import { Group, Heading } from "react-aria-components";

import { createBaseExtensions } from "../extensions/baseExtensions";
import { normalizeHtmlDocument } from "../utils/htmlDocument";
import { EditorToolbar } from "./EditorToolbar";

type EditorPaneProps = {
  html: string;
  onChange: (html: string) => void;
  title?: string;
};

const baseExtensions = createBaseExtensions();

export function EditorPane({ html, onChange, title = "Editor" }: EditorPaneProps) {
  const titleId = useId();
  const descriptionId = useId();
  const editor = useEditor({
    content: html,
    editorProps: {
      attributes: {
        class:
          "html-editor-content prose-surface min-h-[31rem] px-4 py-4 text-sm text-foreground outline-none md:px-5",
      },
    },
    extensions: baseExtensions,
    immediatelyRender: false,
    onCreate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = normalizeHtmlDocument(editor.getHTML());
    const nextHtml = normalizeHtmlDocument(html);

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, html]);

  return (
    <Group
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="flex h-full min-h-[36rem] flex-col overflow-hidden rounded-sm border border-border/60 bg-background"
    >
      <div className="border-b border-border/60 px-4 py-3">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          {title}
        </Heading>
        <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
          Compose rich text with TipTap. HTML from <code>editor.getHTML()</code> drives the entire
          document state.
        </p>
      </div>

      <div className="html-editor-shell min-h-0 flex-1">
        <EditorToolbar editor={editor} />

        <div className="min-h-0 flex-1 overflow-auto">
          <EditorContent editor={editor} className="h-full min-h-[31rem]" />
        </div>
      </div>
    </Group>
  );
}
