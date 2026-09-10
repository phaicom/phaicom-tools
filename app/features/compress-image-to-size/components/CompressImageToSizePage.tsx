import { useMemo, useState } from "react";
import { LuArrowRight, LuLoaderCircle, LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router";

import { formatFileSize } from "@/features/image-to-webp/utils/file";
import { PageIntro } from "@/shared/components/content/PageIntro";
import { ToolCard } from "@/shared/components/tools/ToolCard";
import { Button } from "@/shared/components/ui/Button";
import { tools } from "@/shared/data/tools";

import type { CompressionFormat, CompressionOptions, ResizeStrategy } from "../types";

import { DEFAULT_TARGET_BYTES } from "../constants";
import { useCompressImageToSize } from "../hooks/useCompressImageToSize";
import { parseTargetBytes } from "../utils/compression";
import { CompressionDropZone } from "./CompressionDropZone";
import { CompressionResults } from "./CompressionResults";
import { CompressionSettings, type TargetOption, type TargetUnit } from "./CompressionSettings";

export function CompressImageToSizePage() {
  const [targetOption, setTargetOption] = useState<TargetOption>(200);
  const [customValue, setCustomValue] = useState("350");
  const [customUnit, setCustomUnit] = useState<TargetUnit>("KB");
  const [format, setFormat] = useState<CompressionFormat>("jpeg");
  const [resizeStrategy, setResizeStrategy] = useState<ResizeStrategy>("auto");

  const parsedCustomBytes = parseTargetBytes(customValue, customUnit);
  const customError =
    targetOption === "custom" && parsedCustomBytes === null
      ? "Enter a target greater than zero."
      : null;
  const targetBytes =
    targetOption === "custom" ? (customError ? 0 : (parsedCustomBytes ?? 0)) : targetOption * 1024;
  const targetLabel = formatFileSize(targetBytes || DEFAULT_TARGET_BYTES);
  const options = useMemo<CompressionOptions>(
    () => ({ format, resizeStrategy, targetBytes }),
    [format, resizeStrategy, targetBytes],
  );
  const settingsKey = [targetBytes, format, resizeStrategy].join(":");
  const compressor = useCompressImageToSize(options, settingsKey);
  const canCompress = compressor.items.length > 0 && !customError && !compressor.isProcessing;
  const relatedTools = tools
    .filter((tool) => tool.category === "Images" && tool.path !== "/tools/compress-image-to-size")
    .slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:py-10 md:px-6 xl:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link to="/" className="text-muted-foreground no-underline hover:text-primary">
          Home
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden="true" />
        <Link to="/tools" className="text-muted-foreground no-underline hover:text-primary">
          Tools
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden="true" />
        <Link
          to="/tools?category=Images"
          className="text-muted-foreground no-underline hover:text-primary"
        >
          Image tools
        </Link>
        <LuArrowRight className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground">Compress Image to Size</span>
      </nav>

      <div className="mt-7">
        <PageIntro
          category="Image Tools"
          title="Compress Image to Size"
          description="Set an exact size limit, then automatically optimize JPG, PNG, WebP, BMP, GIF, or AVIF images to fit it whenever technically possible."
        />
      </div>

      <div className="mt-9 space-y-7">
        <CompressionSettings
          customError={customError}
          customUnit={customUnit}
          customValue={customValue}
          disabled={compressor.isProcessing}
          format={format}
          onCustomUnitChange={setCustomUnit}
          onCustomValueChange={setCustomValue}
          onFormatChange={setFormat}
          onResizeStrategyChange={setResizeStrategy}
          onTargetChange={setTargetOption}
          resizeStrategy={resizeStrategy}
          targetLabel={targetLabel}
          targetOption={targetOption}
        />

        <CompressionDropZone disabled={compressor.isProcessing} onAddFiles={compressor.addFiles} />

        <section
          className="border border-border bg-card p-4 sm:p-5"
          aria-label="Compression actions"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {compressor.items.length} of 10 files selected
              </p>
              <p className="mt-1 text-sm break-words text-muted-foreground" aria-live="polite">
                {compressor.progressMessage || compressor.notice}
              </p>
            </div>
            <div className="shrink-0">
              <Button
                onPress={() => void compressor.compressAll()}
                isDisabled={!canCompress}
                isPending={compressor.isProcessing}
                className="h-11 min-w-40"
              >
                {compressor.isProcessing ? (
                  <LuLoaderCircle className="animate-spin" aria-hidden="true" />
                ) : null}
                {compressor.isProcessing ? "Optimizing" : "Compress images"}
              </Button>
            </div>
          </div>
        </section>

        <CompressionResults
          isProcessing={compressor.isProcessing}
          items={compressor.items}
          onDownload={compressor.downloadResult}
          onDownloadAll={compressor.downloadAll}
          onRemove={compressor.removeFile}
          progressMessage={compressor.progressMessage}
        />
      </div>

      <div className="mt-14 grid gap-6 border-t border-border pt-10 lg:grid-cols-2">
        <ContentSection title="How to use">
          <ol className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground">
            {[
              "Choose a preset target or enter a custom value in KB or MB.",
              "Pick JPEG, WebP, or PNG and decide whether dimensions may change.",
              "Add up to ten images using the chooser or drag and drop.",
              "Run the optimizer. Each image is processed separately in your browser.",
              "Review the exact size, dimensions, quality, and target status, then download.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </ContentSection>

        <ContentSection title="About target-size optimization">
          <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              Ordinary compressors ask you to guess a quality value. This tool instead searches for
              the highest JPEG or WebP quality that stays inside your selected byte limit.
            </p>
            <p>
              In automatic mode, dimensions are reduced only when quality adjustment is not enough.
              PNG remains lossless, so dimension changes are the only reliable way to lower its
              size.
            </p>
            <p className="flex gap-2 font-medium text-foreground">
              <LuShieldCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              Images remain on your device; compression and ZIP creation both run locally.
            </p>
          </div>
        </ContentSection>
      </div>

      {relatedTools.length ? (
        <section className="mt-14 border-t border-border pt-10">
          <p className="text-sm font-semibold text-primary">More image tools</p>
          <h2 className="mt-2 text-xl">Related tools</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ContentSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="border border-border bg-card p-5 sm:p-6">
      <h2 className="text-xl">{title}</h2>
      {children}
    </section>
  );
}
