import type { CreateZipRequestPayload } from "@/features/image-to-webp/types";

import { WEBP_ZIP_FILENAME } from "@/features/image-to-webp/constants";
import { normalizeQuality } from "@/features/image-to-webp/utils/file";

export async function action({ request }: { request: Request }) {
  if (request.method.toUpperCase() === "GET") {
    return new Response(null, { status: 404 });
  }

  if (request.method.toUpperCase() !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");

  if (!origin || origin !== requestUrl.origin) {
    return Response.json({ error: "Only same-origin POST requests are allowed." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const { createZipArchive } =
      await import("@/features/image-to-webp/services/image-to-webp-zip.server");
    const payload = (await request.json()) as Partial<CreateZipRequestPayload>;

    if (payload.intent !== "create-zip") {
      return Response.json({ error: "Unsupported action." }, { status: 400 });
    }

    const archiveFiles = (payload.convertedFiles ?? []).flatMap((entry) => {
      if (!entry?.fileName || !entry.dataBase64) {
        return [];
      }

      try {
        return [
          {
            fileName: entry.fileName,
            data: Uint8Array.from(Buffer.from(entry.dataBase64, "base64")),
          },
        ];
      } catch {
        return [];
      }
    });

    if (archiveFiles.length === 0) {
      return Response.json(
        { error: "No converted files were available to package." },
        { status: 400 },
      );
    }

    const zipData = createZipArchive(archiveFiles);

    return new Response(zipData, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${WEBP_ZIP_FILENAME}"`,
        "Content-Length": String(zipData.byteLength),
      },
    });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");
  const file = formData.get("file");

  if (intent === "convert-image") {
    if (!(file instanceof File)) {
      return Response.json({ error: "Choose an image file to convert." }, { status: 400 });
    }

    try {
      const { convertImageFileToWebp } =
        await import("@/features/image-to-webp/services/image-to-webp.server");
      const converted = await convertImageFileToWebp(file, {
        quality: normalizeQuality(formData.get("quality")),
      });

      return new Response(converted.data, {
        status: 200,
        headers: {
          "Content-Type": converted.contentType,
          "Content-Length": String(converted.size),
          "X-Converted-Filename": encodeURIComponent(converted.fileName),
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The server could not convert this image to WebP.";

      return Response.json({ error: message }, { status: 422 });
    }
  }

  return Response.json({ error: "Unsupported action." }, { status: 400 });
}
