import type {
  CompressionFormat,
  CompressionOptions,
  CompressionResult,
  ResizeStrategy,
} from "../types";

import { MAX_QUALITY, MIN_LONG_EDGE, MIN_QUALITY, QUALITY_SEARCH_ITERATIONS } from "../constants";

type DecodedImage = {
  close: () => void;
  height: number;
  source: CanvasImageSource;
  width: number;
};

type EncodedCandidate = {
  blob: Blob;
  quality: number | null;
};

const mimeTypes: Record<CompressionFormat, string> = {
  jpeg: "image/jpeg",
  webp: "image/webp",
  png: "image/png",
};

const extensions: Record<CompressionFormat, string> = {
  jpeg: "jpg",
  webp: "webp",
  png: "png",
};

export function getOutputMimeType(format: CompressionFormat) {
  return mimeTypes[format];
}

export function getCompressedFileName(fileName: string, format: CompressionFormat) {
  const trimmed = fileName.trim();
  const base = trimmed.includes(".") ? trimmed.replace(/\.[^.]+$/, "") : trimmed;
  return `${base || "image"}-compressed.${extensions[format]}`;
}

export function getDimensionCap(strategy: ResizeStrategy) {
  if (!strategy.startsWith("max-")) return null;
  const value = Number(strategy.slice(4));
  return Number.isFinite(value) ? value : null;
}

export function constrainDimensions(width: number, height: number, maxLongEdge: number | null) {
  if (!maxLongEdge || Math.max(width, height) <= maxLongEdge) {
    return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
  }

  const scale = maxLongEdge / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function calculateSavedPercent(originalBytes: number, outputBytes: number) {
  if (originalBytes <= 0) return 0;
  return Math.max(-999, Math.min(100, ((originalBytes - outputBytes) / originalBytes) * 100));
}

export function parseTargetBytes(value: string, unit: "KB" | "MB") {
  const numeric = Number(value);
  if (!value.trim() || !Number.isFinite(numeric) || numeric <= 0) return null;
  return Math.round(numeric * (unit === "MB" ? 1024 * 1024 : 1024));
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall through to the broadly supported HTMLImageElement decoder.
    }
  }

  const url = URL.createObjectURL(file);
  const image = new Image();

  try {
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error(
      "This browser could not decode the image. The file may be damaged or unsupported.",
    );
  }
}

function renderCanvas(
  image: CanvasImageSource,
  width: number,
  height: number,
  format: CompressionFormat,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: format !== "jpeg" });

  if (!context) throw new Error("The browser could not create an image canvas.");

  if (format === "jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

export function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: CompressionFormat,
  quality?: number,
) {
  const mimeType = getOutputMimeType(format);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The browser could not encode this image."));
          return;
        }

        if (format !== "png" && blob.type !== mimeType) {
          reject(new Error(`${format.toUpperCase()} output is not supported by this browser.`));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

async function searchHighestQuality(
  canvas: HTMLCanvasElement,
  format: "jpeg" | "webp",
  target: number,
) {
  const minimumBlob = await encodeCanvas(canvas, format, MIN_QUALITY);
  let smallest: EncodedCandidate = { blob: minimumBlob, quality: MIN_QUALITY };

  if (minimumBlob.size > target) return { bestFit: null, smallest };

  const maximumBlob = await encodeCanvas(canvas, format, MAX_QUALITY);
  if (maximumBlob.size <= target) {
    return {
      bestFit: { blob: maximumBlob, quality: MAX_QUALITY } satisfies EncodedCandidate,
      smallest,
    };
  }

  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  let bestFit: EncodedCandidate = smallest;

  for (let iteration = 0; iteration < QUALITY_SEARCH_ITERATIONS; iteration += 1) {
    const quality = (low + high) / 2;
    const blob = await encodeCanvas(canvas, format, quality);

    if (blob.size < smallest.blob.size) smallest = { blob, quality };

    if (blob.size <= target) {
      bestFit = { blob, quality };
      low = quality;
    } else {
      high = quality;
    }
  }

  return { bestFit, smallest };
}

function nextDimensions(width: number, height: number) {
  return {
    width: Math.max(1, Math.floor(width * 0.85)),
    height: Math.max(1, Math.floor(height * 0.85)),
  };
}

function yieldToBrowser() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

export async function compressImageToSize(
  file: File,
  options: CompressionOptions,
  onProgress?: (message: string) => void,
): Promise<CompressionResult> {
  if (!Number.isFinite(options.targetBytes) || options.targetBytes <= 0) {
    throw new Error("Choose a target size greater than zero.");
  }

  const decoded = await decodeImage(file);

  if (!decoded.width || !decoded.height) {
    decoded.close();
    throw new Error("The image has invalid dimensions.");
  }

  try {
    const cap = getDimensionCap(options.resizeStrategy);
    let dimensions = constrainDimensions(decoded.width, decoded.height, cap);
    let resizePasses =
      dimensions.width === decoded.width && dimensions.height === decoded.height ? 0 : 1;
    while (true) {
      onProgress?.(
        resizePasses === 0
          ? "Optimizing quality…"
          : `Optimizing at ${dimensions.width} × ${dimensions.height}…`,
      );
      const canvas = renderCanvas(
        decoded.source,
        dimensions.width,
        dimensions.height,
        options.format,
      );
      let candidate: EncodedCandidate;
      let fitsTarget = false;

      if (options.format === "png") {
        const blob = await encodeCanvas(canvas, "png");
        candidate = { blob, quality: null };
        fitsTarget = blob.size <= options.targetBytes;
      } else {
        const search = await searchHighestQuality(canvas, options.format, options.targetBytes);
        candidate = search.bestFit ?? search.smallest;
        fitsTarget = search.bestFit !== null;
      }

      canvas.width = 1;
      canvas.height = 1;

      if (fitsTarget) {
        return createResult(file, options, decoded, dimensions, candidate, resizePasses, true);
      }

      const canAutoResize =
        options.resizeStrategy === "auto" &&
        Math.max(dimensions.width, dimensions.height) > MIN_LONG_EDGE;

      if (!canAutoResize) {
        return createResult(file, options, decoded, dimensions, candidate, resizePasses, false);
      }

      const next = nextDimensions(dimensions.width, dimensions.height);
      if (Math.max(next.width, next.height) < MIN_LONG_EDGE) {
        const scale = MIN_LONG_EDGE / Math.max(dimensions.width, dimensions.height);
        dimensions = {
          width: Math.max(1, Math.round(dimensions.width * scale)),
          height: Math.max(1, Math.round(dimensions.height * scale)),
        };
      } else {
        dimensions = next;
      }
      resizePasses += 1;
      await yieldToBrowser();

      if (Math.max(dimensions.width, dimensions.height) === MIN_LONG_EDGE) {
        const canvasAtFloor = renderCanvas(
          decoded.source,
          dimensions.width,
          dimensions.height,
          options.format,
        );
        const floorCandidate =
          options.format === "png"
            ? { blob: await encodeCanvas(canvasAtFloor, "png"), quality: null }
            : (await searchHighestQuality(canvasAtFloor, options.format, options.targetBytes))
                .smallest;
        canvasAtFloor.width = 1;
        canvasAtFloor.height = 1;
        const fits = floorCandidate.blob.size <= options.targetBytes;
        return createResult(file, options, decoded, dimensions, floorCandidate, resizePasses, fits);
      }
    }
  } finally {
    decoded.close();
  }
}

function createResult(
  file: File,
  options: CompressionOptions,
  decoded: Pick<DecodedImage, "width" | "height">,
  dimensions: { width: number; height: number },
  candidate: EncodedCandidate,
  resizePasses: number,
  fitsTarget: boolean,
): CompressionResult {
  return {
    fileName: getCompressedFileName(file.name, options.format),
    finalQuality: candidate.quality,
    fitsTarget,
    format: options.format,
    originalBytes: file.size,
    originalHeight: decoded.height,
    originalWidth: decoded.width,
    outputBlob: candidate.blob,
    outputBytes: candidate.blob.size,
    outputHeight: dimensions.height,
    outputWidth: dimensions.width,
    resizePasses,
    targetBytes: options.targetBytes,
  };
}
