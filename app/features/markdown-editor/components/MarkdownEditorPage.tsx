"use client";

import { Group } from "react-aria-components";
import { LuCheck, LuClipboard, LuRotateCcw } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { Toolbar } from "@/shared/components/ui/Toolbar";
import { cn } from "@/shared/utils/cn";

import { useMarkdown } from "../hooks/useMarkdown";
import { MarkdownEditorPane } from "./MarkdownEditorPane";
import { MarkdownPreviewPane } from "./MarkdownPreviewPane";

export function MarkdownEditorPage() {
  const { copied, copyMarkdown, markdown, resetMarkdown, setMarkdown } = useMarkdown();

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-3">
          <h1>Markdown Editor</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Write Markdown in a rich editor, mix in raw HTML tags when you need them, and inspect
            the generated HTML source instantly beside it.
          </p>
        </div>

        <Group
          aria-label="Markdown editor actions"
          className="rounded-sm border border-border/70 bg-card/80 p-3 shadow-xs backdrop-blur"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <Toolbar aria-label="Document actions" className="w-full md:w-auto md:justify-end">
              <Button
                variant="secondary"
                onPress={() => void copyMarkdown()}
                className={({ isDisabled }) =>
                  cn(
                    "h-10 min-w-0 flex-1 rounded-sm px-4 md:min-w-36 md:flex-none",
                    copied && !isDisabled && "border-emerald-500/30 bg-emerald-500/10",
                  )
                }
              >
                <span className="flex items-center gap-2">
                  {copied ? <LuCheck /> : <LuClipboard />}
                  {copied ? "Copied" : "Copy Markdown"}
                </span>
              </Button>

              <Button
                variant="quiet"
                onPress={resetMarkdown}
                className="h-10 min-w-0 flex-1 rounded-sm px-4 md:min-w-32 md:flex-none"
              >
                <span className="flex items-center gap-2">
                  <LuRotateCcw />
                  Reset Sample
                </span>
              </Button>
            </Toolbar>
          </div>
        </Group>
      </header>

      <section className="grid gap-6 xl:grid-cols-2">
        <MarkdownEditorPane markdown={markdown} onChange={setMarkdown} />
        <MarkdownPreviewPane markdown={markdown} />
      </section>
    </div>
  );
}
