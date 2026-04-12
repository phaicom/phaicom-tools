import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageIntroProps = {
  className?: string;
  description?: ReactNode;
  title: string;
};

export function PageIntro({ className, description, title }: PageIntroProps) {
  return (
    <header className={cn("space-y-4", className)}>
      <div className="space-y-3">
        <h1>{title}</h1>
        {description ? (
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
