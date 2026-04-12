"use client";

import { useId, useMemo } from "react";
import { Group, Heading } from "react-aria-components";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type MarkdownPreviewPaneProps = {
  markdown: string;
};

export function MarkdownPreviewPane({ markdown }: MarkdownPreviewPaneProps) {
  const titleId = useId();
  const descriptionId = useId();
  const htmlOutput = useMemo(() => {
    try {
      return String(
        unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeStringify, { allowDangerousHtml: true })
          .processSync(markdown),
      );
    } catch {
      return markdown;
    }
  }, [markdown]);

  return (
    <Group
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="flex h-full min-h-[32rem] flex-col overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/85 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur"
    >
      <div className="border-b border-border/70 px-5 py-4">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          HTML Output
        </Heading>
      </div>

      <div className="min-h-0 flex-1 bg-background/70 p-4">
        <pre className="h-full min-h-[27rem] overflow-auto rounded-[1.35rem] border border-border/70 bg-background px-5 py-4 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground shadow-sm">
          <code>{htmlOutput}</code>
        </pre>
      </div>
    </Group>
  );
}
