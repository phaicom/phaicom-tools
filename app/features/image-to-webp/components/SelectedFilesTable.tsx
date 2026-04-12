"use client";

import { Cell, Column, Row, Table, TableBody, TableHeader } from "@/shared/components/ui/Table";
import { cn } from "@/shared/utils/cn";

import type { ImageBatchItem } from "../types";

import { formatFileSize, formatSizeDelta } from "../utils/file";

type SelectedFilesTableProps = {
  items: ImageBatchItem[];
};

const statusStyles: Record<ImageBatchItem["status"], string> = {
  queued: "text-secondary-foreground",
  converting: "text-primary",
  done: "text-emerald-700 dark:text-emerald-300",
  error: "text-destructive",
  unsupported: "text-amber-700 dark:text-amber-300",
};

const statusLabels: Record<ImageBatchItem["status"], string> = {
  queued: "Queued",
  converting: "Converting",
  done: "Converted",
  error: "Error",
  unsupported: "Unsupported",
};

function getItemDetails(item: ImageBatchItem) {
  if (item.errorMessage) {
    return item.errorMessage;
  }

  if (item.status === "queued") {
    return "Ready";
  }

  if (item.status === "converting") {
    return "Processing";
  }

  if (item.status === "unsupported") {
    return "Not supported";
  }

  return "Done";
}

export function SelectedFilesTable({ items }: SelectedFilesTableProps) {
  const header = ["File", "Original", "WebP", "Delta", "Status", "Details"];

  return (
    <Table
      aria-label="Selected files for WebP conversion"
      className="max-h-120 overflow-hidden border-0 bg-linear-to-b from-background via-background to-muted/20"
    >
      <TableHeader className="h-12 border-b border-border/70 bg-muted/70 backdrop-blur">
        {header.map((label, i) => (
          <Column
            key={label}
            isRowHeader={i === 0}
            className={cn(
              i === header.length - 1 && "[&_div]:bg-transparent",
              i === 0 && "[&>div]:pl-2",
            )}
          >
            <span className="block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {label}
            </span>
          </Column>
        ))}
      </TableHeader>
      <TableBody items={items}>
        {(item) => {
          const delta =
            typeof item.convertedSize === "number"
              ? formatSizeDelta(item.size, item.convertedSize)
              : null;

          return (
            <Row
              id={item.id}
              className="border-b border-border/50 bg-background/85 transition-colors even:bg-muted/20 hover:bg-primary/5"
            >
              <Cell className="max-w-90 py-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  </div>
                </div>
              </Cell>
              <Cell className="py-4 align-middle">
                <span className="font-medium text-foreground">{formatFileSize(item.size)}</span>
              </Cell>
              <Cell className="py-4 align-middle">
                <span className="font-medium text-foreground">
                  {typeof item.convertedSize === "number"
                    ? formatFileSize(item.convertedSize)
                    : item.status === "converting"
                      ? "Processing"
                      : "—"}
                </span>
              </Cell>
              <Cell className="py-4 align-middle">
                {delta ? (
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      delta.tone === "better" &&
                        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                      delta.tone === "worse" &&
                        "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                      delta.tone === "neutral" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {delta.text}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </Cell>
              <Cell className="py-4 align-middle">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold",
                    statusStyles[item.status],
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  {statusLabels[item.status]}
                </span>
              </Cell>
              <Cell className="max-w-100 py-4 text-sm leading-6 whitespace-normal text-muted-foreground">
                {getItemDetails(item)}
              </Cell>
            </Row>
          );
        }}
      </TableBody>
    </Table>
  );
}
