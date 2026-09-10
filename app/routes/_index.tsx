import { LuArrowRight, LuSearch, LuShieldCheck, LuSparkles, LuZap } from "react-icons/lu";
import { Form, Link } from "react-router";

import { ToolCard } from "@/shared/components/tools/ToolCard";
import { button } from "@/shared/components/ui/Button";
import { categories, tools } from "@/shared/data/tools";
import { cn } from "@/shared/utils/cn";

export function meta() {
  return [
    { title: "Phaicom Tools — Focused utilities for everyday work" },
    {
      name: "description",
      content: "Fast, focused developer utilities for images, CSS, HTML, and everyday web work.",
    },
  ];
}

export default function Home() {
  return (
    <main className="flex-1">
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:py-20 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:py-24 xl:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              Practical tools. No account needed.
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
              Small utilities that keep your work moving.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Convert files, shape code, and edit content with focused tools designed to get out of
              your way.
            </p>

            <Form method="get" action="/tools" className="mt-8 max-w-2xl">
              <label htmlFor="home-tool-search" className="sr-only">
                Search tools
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <LuSearch className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="home-tool-search"
                    name="q"
                    type="search"
                    placeholder="What do you need to do?"
                    className="h-13 w-full rounded-md border border-input bg-background pr-4 pl-12 text-base shadow-xs transition outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                  />
                </div>
                <button type="submit" className={cn(button({ variant: "primary" }), "h-13 px-6")}>
                  Search tools
                </button>
              </div>
            </Form>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 text-foreground no-underline hover:text-primary"
              >
                Browse all tools <LuArrowRight className="size-4" />
              </Link>
              <a
                href="#categories"
                className="text-muted-foreground no-underline hover:text-foreground"
              >
                Browse categories
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 border border-border bg-background">
            <div className="p-5 sm:p-6">
              <dt className="text-sm text-muted-foreground">Live tools</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{tools.length}</dd>
            </div>
            <div className="border-l border-border p-5 sm:p-6">
              <dt className="text-sm text-muted-foreground">Categories</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">{categories.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-18 md:px-6 xl:px-8">
        <SectionHeading eyebrow="Featured tools" title="Useful right now." link="/tools" />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools
            .filter((tool) => tool.featured)
            .map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-20 border-y border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-18 md:px-6 xl:px-8">
          <SectionHeading eyebrow="Browse by category" title="Start with what you need." />
          <div className="mt-7 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/tools?category=${encodeURIComponent(category.name)}`}
                className="group min-w-0 border-r border-b border-border bg-background p-5 text-foreground no-underline transition-colors hover:bg-secondary/55 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg">{category.name}</h3>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {category.count} {category.count === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore{" "}
                  <LuArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-18 md:px-6 xl:px-8">
        <SectionHeading eyebrow="Built with intent" title="Simple by design." />
        <div className="mt-7 grid gap-8 md:grid-cols-3">
          <Principle icon={LuZap} title="Fast to use">
            Focused interfaces and immediate feedback keep routine work short.
          </Principle>
          <Principle icon={LuShieldCheck} title="No account required">
            Every current tool is available without creating a profile or sharing an email.
          </Principle>
          <Principle icon={LuSparkles} title="Real, working utilities">
            Each listing opens a maintained tool—not a placeholder or marketing page.
          </Principle>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  link,
  title,
}: {
  eyebrow: string;
  link?: string;
  title: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>
      </div>
      {link ? (
        <Link
          to={link}
          className="hidden text-sm font-semibold text-foreground no-underline hover:text-primary sm:inline-flex"
        >
          View all {tools.length}
        </Link>
      ) : null}
    </div>
  );
}

function Principle({
  children,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  icon: typeof LuZap;
  title: string;
}) {
  return (
    <article className="border-t-2 border-primary pt-5">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <h3 className="mt-4 text-base">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </article>
  );
}
