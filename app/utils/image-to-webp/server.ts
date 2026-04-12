import sharp from "sharp";

import { isAcceptedImageFile, toWebpFilename } from "@/utils/image-to-webp/shared";

export type ImageConversionOptions = {
  quality: number;
  resize?: {
    width?: number;
    height?: number;
  };
};

export type ConvertedWebpImage = {
  contentType: "image/webp";
  fileName: string;
  size: number;
  data: Uint8Array;
};

export async function convertImageFileToWebp(file: File, options: ImageConversionOptions) {
  if (!isAcceptedImageFile(file)) {
    throw new Error("Unsupported image format. Use png, jpg, jpeg, webp, avif, or gif.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const pipeline = sharp(input, { animated: true }).rotate();

  if (options.resize?.width || options.resize?.height) {
    pipeline.resize({
      width: options.resize.width,
      height: options.resize.height,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const data = Uint8Array.from(await pipeline.webp({ quality: options.quality }).toBuffer());

  return {
    contentType: "image/webp" as const,
    fileName: toWebpFilename(file.name),
    size: data.byteLength,
    data,
  } satisfies ConvertedWebpImage;
}
