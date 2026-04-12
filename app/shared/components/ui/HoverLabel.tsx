import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

interface HoverLabelProps {
  children: ReactNode;
  label: ReactNode;
  side?: "top" | "bottom";
  className?: string;
  contentClassName?: string;
}

export function HoverLabel({
  children,
  label,
  side = "top",
  className,
  contentClassName,
}: HoverLabelProps) {
  const positionClassName =
    side === "top" ? "-top-10 group-hover:-translate-y-1" : "-bottom-10 group-hover:translate-y-1";

  return (
    <div className={cn("group relative flex items-center justify-center", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background opacity-0 transition-all duration-300 group-hover:opacity-100",
          positionClassName,
          contentClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}
