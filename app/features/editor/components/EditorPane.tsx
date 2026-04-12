"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { TextArea, TextField } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

import { createBaseExtensions } from "../extensions/baseExtensions";
import { normalizeHtmlDocument } from "../utils/htmlDocument";
import { EditorModeTabs, type EditorMode } from "./EditorModeTabs";
import { EditorPanel } from "./EditorPanel";
import { EditorToolbar } from "./EditorToolbar";

type EditorPaneProps = {
  html: string;
  onChange: (html: string) => void;
};

const baseExtensions = createBaseExtensions();

export function EditorPane({ html, onChange }: EditorPaneProps) {
  const [mode, setMode] = useState<EditorMode>("rich-text");
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
    <EditorPanel
      title="Editor"
      className="h-full min-h-[36rem]"
      contentClassName="html-editor-shell"
      headerContent={<EditorModeTabs mode={mode} onChange={setMode} />}
    >
      {mode === "rich-text" ? (
        <>
          <EditorToolbar editor={editor} />

          <div className="min-h-0 flex-1 overflow-auto">
            <EditorContent editor={editor} className="h-full min-h-[31rem]" />
          </div>
        </>
      ) : (
        <TextField aria-label="HTML editor" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-border/70 bg-card/65 px-4 py-2 text-sm text-muted-foreground">
            Raw HTML mode
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <TextArea
              value={html}
              onChange={(event) => onChange(event.target.value)}
              spellCheck={false}
              className={({ isFocusVisible, isHovered }) =>
                cn(
                  "min-h-[31rem] w-full resize-none border-0 bg-background px-4 py-4 font-mono text-sm leading-7 text-foreground transition outline-none md:px-5",
                  isHovered && "bg-card/35",
                  isFocusVisible && "ring-2 ring-ring/20 ring-inset",
                )
              }
            />
          </div>
        </TextField>
      )}
    </EditorPanel>
  );
}
