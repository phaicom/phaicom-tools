"use client";

import { Group } from "react-aria-components";
import { LuCheck, LuClipboard, LuRotateCcw } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { Toolbar } from "@/shared/components/ui/Toolbar";
import { cn } from "@/shared/utils/cn";

import { useHtmlEditor } from "../hooks/useHtmlEditor";
import { EditorPane } from "./EditorPane";
import { HtmlPreviewPane } from "./HtmlPreviewPane";
import { HtmlSourcePane } from "./HtmlSourcePane";

export function HtmlEditorPage() {
  const { copied, copyHtml, deferredHtml, html, resetHtml, updateHtml } = useHtmlEditor();

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <header className="space-y-4">
        <div className="space-y-3">
          <h1>HTML Editor</h1>
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
            Compose rich text with TipTap on the left and preview the live HTML output on the right.
            The app stores and shares a single HTML document end to end.
          </p>
        </div>

        <Group aria-label="HTML editor actions" className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <Toolbar aria-label="Document actions" className="w-full md:w-auto md:justify-end">
              <Button
                variant="secondary"
                isDisabled={!html}
                onPress={() => void copyHtml()}
                className={({ isDisabled }) =>
                  cn(
                    "h-10 min-w-0 flex-1 rounded-sm px-4 md:min-w-36 md:flex-none",
                    copied && !isDisabled && "border-emerald-500/30 bg-emerald-500/10",
                  )
                }
              >
                <span className="flex items-center gap-2">
                  {copied ? <LuCheck /> : <LuClipboard />}
                  {copied ? "Copied" : "Copy HTML"}
                </span>
              </Button>

              <Button
                variant="quiet"
                onPress={resetHtml}
                className="h-10 min-w-0 flex-1 rounded-sm px-4 md:min-w-32 md:flex-none"
              >
                <span className="flex items-center gap-2">
                  <LuRotateCcw />
                  Clear Editor
                </span>
              </Button>
            </Toolbar>
          </div>
        </Group>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        <section className="grid gap-4 min-[1500px]:grid-cols-2">
          <EditorPane html={html} onChange={updateHtml} />
          <HtmlPreviewPane html={deferredHtml} />
        </section>

        <section>
          <HtmlSourcePane html={deferredHtml} />
        </section>
      </div>
    </div>
  );
}
