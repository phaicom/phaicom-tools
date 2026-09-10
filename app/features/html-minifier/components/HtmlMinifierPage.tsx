"use client";

import { Label, TextArea, TextField } from "react-aria-components";
import {
  LuArrowRight,
  LuCheck,
  LuClipboard,
  LuDownload,
  LuMinimize2,
  LuRotateCcw,
  LuSettings2,
  LuShieldCheck,
} from "react-icons/lu";
import { Link } from "react-router";

import { PageIntro } from "@/shared/components/content/PageIntro";
import { ToolCard } from "@/shared/components/tools/ToolCard";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { tools } from "@/shared/data/tools";
import { cn } from "@/shared/utils/cn";

import type { HtmlMinifierOptions, HtmlMinifierStats } from "../types";

import { DEFAULT_HTML } from "../constants";
import { useHtmlMinifier } from "../hooks/useHtmlMinifier";
import { formatBytes } from "../utils/minifyHtml";
import { HtmlFileDropZone } from "./HtmlFileDropZone";

const OPTION_ITEMS: Array<{
  key: keyof HtmlMinifierOptions;
  label: string;
  description: string;
}> = [
  {
    key: "removeComments",
    label: "Remove comments",
    description: "Keeps conditional and special comments.",
  },
  {
    key: "collapseWhitespace",
    label: "Collapse whitespace",
    description: "Preserves sensitive element content.",
  },
  {
    key: "useShortDoctype",
    label: "Shorten doctype",
    description: "Uses the standard HTML5 doctype.",
  },
  {
    key: "optimizeAttributes",
    label: "Optimize attributes",
    description: "Removes safe quotes, defaults, and boolean values.",
  },
  {
    key: "removeEmptyAttributes",
    label: "Remove empty attributes",
    description: "Only removes attributes the minifier recognizes as safe.",
  },
  {
    key: "removeOptionalTags",
    label: "Remove optional tags",
    description: "Smaller output, best for standards-compliant HTML.",
  },
  {
    key: "minifyCss",
    label: "Minify inline CSS",
    description: "Processes style tags and style attributes.",
  },
  {
    key: "minifyJavaScript",
    label: "Minify inline JavaScript",
    description: "Processes script tags and event handlers.",
  },
];

export function HtmlMinifierPage() {
  const minifier = useHtmlMinifier();
  const relatedTools = tools
    .filter((tool) => tool.category === "Code & CSS" && tool.path !== "/tools/html-minifier")
    .slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-[1600px] min-w-0 flex-1 px-3 py-7 sm:px-4 sm:py-10 md:px-6 xl:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link to="/" className="text-muted-foreground no-underline hover:text-primary">
          Home
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden />
        <Link to="/tools" className="text-muted-foreground no-underline hover:text-primary">
          Tools
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden />
        <span className="font-medium text-foreground">HTML Minifier</span>
      </nav>

      <div className="mt-7">
        <PageIntro
          category="Code & CSS"
          title="HTML Minifier"
          description="Remove unnecessary whitespace, comments, and redundant markup from HTML directly in your browser."
        />
      </div>

      <section className="mt-8 min-w-0 space-y-4" aria-label="HTML minifier workspace">
        <HtmlFileDropZone onFile={(file) => void minifier.loadFile(file)} />

        <details className="rounded-sm border border-border bg-card">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 font-medium marker:hidden sm:px-5">
            <LuSettings2 className="size-4 text-primary" aria-hidden />
            Minification options
            <span className="ml-auto text-xs font-normal text-muted-foreground">Safe defaults</span>
          </summary>
          <div className="grid gap-x-7 gap-y-4 border-t border-border px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
            {OPTION_ITEMS.map((item) => (
              <div key={item.key} className="min-w-0">
                <Checkbox
                  isSelected={minifier.options[item.key]}
                  onChange={(value) => minifier.updateOption(item.key, value)}
                >
                  {item.label}
                </Checkbox>
                <p className="mt-1 pl-6.5 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </details>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <Editor
            label="Input HTML"
            hint={minifier.sourceName ?? "Saved locally on this device"}
            value={minifier.input}
            placeholder={DEFAULT_HTML}
            onChange={minifier.updateInput}
          />
          <Editor
            label="Minified HTML"
            hint={
              minifier.output
                ? `${formatBytes(minifier.stats?.minifiedBytes ?? 0)} output`
                : "Result appears here"
            }
            value={minifier.output}
            placeholder="Your minified HTML will appear here."
            readOnly
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-sm border border-border bg-card p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button
              onPress={() => void minifier.runMinifier()}
              isPending={minifier.isMinifying}
              className="h-11 sm:min-w-36"
            >
              <span className="flex items-center gap-2">
                <LuMinimize2 aria-hidden /> Minify HTML
              </span>
            </Button>
            <Button
              variant="secondary"
              onPress={() => void minifier.copyOutput()}
              isDisabled={!minifier.output}
              className="h-11"
            >
              <span className="flex items-center gap-2">
                {minifier.copied ? <LuCheck aria-hidden /> : <LuClipboard aria-hidden />}
                {minifier.copied ? "Copied" : "Copy"}
              </span>
            </Button>
            <Button
              variant="secondary"
              onPress={minifier.downloadOutput}
              isDisabled={!minifier.output}
              className="h-11"
            >
              <span className="flex items-center gap-2">
                <LuDownload aria-hidden /> Download
              </span>
            </Button>
            <Button
              variant="quiet"
              onPress={minifier.clear}
              isDisabled={!minifier.input && !minifier.output}
              className="h-11"
            >
              <span className="flex items-center gap-2">
                <LuRotateCcw aria-hidden /> Clear
              </span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground xl:text-right">
            <kbd className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono">
              Ctrl/Cmd + Enter
            </kbd>{" "}
            to minify
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true" className="min-h-6 text-sm">
          {minifier.error ? (
            <p className="text-destructive">{minifier.error}</p>
          ) : (
            <p className="text-muted-foreground">{minifier.notice}</p>
          )}
        </div>

        {minifier.stats ? <Stats stats={minifier.stats} /> : null}
      </section>

      <section
        className="mt-14 grid gap-5 border-t border-border pt-10 md:grid-cols-2"
        aria-labelledby="about-minification"
      >
        <div className="border border-border bg-card p-5 sm:p-6">
          <LuShieldCheck className="size-5 text-primary" aria-hidden />
          <h2 id="about-minification" className="mt-4 text-lg">
            Safe by default
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Formatting inside pre, textarea, script, style, and code content is preserved unless you
            explicitly enable inline CSS or JavaScript minification.
          </p>
        </div>
        <div className="border border-border bg-card p-5 sm:p-6">
          <LuMinimize2 className="size-5 text-primary" aria-hidden />
          <h2 className="mt-4 text-lg">Private and local</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your HTML is processed in this browser. Files are read locally and are never uploaded to
            a server.
          </p>
        </div>
      </section>

      {relatedTools.length ? (
        <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-tools">
          <p className="text-sm font-semibold text-primary">Keep building</p>
          <h2 id="related-tools" className="mt-2 text-xl">
            Related tools
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Editor({
  hint,
  label,
  onChange,
  placeholder,
  readOnly = false,
  value,
}: {
  hint: string;
  label: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  value: string;
}) {
  return (
    <TextField className="min-w-0 overflow-hidden rounded-sm border border-border bg-card">
      <div className="flex min-h-12 min-w-0 items-center justify-between gap-3 border-b border-border px-4">
        <Label className="shrink-0 text-sm font-semibold">{label}</Label>
        <span className="truncate text-xs text-muted-foreground">{hint}</span>
      </div>
      <TextArea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        wrap="off"
        className={({ isFocusVisible }) =>
          cn(
            "block min-h-96 w-full max-w-full min-w-0 resize-y overflow-auto border-0 bg-background p-4 font-mono text-[13px] leading-6 text-foreground outline-none placeholder:whitespace-pre-wrap placeholder:text-muted-foreground/60 sm:min-h-112 sm:p-5",
            isFocusVisible && "ring-2 ring-primary/25 ring-inset",
            readOnly && "resize-none bg-secondary/20",
          )
        }
      />
    </TextField>
  );
}

function Stats({ stats }: { stats: HtmlMinifierStats }) {
  const items = [
    ["Original", formatBytes(stats.originalBytes)],
    ["Minified", formatBytes(stats.minifiedBytes)],
    ["Saved", formatBytes(stats.savedBytes)],
    ["Reduction", `${stats.reduction.toFixed(1)}%`],
  ];
  return (
    <section
      aria-label="Size savings"
      className="grid grid-cols-2 border border-border bg-card sm:grid-cols-4"
    >
      {items.map(([label, value], index) => (
        <div
          key={label}
          className={cn(
            "min-w-0 p-4 sm:p-5",
            index % 2 && "border-l border-border",
            index >= 2 && "border-t border-border sm:border-t-0",
            index > 0 && "sm:border-l sm:border-border",
          )}
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 truncate text-xl font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </section>
  );
}
