import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageIntroProps = {
  category?: string;
  className?: string;
  description?: ReactNode;
  title: string;
};

export function PageIntro({ category, className, description, title }: PageIntroProps) {
  return (
    <header className={cn("space-y-4", className)}>
      <div className="space-y-3">
        {category ? <p className="text-sm font-semibold text-primary">{category}</p> : null}
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
