export type CompressionFormat = "jpeg" | "webp" | "png";

export type ResizeStrategy = "auto" | "original" | "max-1920" | "max-1280" | "max-800" | "max-400";

export type CompressionOptions = {
  format: CompressionFormat;
  resizeStrategy: ResizeStrategy;
  targetBytes: number;
};

export type CompressionResult = {
  fileName: string;
  finalQuality: number | null;
  fitsTarget: boolean;
  format: CompressionFormat;
  originalBytes: number;
  originalHeight: number;
  originalWidth: number;
  outputBlob: Blob;
  outputBytes: number;
  outputHeight: number;
  outputWidth: number;
  resizePasses: number;
  targetBytes: number;
};

export type CompressionFileStatus = "queued" | "processing" | "done" | "error";

export type CompressionFileItem = {
  error?: string;
  file: File;
  id: string;
  outputUrl?: string;
  previewUrl: string;
  result?: CompressionResult;
  status: CompressionFileStatus;
};
