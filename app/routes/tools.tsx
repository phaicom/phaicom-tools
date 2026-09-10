import { ToolDirectory } from "@/shared/components/tools/ToolDirectory";

export function meta() {
  return [
    { title: "All Tools | Phaicom Tools" },
    { name: "description", content: "Search and browse every developer utility in Phaicom Tools." },
  ];
}

export default function ToolsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:py-14 md:px-6 xl:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Tool directory</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Find the right tool, fast.</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Search every utility by name, purpose, tag, or category. Results update as you type.
        </p>
      </header>
      <section className="mt-8" aria-label="Tools directory">
        <ToolDirectory />
      </section>
    </main>
  );
}
