export const handle = {
  docsNav: {
    title: "Overview",
    order: -100,
  },
};

export default function DocsIndex() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold tracking-[0.24em] text-primary uppercase">
          Phaicom Tools
        </p>
        <h1>Docs</h1>
        <p className="max-w-3xl text-muted-foreground">
          Simple, practical documentation for tools you actually use. Learn what each tool does, how
          to use it, and how it fits into your daily workflow.
        </p>
      </div>

      <div className="rounded-sm border border-border/70 bg-background/70 p-5">
        <h2 className="text-lg">Get Started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a tool from the sidebar and start exploring. Each page is short, focused, and built
          to help you get things done quickly.
        </p>
      </div>
    </div>
  );
}
