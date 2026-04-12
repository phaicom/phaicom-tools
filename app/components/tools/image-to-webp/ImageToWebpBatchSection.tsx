"use client";

import { LuRefreshCw } from "react-icons/lu";

import {
  SelectedFilesTable,
  type ImageBatchItem,
} from "@/components/tools/image-to-webp/SelectedFilesTable";
import { Button } from "@/components/ui/Button";

type ImageToWebpBatchSectionProps = {
  files: ImageBatchItem[];
  hasFiles: boolean;
  isConverting: boolean;
  isPackagingZip: boolean;
  onResetStatuses: () => void;
  resettableResultsCount: number;
  supportedFilesCount: number;
  unsupportedCount: number;
};

export function ImageToWebpBatchSection({
  files,
  hasFiles,
  isConverting,
  isPackagingZip,
  onResetStatuses,
  resettableResultsCount,
  supportedFilesCount,
  unsupportedCount,
}: ImageToWebpBatchSectionProps) {
  if (!hasFiles) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 border-t border-border/70 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Batch files</h2>
          <p className="text-sm text-muted-foreground">
            {files.length} files, {supportedFilesCount} ready
            {unsupportedCount > 0 ? `, ${unsupportedCount} unsupported` : ""}.
          </p>
        </div>

        <Button
          variant="quiet"
          onPress={onResetStatuses}
          isDisabled={isConverting || isPackagingZip || resettableResultsCount === 0}
        >
          <LuRefreshCw aria-hidden />
          <span>Reset statuses</span>
        </Button>
      </div>

      <SelectedFilesTable items={files} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-t border-border/70 pt-6">
      <h2 className="text-lg font-semibold tracking-tight">No files yet</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Drop images to start.
      </p>
    </div>
  );
}
