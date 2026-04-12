export const DEFAULT_WEBP_QUALITY = 80;
export const MIN_WEBP_QUALITY = 1;
export const MAX_WEBP_QUALITY = 100;
export const WEBP_ZIP_FILENAME = "converted-webp-images.zip";

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
] as const;
