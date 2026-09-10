import { LuDownload, LuTrash2 } from "react-icons/lu";

import { formatFileSize } from "@/features/image-to-webp/utils/file";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/utils/cn";

import type { CompressionFileItem } from "../types";

import { calculateSavedPercent } from "../utils/compression";

type CompressionResultsProps = {
  isProcessing: boolean;
  items: CompressionFileItem[];
  onDownload: (item: CompressionFileItem) => void;
  onDownloadAll: () => void;
  onRemove: (id: string) => void;
  progressMessage: string;
};

export function CompressionResults(props: CompressionResultsProps) {
  const { isProcessing, items, onDownload, onDownloadAll, onRemove, progressMessage } = props;
  const completedCount = items.filter((item) => item.result).length;

  return (
    <section aria-labelledby="compression-output">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Results</p>
          <h2 id="compression-output" className="mt-2 text-xl">
            Output
          </h2>
        </div>
        {completedCount > 1 ? (
          <Button variant="secondary" onPress={onDownloadAll}>
            <LuDownload aria-hidden="true" />
            Download all
          </Button>
        ) : null}
      </div>

      <div className="sr-only" aria-live="polite">
        {progressMessage}
      </div>

      {items.length === 0 ? (
        <div className="mt-4 border border-dashed border-border bg-card px-5 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Select a target size and add one or more images to begin.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {items.map((item) => (
            <ResultCard
              key={item.id}
              item={item}
              isProcessing={isProcessing}
              onDownload={() => onDownload(item)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ResultCard({
  isProcessing,
  item,
  onDownload,
  onRemove,
}: {
  isProcessing: boolean;
  item: CompressionFileItem;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const result = item.result;
  const saved = result ? calculateSavedPercent(result.originalBytes, result.outputBytes) : 0;

  return (
    <article className="min-w-0 border border-border bg-card p-4 sm:p-5">
      <div className="grid min-w-0 gap-5 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="aspect-square overflow-hidden rounded-md border border-border bg-secondary">
          <img
            src={item.outputUrl ?? item.previewUrl}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-base" title={item.file.name}>
                {item.file.name}
              </h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  item.status === "error" ? "text-destructive" : "text-muted-foreground",
                )}
                aria-live="polite"
              >
                {item.status === "queued" && "Ready to optimize"}
                {item.status === "processing" && "Optimizing…"}
                {item.status === "done" &&
                  (result?.fitsTarget
                    ? "Compression complete"
                    : "Target could not be reached with this resize strategy.")}
                {item.status === "error" && item.error}
              </p>
            </div>
            {result ? (
              <span
                className={cn(
                  "w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
                  result.fitsTarget
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                )}
              >
                {result.fitsTarget ? "Fits target" : "Did not fit"}
              </span>
            ) : null}
          </div>

          {result ? (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:grid-cols-3 xl:grid-cols-6">
              <Stat label="Original" value={formatFileSize(result.originalBytes)} />
              <Stat label="Output" value={formatFileSize(result.outputBytes)} />
              <Stat
                label="Saved"
                value={
                  saved >= 0
                    ? `${saved.toFixed(saved >= 10 ? 0 : 1)}% smaller`
                    : `${Math.abs(saved).toFixed(0)}% larger`
                }
              />
              <Stat
                label="Dimensions"
                value={`${result.outputWidth} × ${result.outputHeight}`}
                hint={`from ${result.originalWidth} × ${result.originalHeight}`}
              />
              <Stat
                label="Quality"
                value={
                  result.finalQuality === null
                    ? "Lossless"
                    : `${Math.round(result.finalQuality * 100)}%`
                }
              />
              <Stat label="Resize passes" value={String(result.resizePasses)} />
            </dl>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 min-[380px]:flex-row">
            {result ? (
              <Button onPress={onDownload} className="min-[380px]:min-w-32">
                <LuDownload aria-hidden="true" />
                Download
              </Button>
            ) : null}
            <Button
              variant="quiet"
              onPress={onRemove}
              isDisabled={isProcessing}
              className="min-[380px]:min-w-28"
            >
              <LuTrash2 aria-hidden="true" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({ hint, label, value }: { hint?: string; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold break-words text-foreground">{value}</dd>
      {hint ? <dd className="mt-0.5 text-xs break-words text-muted-foreground">{hint}</dd> : null}
    </div>
  );
}
