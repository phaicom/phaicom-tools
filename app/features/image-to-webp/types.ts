import { ACCEPTED_IMAGE_MIME_TYPES } from "./constants";

export type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number];

export type BatchFileStatus = "queued" | "converting" | "done" | "error" | "unsupported";
export type BatchNoticeTone = "neutral" | "success" | "error";

export type BatchNotice = {
  text: string;
  tone: BatchNoticeTone;
};

export type ImageBatchItem = {
  convertedSize?: number;
  errorMessage?: string;
  id: string;
  name: string;
  size: number;
  status: BatchFileStatus;
};

export type BatchFile = ImageBatchItem & {
  file: File;
};

export type ErrorPayload = {
  error?: string;
};

export type ConvertedImagePayload = {
  dataBase64: string;
  fileName: string;
  size: number;
};

export type CreateZipRequestPayload = {
  convertedFiles: Array<Pick<ConvertedImagePayload, "dataBase64" | "fileName">>;
  intent: "create-zip";
};
