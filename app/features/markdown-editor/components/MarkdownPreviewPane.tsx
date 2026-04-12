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
      className="flex h-full min-h-[36rem] flex-col overflow-hidden"
    >
      <div className="border-b border-border/60 px-1 py-3">
        <Heading id={titleId} className="text-base font-semibold tracking-tight">
          HTML Output
        </Heading>
      </div>

      <div className="min-h-0 flex-1 pt-3">
        <pre className="h-full min-h-[31rem] overflow-auto bg-background px-4 py-4 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground shadow-none md:px-5">
          <code>{htmlOutput}</code>
        </pre>
      </div>
    </Group>
  );
}
