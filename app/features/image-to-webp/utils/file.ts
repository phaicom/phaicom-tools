import type { AcceptedImageMimeType } from "../types";

import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_MIME_TYPES,
  DEFAULT_WEBP_QUALITY,
  MAX_WEBP_QUALITY,
  MIN_WEBP_QUALITY,
} from "../constants";

export function getFileFingerprint(file: Pick<File, "name" | "size" | "lastModified" | "type">) {
  return [file.name, file.size, file.lastModified, file.type].join(":");
}

export function isAcceptedImageFile(file: Pick<File, "name" | "type">) {
  const normalizedType = file.type.toLowerCase();

  if (ACCEPTED_IMAGE_MIME_TYPES.includes(normalizedType as AcceptedImageMimeType)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

export function normalizeQuality(value: FormDataEntryValue | number | null | undefined) {
  const numericValue =
    typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return DEFAULT_WEBP_QUALITY;
  }

  return Math.min(MAX_WEBP_QUALITY, Math.max(MIN_WEBP_QUALITY, Math.round(numericValue)));
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 1024) {
    return `${bytes || 0} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = value >= 10 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

export function formatSizeDelta(originalBytes: number, convertedBytes: number) {
  const delta = convertedBytes - originalBytes;
  const absoluteDelta = Math.abs(delta);
  const percentDelta = originalBytes > 0 ? (absoluteDelta / originalBytes) * 100 : 0;

  if (delta === 0) {
    return {
      tone: "neutral" as const,
      text: "No size change",
    };
  }

  return {
    tone: delta < 0 ? ("better" as const) : ("worse" as const),
    text: `${delta < 0 ? "-" : "+"}${formatFileSize(absoluteDelta)} (${percentDelta.toFixed(
      percentDelta >= 10 ? 0 : 1,
    )}%)`,
  };
}

export function toWebpFilename(fileName: string) {
  const normalized = fileName.trim();
  const baseName = normalized.includes(".") ? normalized.replace(/\.[^.]+$/, "") : normalized;
  return `${baseName || "converted-image"}.webp`;
}
