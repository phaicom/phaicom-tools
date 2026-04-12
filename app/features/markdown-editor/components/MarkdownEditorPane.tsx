"use client";

import "@mdxeditor/editor/style.css";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertTable,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Group, Heading } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

const codeBlockLanguages = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  javascript: "JavaScript",
  json: "JSON",
  markdown: "Markdown",
  text: "Plain text",
  ts: "TypeScript",
  tsx: "TSX",
} as const;

function toExternalUrl(url: string) {
  const trimmedUrl = url.trim();

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
}

type MarkdownEditorPaneProps = {
  markdown: string;
  onChange: (markdown: string) => void;
};

export function MarkdownEditorPane({ markdown, onChange }: MarkdownEditorPaneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const lastKnownMarkdownRef = useRef(markdown);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (markdown !== lastKnownMarkdownRef.current) {
      editorRef.current?.setMarkdown(markdown);
      lastKnownMarkdownRef.current = markdown;
    }
  }, [isMounted, markdown]);

  const plugins = useMemo(
    () => [
      headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
      listsPlugin(),
      quotePlugin(),
      linkPlugin(),
      linkDialogPlugin({
        onClickLinkCallback: (url) => {
          window.open(toExternalUrl(url), "_blank", "noopener,noreferrer");
        },
      }),
      tablePlugin(),
      thematicBreakPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
      codeMirrorPlugin({ codeBlockLanguages }),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarClassName:
          "mdxeditor-toolbar rounded-t-sm border-b border-border/70 bg-card/85 px-3 py-2 backdrop-blur",
        toolbarContents: () => (
          <ConditionalContents
            options={[
              {
                when: (editor) => editor?.editorType === "codeblock",
                contents: () => (
                  <>
                    <UndoRedo />
                    <ChangeCodeMirrorLanguage />
                  </>
                ),
              },
              {
                fallback: () => (
                  <>
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <ListsToggle />
                    <CreateLink />
                    <InsertCodeBlock />
                    <InsertTable />
                  </>
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [],
  );

  return (
    <Group
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="flex h-full min-h-[36rem] flex-col overflow-hidden"
    >
      <div className="border-b border-border/60 px-1 py-3">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          Editor
        </Heading>
      </div>

      <div className="min-h-0 flex-1 pt-3">
        {isMounted ? (
          <div className="markdown-editor-shell h-full min-h-[31rem] bg-background shadow-none">
            <MDXEditor
              ref={editorRef}
              markdown={markdown}
              plugins={plugins}
              onChange={(nextMarkdown) => {
                lastKnownMarkdownRef.current = nextMarkdown;
                onChange(nextMarkdown);
              }}
              suppressHtmlProcessing={false}
              spellCheck
              placeholder="Start writing Markdown or paste HTML-enhanced content here."
              className="markdown-editor-instance"
              contentEditableClassName={cn(
                "markdown-editor-content prose-surface min-h-[31rem] px-4 py-4 text-sm text-foreground outline-none md:px-5",
                "[&_a]:text-primary [&_a]:underline-offset-4",
                "[&_blockquote]:border-l-3 [&_blockquote]:border-primary/35 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
                "[&_code]:rounded-xs [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em]",
                "[&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-foreground [&_pre]:p-4 [&_pre]:text-background",
                "[&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-sm",
                "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-secondary/80 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
                "[&_ol]:list-decimal [&_ul]:list-disc",
              )}
            />
          </div>
        ) : (
          <div className="prose-surface h-full min-h-[31rem] overflow-auto bg-background px-4 py-4 text-sm text-muted-foreground shadow-none md:px-5">
            <pre className="font-mono text-sm leading-7 whitespace-pre-wrap">{markdown}</pre>
          </div>
        )}
      </div>
    </Group>
  );
}
