"use client";

import { LuArrowRight, LuCode, LuKeyboard, LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router";

import { PageIntro } from "@/shared/components/content/PageIntro";
import { ToolCard } from "@/shared/components/tools/ToolCard";
import { tools } from "@/shared/data/tools";

import { useHtmlPlayground } from "../hooks/useHtmlPlayground";
import { PlaygroundToolbar } from "./PlaygroundToolbar";
import { PlaygroundWorkbench } from "./PlaygroundWorkbench";

export function HtmlPlaygroundPage() {
  const playground = useHtmlPlayground();
  const relatedTools = tools
    .filter((tool) => tool.category === "Code & CSS" && tool.path !== "/tools/html-playground")
    .slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 py-7 sm:px-4 sm:py-10 md:px-6 xl:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link to="/" className="text-muted-foreground no-underline hover:text-primary">
          Home
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden="true" />
        <Link to="/tools" className="text-muted-foreground no-underline hover:text-primary">
          Tools
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">HTML Playground</span>
      </nav>

      <div className="mt-7">
        <PageIntro
          category="Code & CSS"
          title="HTML Playground"
          description="Write HTML, CSS, and JavaScript in a full-featured editor, then run it instantly in an isolated live preview. No setup or account required."
        />
      </div>

      <section className="mt-8" aria-label="HTML Playground">
        <div className="overflow-hidden rounded-t-sm border border-b-0 border-border">
          <PlaygroundToolbar
            autoRun={playground.autoRun}
            copied={playground.copied}
            editorTheme={playground.editorTheme}
            orientation={playground.orientation}
            onAutoRunChange={playground.setAutoRun}
            onCopy={() => void playground.copyActiveCode()}
            onDownload={playground.download}
            onEditorThemeChange={playground.setEditorTheme}
            onOrientationChange={playground.setOrientation}
            onReset={playground.reset}
            onRun={playground.run}
          />
        </div>
        <div className="-mt-px">
          <PlaygroundWorkbench
            activeTab={playground.activeTab}
            code={playground.code}
            consoleEntries={playground.consoleEntries}
            editorTheme={playground.editorTheme}
            iframeRef={playground.iframeRef}
            orientation={playground.orientation}
            previewDocument={playground.previewDocument}
            runCount={playground.runCount}
            onActiveTabChange={playground.setActiveTab}
            onClearConsole={playground.clearConsole}
            onCodeChange={playground.updateActiveCode}
          />
        </div>
        <p className="mt-2 min-h-5 text-right text-xs text-muted-foreground" aria-live="polite">
          {playground.saved ? "Saved locally" : "Changes are saved automatically on this device."}
        </p>
      </section>

      <section
        className="mt-14 grid gap-5 border-t border-border pt-10 lg:grid-cols-3"
        aria-labelledby="how-to-use"
      >
        <div className="border border-border bg-card p-5 sm:p-6">
          <LuCode className="size-5 text-primary" aria-hidden="true" />
          <h2 id="how-to-use" className="mt-4 text-lg">
            How to use
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Choose a language tab, edit your code, and press Run. Enable Auto Run when you want the
            preview to refresh after a short pause in typing.
          </p>
        </div>
        <div className="border border-border bg-card p-5 sm:p-6">
          <LuKeyboard className="size-5 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-lg">Keyboard shortcuts</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Use Ctrl/Cmd + Enter to run, Ctrl/Cmd + S to save locally, and Ctrl/Cmd + Shift + O to
            change the desktop layout.
          </p>
        </div>
        <div className="border border-border bg-card p-5 sm:p-6">
          <LuShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-lg">Isolated preview</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Your code runs locally in a sandboxed iframe without access to the playground
            application or its stored data.
          </p>
        </div>
      </section>

      {relatedTools.length ? (
        <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-tools">
          <p className="text-sm font-semibold text-primary">Keep building</p>
          <h2 id="related-tools" className="mt-2 text-xl">
            Related tools
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
