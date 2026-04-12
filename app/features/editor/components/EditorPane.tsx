"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useId, useState } from "react";
import { Group, Heading, TextArea, TextField } from "react-aria-components";

import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/utils/cn";

import { createBaseExtensions } from "../extensions/baseExtensions";
import { normalizeHtmlDocument } from "../utils/htmlDocument";
import { EditorToolbar } from "./EditorToolbar";

type EditorPaneProps = {
  html: string;
  onChange: (html: string) => void;
  title?: string;
};

const baseExtensions = createBaseExtensions();
type EditorMode = "rich-text" | "html";

export function EditorPane({ html, onChange, title = "Editor" }: EditorPaneProps) {
  const titleId = useId();
  const descriptionId = useId();
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
    <Group
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="flex h-full min-h-[36rem] flex-col overflow-hidden rounded-sm border border-border/60 bg-background"
    >
      <div className="border-b border-border/60 px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Heading id={titleId} className="text-base font-semibold tracking-tight">
              {title}
            </Heading>
          </div>

          <div
            className="inline-flex w-full rounded-sm border border-border/70 bg-secondary p-1 md:w-auto"
            role="group"
            aria-label="Editor mode"
          >
            <Button
              variant={mode === "rich-text" ? "secondary" : "quiet"}
              onPress={() => setMode("rich-text")}
              className={cn(
                "h-9 flex-1 rounded-sm px-4 md:flex-none",
                mode === "rich-text" && "border-border/70 bg-background shadow-xs",
              )}
            >
              Rich Text
            </Button>
            <Button
              variant={mode === "html" ? "secondary" : "quiet"}
              onPress={() => setMode("html")}
              className={cn(
                "h-9 flex-1 rounded-sm px-4 md:flex-none",
                mode === "html" && "border-border/70 bg-background shadow-xs",
              )}
            >
              HTML
            </Button>
          </div>
        </div>
      </div>

      <div className="html-editor-shell min-h-0 flex-1">
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
      </div>
    </Group>
  );
}
