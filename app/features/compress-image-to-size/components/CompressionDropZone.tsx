import type { ComponentProps } from "react";

import { FileTrigger } from "react-aria-components";
import { LuImagePlus } from "react-icons/lu";

import { collectDroppedImageFiles } from "@/features/image-to-webp/utils/fileSelection";
import { Button } from "@/shared/components/ui/Button";
import { DropZone } from "@/shared/components/ui/DropZone";
import { cn } from "@/shared/utils/cn";

import { MAX_FILE_BYTES, MAX_FILE_COUNT, SUPPORTED_IMAGE_TYPES } from "../constants";

type CompressionDropZoneProps = {
  disabled: boolean;
  onAddFiles: (files: File[], messages?: string[]) => void;
};

export function CompressionDropZone({ disabled, onAddFiles }: CompressionDropZoneProps) {
  async function handleDrop(
    event: Parameters<NonNullable<ComponentProps<typeof DropZone>["onDrop"]>>[0],
  ) {
    const selection = await collectDroppedImageFiles(event.items);
    onAddFiles(selection.files, selection.messages);
  }

  return (
    <DropZone
      isDisabled={disabled}
      onDrop={(event) => void handleDrop(event)}
      aria-label="Upload images to compress"
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          "min-h-72 w-full rounded-md border-2 border-dashed border-border bg-card p-5 transition sm:min-h-80 sm:p-7",
          isDropTarget && "border-primary bg-primary/5",
          isFocusVisible && "ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
          disabled && "opacity-60",
        )
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <LuImagePlus className="size-7" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl">Drop images here or click to browse</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          JPEG, PNG, WebP, BMP, GIF, or AVIF. Up to {MAX_FILE_COUNT} files and{" "}
          {MAX_FILE_BYTES / 1024 / 1024} MB per file. Animated images use their first frame.
        </p>
        <FileTrigger
          allowsMultiple
          acceptedFileTypes={[...SUPPORTED_IMAGE_TYPES]}
          onSelect={(files) => onAddFiles(files ? Array.from(files) : [])}
        >
          <Button variant="secondary" isDisabled={disabled} className="mt-5 h-11 px-5">
            Choose files
          </Button>
        </FileTrigger>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Processing happens locally in this browser.
        </p>
      </div>
    </DropZone>
  );
}
