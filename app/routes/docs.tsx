import { Link, Outlet, useLocation } from "react-router";

import { DocsBreadcrumbs, DocsSidebar } from "@/features/docs";
import { ToolCard } from "@/shared/components/tools/ToolCard";
import { getToolByPath, tools } from "@/shared/data/tools";

export function meta() {
  return [
    { title: "Docs | Phaicom Tools" },
    { name: "description", content: "Documentation for Phaicom Tools." },
  ];
}

export default function Docs() {
  const location = useLocation();
  const currentTool = getToolByPath(location.pathname);
  const relatedTools = currentTool
    ? tools.filter((tool) => tool.path !== currentTool.path).slice(0, 2)
    : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-7 sm:py-10 md:px-6 xl:px-8">
      <div className="grid flex-1 gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
        <DocsSidebar pathname={location.pathname} />

        <section className="min-w-0">
          <DocsBreadcrumbs pathname={location.pathname} />

          <div className="mt-6">
            <Outlet />
          </div>

          {currentTool ? (
            <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-tools">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">Keep working</p>
                  <h2 id="related-tools" className="mt-2">
                    Related tools
                  </h2>
                </div>
                <Link
                  to="/tools"
                  className="text-sm font-semibold text-foreground no-underline hover:text-primary"
                >
                  Browse all tools
                </Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.path} tool={tool} />
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}
