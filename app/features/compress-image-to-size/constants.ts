import type { CompressionFormat, ResizeStrategy } from "./types";

export const MAX_FILE_COUNT = 10;
export const MAX_FILE_BYTES = 30 * 1024 * 1024;
export const DEFAULT_TARGET_BYTES = 200 * 1024;
export const MIN_LONG_EDGE = 64;
export const MIN_QUALITY = 0.2;
export const MAX_QUALITY = 0.95;
export const QUALITY_SEARCH_ITERATIONS = 10;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/gif",
  "image/avif",
] as const;

export const SUPPORTED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".gif",
  ".avif",
] as const;

export const FORMAT_DETAILS: Record<CompressionFormat, { label: string; description: string }> = {
  jpeg: {
    label: "JPEG",
    description: "Best for photographs and strict size limits. Transparent pixels become white.",
  },
  webp: {
    label: "WebP",
    description: "Modern, efficient compression with support for transparent pixels.",
  },
  png: {
    label: "PNG",
    description: "Lossless output. Reaching a small target may require reducing dimensions.",
  },
};

export const RESIZE_DETAILS: Array<{
  description: string;
  label: string;
  value: ResizeStrategy;
}> = [
  {
    value: "auto",
    label: "Auto shrink to fit",
    description: "Reduce quality first, then dimensions only when necessary.",
  },
  {
    value: "original",
    label: "Keep original size",
    description: "Never resize. Very small targets may not be reachable.",
  },
  { value: "max-1920", label: "Max 1920px", description: "Cap the longest edge at 1920px." },
  { value: "max-1280", label: "Max 1280px", description: "Cap the longest edge at 1280px." },
  { value: "max-800", label: "Max 800px", description: "Cap the longest edge at 800px." },
  { value: "max-400", label: "Max 400px", description: "Cap the longest edge at 400px." },
];
