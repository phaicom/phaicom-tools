import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/Button";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center pt-16 pb-4">
      <div className="flex w-full flex-col gap-6 px-7 pb-8 md:items-center md:px-10 md:text-center">
        <h1 className="text-5xl sm:text-7xl">
          Build faster with <br />
          Phaicom Tools
        </h1>

        <p className="text-md max-w-xl text-muted-foreground sm:text-lg">
          Carefully designed utilities to help you ship faster and work smarter. Built to simplify
          repetitive tasks, improve your workflow, and let you focus on what actually matters,
          building great products.
        </p>

        <Button
          className="w-full cursor-pointer md:max-w-[320px]"
          onClick={() => navigate("/docs")}
        >
          Get Started
        </Button>
      </div>

      {/* Tech Icons */}
      <div className="mx-auto flex flex-row justify-center gap-4">
        {[SiReact, SiTypescript, SiTailwindcss].map((Icon) => (
          <Icon key={Icon.name} className="size-8" />
        ))}
      </div>
    </main>
  );
}
