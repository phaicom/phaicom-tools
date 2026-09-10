"use client";

import { LuCircleAlert, LuCircleX, LuInfo, LuTrash2 } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/utils/cn";

import type { ConsoleEntry } from "../types";

export function ConsolePanel({
  entries,
  onClear,
}: {
  entries: ConsoleEntry[];
  onClear: () => void;
}) {
  return (
    <section className="border-t border-border bg-card" aria-label="Preview console">
      <header className="flex min-h-10 items-center justify-between gap-3 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-wide text-card-foreground uppercase">
            Console
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {entries.length}
          </span>
        </div>
        <Button
          variant="quiet"
          aria-label="Clear console"
          isDisabled={entries.length === 0}
          onPress={onClear}
          className="h-8 px-2 text-xs"
        >
          <LuTrash2 aria-hidden="true" /> Clear
        </Button>
      </header>
      <div className="max-h-40 min-h-12 overflow-auto border-t border-border/70 bg-background/75 font-mono text-xs">
        {entries.length ? (
          entries.map((entry) => {
            const Icon =
              entry.level === "error" ? LuCircleX : entry.level === "warn" ? LuCircleAlert : LuInfo;
            return (
              <div
                key={entry.id}
                className={cn(
                  "flex gap-2 border-b border-border/50 px-3 py-2 last:border-b-0 sm:px-4",
                  entry.level === "error" && "bg-destructive/5 text-destructive",
                  entry.level === "warn" && "bg-amber-500/5 text-amber-700 dark:text-amber-300",
                  entry.level === "log" && "text-foreground",
                )}
              >
                <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 break-words whitespace-pre-wrap">{entry.message}</span>
              </div>
            );
          })
        ) : (
          <p className="px-3 py-3 text-muted-foreground sm:px-4">
            Console output and runtime errors appear here.
          </p>
        )}
      </div>
    </section>
  );
}
