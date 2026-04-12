"use client";

import { useId } from "react";
import { Group, Heading } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

type EditorPanelProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  description?: React.ReactNode;
  headerContent?: React.ReactNode;
  headerClassName?: string;
  title: string;
};

export function EditorPanel({
  children,
  className,
  contentClassName,
  description,
  headerContent,
  headerClassName,
  title,
}: EditorPanelProps) {
  const titleId = useId();

  return (
    <Group
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col overflow-hidden rounded-sm border border-border/60 bg-background",
        className,
      )}
    >
      <div className={cn("border-b border-border/60 px-4 py-3", headerClassName)}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Heading id={titleId} className="text-base font-semibold tracking-tight">
              {title}
            </Heading>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {headerContent ? <div className="md:shrink-0">{headerContent}</div> : null}
        </div>
      </div>

      <div className={cn("min-h-0 flex-1", contentClassName)}>{children}</div>
    </Group>
  );
}
