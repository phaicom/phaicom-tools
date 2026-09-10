import { LuArrowUpRight, LuCode, LuImage, LuPenLine } from "react-icons/lu";
import { Link } from "react-router";

import type { Tool } from "@/shared/data/tools";

const icons = {
  code: LuCode,
  image: LuImage,
  writing: LuPenLine,
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = icons[tool.icon];

  return (
    <article className="group relative flex min-w-0 flex-col border border-border bg-card p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {tool.category}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        <Link to={tool.path} className="text-foreground no-underline after:absolute after:inset-0">
          {tool.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">
        Open tool{" "}
        <LuArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}
