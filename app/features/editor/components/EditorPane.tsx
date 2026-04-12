"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { TextArea, TextField } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

import { createBaseExtensions } from "../extensions/baseExtensions";
import { useEditorDocumentLifecycle } from "../hooks/useEditorDocumentLifecycle";
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

  useEditorDocumentLifecycle({ editor, html, mode, onChange });

  return (
    <EditorPanel
      title="Editor"
      className="h-full min-h-144"
      contentClassName="html-editor-shell"
      headerContent={<EditorModeTabs mode={mode} onChange={setMode} />}
    >
      {mode === "rich-text" ? (
        <>
          <EditorToolbar editor={editor} />

          <div className="min-h-0 flex-1 overflow-auto">
            <EditorContent editor={editor} className="h-full min-h-124" />
          </div>
        </>
      ) : (
        <TextField aria-label="HTML editor" className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-hidden">
            <TextArea
              value={html}
              onChange={(event) => onChange(event.target.value)}
              spellCheck={false}
              className={({ isFocusVisible, isHovered }) =>
                cn(
                  "h-full min-h-124 w-full resize-none border-0 bg-background px-4 py-4 font-mono text-sm leading-7 text-foreground transition outline-none md:px-5",
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
