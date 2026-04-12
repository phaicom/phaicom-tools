"use client";

import type { ComponentProps } from "react";

import { FileTrigger } from "react-aria-components";
import { LuFolderUp, LuImages } from "react-icons/lu";

import { Button } from "@/shared/components/ui/Button";
import { DropZone } from "@/shared/components/ui/DropZone";
import { cn } from "@/shared/utils/cn";

import type { ImageFileSelection } from "../types";

import { ACCEPTED_IMAGE_EXTENSIONS } from "../constants";
import { collectDroppedImageFiles, createImageFileSelection } from "../utils/fileSelection";

type ImageDropZoneProps = {
  disabled?: boolean;
  onAddFiles: (result: ImageFileSelection) => void;
};

export function ImageDropZone({ disabled = false, onAddFiles }: ImageDropZoneProps) {
  async function handleDrop(
    event: Parameters<NonNullable<ComponentProps<typeof DropZone>["onDrop"]>>[0],
  ) {
    onAddFiles(await collectDroppedImageFiles(event.items));
  }

  function handleSelect(files: FileList | null) {
    onAddFiles(createImageFileSelection(files));
  }

  return (
    <DropZone
      onDrop={(event) => void handleDrop(event)}
      isDisabled={disabled}
      aria-label="Upload images to convert to WebP"
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          "min-h-68 w-full rounded-sm border border-dashed border-border/70 bg-background p-6 text-left transition md:p-7",
          isDropTarget && "border-primary/60 bg-primary/4",
          isFocusVisible && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
          disabled && "opacity-70",
        )
      }
    >
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-secondary text-primary">
              <LuImages className="size-6" aria-hidden />
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">Drop images here</h2>
                <div className="max-w-2xl space-y-2 text-sm leading-6 text-muted-foreground">
                  <p>Drop images or click to upload.</p>
                  <p className="text-xs font-medium tracking-[0.18em] uppercase">
                    Supports {ACCEPTED_IMAGE_EXTENSIONS.join("  ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FileTrigger
            allowsMultiple
            acceptedFileTypes={[...ACCEPTED_IMAGE_EXTENSIONS]}
            onSelect={handleSelect}
          >
            <Button variant="secondary" isDisabled={disabled}>
              <LuFolderUp aria-hidden />
              <span>Browse Files</span>
            </Button>
          </FileTrigger>
        </div>

        <div className="border-t border-border/60 pt-4 text-sm text-muted-foreground">
          Keyboard-friendly upload is available through the browse button, and the drop zone
          announces drag state for assistive tech.
        </div>
      </div>
    </DropZone>
  );
}
