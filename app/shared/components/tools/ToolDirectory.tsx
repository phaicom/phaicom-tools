import { useMemo } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { useSearchParams } from "react-router";

import { ToolCard } from "@/shared/components/tools/ToolCard";
import { categories, tools } from "@/shared/data/tools";

const ALL_CATEGORIES = "All tools";

export function ToolDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? ALL_CATEGORIES;

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || tool.category === selectedCategory;
      const searchable = [tool.title, tool.description, tool.category, ...tool.tags]
        .join(" ")
        .toLocaleLowerCase();
      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [query, selectedCategory]);

  function updateParam(key: "q" | "category", value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === ALL_CATEGORIES) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  return (
    <>
      <div className="border border-border bg-card p-4 sm:p-5">
        <label htmlFor="tool-search" className="text-sm font-semibold text-foreground">
          Search tools
        </label>
        <div className="relative mt-2">
          <LuSearch className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Search by name, category, or keyword…"
            className="h-12 w-full rounded-md border border-input bg-background pr-12 pl-12 text-base transition outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
          />
          {query ? (
            <button
              type="button"
              onClick={() => updateParam("q", "")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <LuX className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
          {[ALL_CATEGORIES, ...categories.map((category) => category.name)].map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => updateParam("category", category)}
                aria-pressed={isActive}
                className={`min-h-10 shrink-0 cursor-pointer rounded-md border px-3.5 text-sm font-medium transition ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing <strong className="font-semibold text-foreground">{results.length}</strong> of{" "}
          {tools.length} tools
        </p>
      </div>

      {results.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-border bg-card px-5 py-16 text-center">
          <h2 className="text-lg">No tools found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a shorter search or choose another category.
          </p>
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className="mt-5 cursor-pointer text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
