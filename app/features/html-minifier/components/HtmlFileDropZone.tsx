"use client";

import type { ComponentProps } from "react";

import { FileTrigger, isFileDropItem } from "react-aria-components";
import { LuFileCode2, LuFolderUp } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { DropZone } from "@/shared/components/ui/DropZone";
import { cn } from "@/shared/utils/cn";

export function HtmlFileDropZone({ onFile }: { onFile: (file: File) => void }) {
  async function handleDrop(
    event: Parameters<NonNullable<ComponentProps<typeof DropZone>["onDrop"]>>[0],
  ) {
    const item = [...event.items].find(isFileDropItem);
    if (item) onFile(await item.getFile());
  }

  return (
    <DropZone
      aria-label="Upload an HTML file"
      onDrop={(event) => void handleDrop(event)}
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          "w-full rounded-sm border border-dashed border-border bg-background p-4 text-left transition sm:p-5",
          isDropTarget && "border-primary bg-primary/5",
          isFocusVisible && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
        )
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-secondary text-primary">
            <LuFileCode2 className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-medium">Drop an HTML file here</p>
            <p className="mt-0.5 text-xs text-muted-foreground">.html or .htm, up to 2 MB</p>
          </div>
        </div>
        <FileTrigger
          acceptedFileTypes={[".html", ".htm", "text/html"]}
          onSelect={(files) => {
            const file = files?.item(0);
            if (file) onFile(file);
          }}
        >
          <Button variant="secondary" className="h-10 w-full sm:w-auto">
            <span className="flex items-center gap-2">
              <LuFolderUp aria-hidden /> Browse file
            </span>
          </Button>
        </FileTrigger>
      </div>
    </DropZone>
  );
}
