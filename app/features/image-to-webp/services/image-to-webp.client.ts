import type { ConvertedImagePayload, CreateZipRequestPayload, ErrorPayload } from "../types";

export async function convertImageToWebp(file: File, quality: number) {
  const formData = new FormData();
  formData.append("intent", "convert-image");
  formData.append("quality", String(quality));
  formData.append("file", file, file.name);

  const response = await fetch("/api/image-to-webp", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ErrorPayload | null;
    throw new Error(payload?.error ?? "The conversion failed for this file.");
  }

  const blob = await response.blob();
  const encodedName = response.headers.get("X-Converted-Filename");

  return {
    dataBase64: await blobToBase64(blob),
    fileName: encodedName ? decodeURIComponent(encodedName) : file.name,
    size: blob.size,
  } satisfies ConvertedImagePayload;
}

export async function createZipBlob(files: ConvertedImagePayload[]) {
  const response = await fetch("/api/image-to-webp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "create-zip",
      convertedFiles: files.map((file) => ({
        fileName: file.fileName,
        dataBase64: file.dataBase64,
      })),
    } satisfies CreateZipRequestPayload),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ErrorPayload | null;
    throw new Error(payload?.error ?? "Could not generate the ZIP file.");
  }

  return response.blob();
}

async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}
