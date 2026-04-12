"use client";

import type { ReactNode } from "react";

import { LuDownload, LuSettings2, LuSparkles, LuZap } from "react-icons/lu";

import { Button } from "@/components/ui/Button";
import { NumberField } from "@/components/ui/NumberField";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import {
  DEFAULT_WEBP_QUALITY,
  MAX_WEBP_QUALITY,
  MIN_WEBP_QUALITY,
} from "@/utils/image-to-webp/shared";

type NoticeTone = "neutral" | "success" | "error";

type ImageToWebpSidebarProps = {
  convertedFilesCount: number;
  downloadUrl: string | null;
  failedFilesCount: number;
  filesCount: number;
  isConverting: boolean;
  isPackagingZip: boolean;
  notice: { text: string; tone: NoticeTone } | null;
  onConvert: () => void;
  onDownload: () => void;
  onQualityChange: (value: number) => void;
  progressValue: number;
  quality: number;
  supportedFilesCount: number;
  totalCount: number;
};

export function ImageToWebpSidebar({
  convertedFilesCount,
  downloadUrl,
  failedFilesCount,
  filesCount,
  isConverting,
  isPackagingZip,
  notice,
  onConvert,
  onDownload,
  onQualityChange,
  progressValue,
  quality,
  supportedFilesCount,
  totalCount,
}: ImageToWebpSidebarProps) {
  return (
    <aside className="space-y-8 xl:border-s xl:border-border/60 xl:ps-8">
      <section className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Convert and download</h2>
          </div>

          {totalCount > 0 ? (
            <ProgressBar
              label="Batch progress"
              value={progressValue}
              maxValue={totalCount}
              className="w-full"
            />
          ) : null}

          <div
            className={cn(
              "border-s-2 px-4 py-1 text-sm leading-6",
              notice?.tone === "success" &&
                "border-emerald-500 text-emerald-700 dark:text-emerald-300",
              notice?.tone === "error" && "border-destructive text-destructive",
              (!notice || notice.tone === "neutral") && "border-border text-muted-foreground",
            )}
            aria-live={notice?.tone === "error" ? "assertive" : "polite"}
          >
            {notice?.text ?? "Add files to start."}
          </div>

          <div className="grid gap-3">
            <Button
              onPress={onConvert}
              isDisabled={!supportedFilesCount || isConverting || isPackagingZip}
              isPending={isConverting || isPackagingZip}
            >
              {isPackagingZip ? "Preparing ZIP" : isConverting ? "Converting" : "Convert"}
            </Button>

            {downloadUrl ? (
              <Button
                variant="secondary"
                onPress={onDownload}
                isDisabled={isConverting || isPackagingZip}
              >
                <LuDownload aria-hidden />
                <span>Download ZIP</span>
              </Button>
            ) : null}
          </div>

          <dl className="grid gap-3 border-t border-border/60 pt-4 text-sm">
            <SummaryRow label="Selected files" value={String(filesCount)} />
            <SummaryRow label="Ready files" value={String(supportedFilesCount)} />
            <SummaryRow label="Converted files" value={String(convertedFilesCount)} />
            <SummaryRow label="Failed files" value={String(failedFilesCount)} />
            <SummaryRow
              label="Current quality"
              value={`${quality}${quality === DEFAULT_WEBP_QUALITY ? " (default)" : ""}`}
            />
          </dl>
        </div>
      </section>

      <section className="space-y-5 border-t border-border/60 pt-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <LuSettings2 className="size-4 text-primary" aria-hidden />
            Settings
          </div>
        </div>

        <div className="space-y-4">
          <NumberField
            label="Quality"
            description="1 to 100. Default 80."
            minValue={MIN_WEBP_QUALITY}
            maxValue={MAX_WEBP_QUALITY}
            value={quality}
            isDisabled={isConverting || isPackagingZip}
            onChange={(value) => {
              onQualityChange(typeof value === "number" ? value : DEFAULT_WEBP_QUALITY);
            }}
            className="[&>div]:rounded-sm"
          />

          <StatCard
            icon={<LuZap className="size-4 text-primary" aria-hidden />}
            label="Format"
            value="WebP"
            hint="Batch output"
          />
          <StatCard
            icon={<LuSparkles className="size-4 text-primary" aria-hidden />}
            label="Size"
            value="Original"
            hint="No resize"
          />
        </div>
      </section>
    </aside>
  );
}

function StatCard({
  hint,
  icon,
  label,
  value,
}: {
  hint: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-border/60 pt-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-base font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
