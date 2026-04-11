import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { Link } from "react-router";

import { button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function meta() {
  return [
    { title: "Phaicom Tools" },
    {
      name: "description",
      content:
        "Beautiful developer utilities for daily work, from image conversion to CSS and Tailwind helpers.",
    },
  ];
}

export default function Home() {
  return (
    <main className="starfield flex flex-col items-center justify-center px-4 pt-10 pb-4 md:px-6">
      <div className="flex w-full max-w-3xl flex-col gap-6 md:items-center md:text-center">
        <h1 className="text-galaxy text-5xl font-semibold tracking-tight sm:text-7xl">
          Build faster with <br />
          Phaicom Tools
        </h1>

        <p className="text-md max-w-xl text-muted-foreground sm:text-lg">
          Carefully designed utilities to help you ship faster and work smarter. Built to simplify
          repetitive tasks, improve your workflow, and let you focus on what actually matters,
          building great products.
        </p>

        <Link
          to="/docs"
          className={cn(button({ variant: "primary" }), "w-full no-underline md:max-w-[320px]")}
        >
          Get Started
        </Link>
      </div>

      {/* Tech Icons */}
      <div className="mt-10 flex flex-row justify-center gap-6">
        {[SiReact, SiTypescript, SiTailwindcss].map((Icon) => (
          <Icon
            key={Icon.name}
            className="size-8 text-foreground/60 transition-all duration-300 hover:scale-110 hover:text-primary"
          />
        ))}
      </div>
    </main>
  );
}
