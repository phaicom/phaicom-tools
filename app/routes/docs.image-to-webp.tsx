import { useEffect, useMemo, useRef, useState } from "react";

import { ImageDropZone } from "@/components/tools/image-to-webp/ImageDropZone";
import { ImageToWebpBatchSection } from "@/components/tools/image-to-webp/ImageToWebpBatchSection";
import { ImageToWebpPageHeader } from "@/components/tools/image-to-webp/ImageToWebpPageHeader";
import { ImageToWebpSidebar } from "@/components/tools/image-to-webp/ImageToWebpSidebar";
import { type ImageBatchItem } from "@/components/tools/image-to-webp/SelectedFilesTable";
import {
  DEFAULT_WEBP_QUALITY,
  WEBP_ZIP_FILENAME,
  getFileFingerprint,
  isAcceptedImageFile,
} from "@/utils/image-to-webp/shared";

export const handle = {
  docsNav: {
    title: "Image to WebP",
    order: 20,
  },
};

export function meta() {
  return [
    { title: "Image to WebP | Phaicom Tools" },
    {
      name: "description",
      content: "Convert batches of images into WebP files with server-side sharp processing.",
    },
  ];
}

type BatchFileStatus = ImageBatchItem["status"];

type BatchFile = ImageBatchItem & {
  file: File;
};

type BatchTone = "neutral" | "success" | "error";

type BatchNotice = {
  text: string;
  tone: BatchTone;
};

type ErrorPayload = {
  error?: string;
};

type ConvertedImagePayload = {
  dataBase64: string;
  fileName: string;
  size: number;
};

type CreateZipRequestPayload = {
  convertedFiles: Array<Pick<ConvertedImagePayload, "dataBase64" | "fileName">>;
  intent: "create-zip";
};

export default function ImageToWebpDocsPage() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [quality, setQuality] = useState(DEFAULT_WEBP_QUALITY);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [isPackagingZip, setIsPackagingZip] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<BatchNotice | null>(null);
  const downloadUrlRef = useRef<string | null>(null);
  const runIdRef = useRef(0);

  const supportedFiles = useMemo(
    () => files.filter((file) => file.status !== "unsupported"),
    [files],
  );
  const convertedFiles = useMemo(() => files.filter((file) => file.status === "done"), [files]);
  const failedFiles = useMemo(() => files.filter((file) => file.status === "error"), [files]);

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  function replaceDownloadUrl(nextUrl: string | null) {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
    }

    downloadUrlRef.current = nextUrl;
    setDownloadUrl(nextUrl);
  }

  function resetBatchRun() {
    replaceDownloadUrl(null);
    setCompletedCount(0);
    setTotalCount(0);
  }

  function markFilesQueued(currentFiles: BatchFile[]) {
    return currentFiles.map((file) =>
      file.status === "unsupported"
        ? file
        : {
            ...file,
            status: "queued" as BatchFileStatus,
            errorMessage: undefined,
            convertedSize: undefined,
          },
    );
  }

  function invalidateCompletedResults() {
    setFiles((currentFiles) => markFilesQueued(currentFiles));
    resetBatchRun();
    setNotice(null);
  }

  function updateFileStatus(id: string, updater: (file: BatchFile) => BatchFile) {
    setFiles((currentFiles) => currentFiles.map((file) => (file.id === id ? updater(file) : file)));
  }

  function addFiles(incomingFiles: File[], messages: string[]) {
    if (incomingFiles.length === 0) {
      if (messages.length > 0) {
        setNotice({ tone: "neutral", text: messages.join(" ") });
      }

      return;
    }

    setFiles((currentFiles) => {
      const existingIds = new Set(currentFiles.map((file) => file.id));
      const nextFiles = [...currentFiles];
      let duplicateCount = 0;
      let addedCount = 0;

      for (const file of incomingFiles) {
        const id = getFileFingerprint(file);

        if (existingIds.has(id)) {
          duplicateCount += 1;
          continue;
        }

        existingIds.add(id);
        addedCount += 1;
        const isSupported = isAcceptedImageFile(file);

        nextFiles.push({
          id,
          file,
          name: file.name,
          size: file.size,
          status: isSupported ? "queued" : "unsupported",
          errorMessage: isSupported
            ? undefined
            : "Unsupported format. Use png, jpg, jpeg, webp, avif, or gif.",
        });
      }

      const allMessages = [...messages];

      if (duplicateCount > 0) {
        allMessages.push(
          `${duplicateCount} duplicate ${duplicateCount === 1 ? "file was" : "files were"} skipped.`,
        );
      }

      if (allMessages.length > 0) {
        setNotice({ tone: "neutral", text: allMessages.join(" ") });
      } else {
        setNotice(null);
      }

      if (addedCount === 0) {
        return currentFiles;
      }

      const normalizedFiles = markFilesQueued(nextFiles);
      resetBatchRun();
      return normalizedFiles;
    });
  }

  async function handleConvert() {
    if (isConverting || isPackagingZip) {
      return;
    }

    const queuedFiles = files.filter((file) => file.status !== "unsupported");

    if (queuedFiles.length === 0) {
      setNotice({
        tone: "error",
        text: "Add at least one supported image before starting a conversion run.",
      });
      return;
    }

    runIdRef.current += 1;
    const runId = runIdRef.current;
    const normalizedFiles = markFilesQueued(files);
    const filesToConvert = normalizedFiles.filter((file) => file.status !== "unsupported");
    const convertedAssets: ConvertedImagePayload[] = [];
    let failureCount = 0;

    setFiles(normalizedFiles);
    replaceDownloadUrl(null);
    setCompletedCount(0);
    setTotalCount(filesToConvert.length);
    setNotice({
      tone: "neutral",
      text: `Converting ${filesToConvert.length} ${filesToConvert.length === 1 ? "image" : "images"} to WebP.`,
    });
    setIsConverting(true);

    let processedCount = 0;

    for (const file of filesToConvert) {
      if (runIdRef.current !== runId) {
        return;
      }

      updateFileStatus(file.id, (currentFile) => ({
        ...currentFile,
        status: "converting",
        errorMessage: undefined,
        convertedSize: undefined,
      }));

      try {
        const formData = new FormData();
        formData.append("intent", "convert-image");
        formData.append("quality", String(quality));
        formData.append("file", file.file, file.name);

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
        const convertedName = encodedName ? decodeURIComponent(encodedName) : file.name;
        const convertedAsset = {
          dataBase64: await blobToBase64(blob),
          fileName: convertedName,
          size: blob.size,
        } satisfies ConvertedImagePayload;

        convertedAssets.push(convertedAsset);

        updateFileStatus(file.id, (currentFile) => ({
          ...currentFile,
          status: "done",
          convertedSize: convertedAsset.size,
          errorMessage: undefined,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "The conversion failed for this file.";
        failureCount += 1;

        updateFileStatus(file.id, (currentFile) => ({
          ...currentFile,
          status: "error",
          errorMessage: message,
          convertedSize: undefined,
        }));
      }

      processedCount += 1;
      setCompletedCount(processedCount);
    }

    setIsConverting(false);

    if (runIdRef.current !== runId) {
      return;
    }

    if (convertedAssets.length === 0) {
      setNotice({
        tone: "error",
        text: "No files were converted. Review the per-file errors and try again.",
      });
      return;
    }

    setIsPackagingZip(true);
    setNotice({
      tone: "neutral",
      text: `Converted ${convertedAssets.length} ${convertedAssets.length === 1 ? "image" : "images"}. Preparing ZIP…`,
    });

    try {
      const zipBlob = await createZipBlob(convertedAssets);

      if (runIdRef.current !== runId) {
        return;
      }

      replaceDownloadUrl(URL.createObjectURL(zipBlob));
      setNotice({
        tone: failureCount > 0 ? "neutral" : "success",
        text:
          failureCount > 0
            ? `ZIP is ready with ${convertedAssets.length} converted files. ${failureCount} ${failureCount === 1 ? "file failed" : "files failed"} during conversion.`
            : `ZIP is ready with ${convertedAssets.length} converted ${convertedAssets.length === 1 ? "image" : "images"}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate the ZIP file.";

      setNotice({
        tone: "error",
        text: message,
      });
    } finally {
      setIsPackagingZip(false);
    }
  }

  function handleDownload() {
    if (!downloadUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = WEBP_ZIP_FILENAME;
    anchor.click();
  }

  const progressValue = totalCount > 0 ? completedCount : 0;
  const hasFiles = files.length > 0;
  const unsupportedCount = files.length - supportedFiles.length;

  return (
    <div className="space-y-8">
      <ImageToWebpPageHeader />

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          <ImageDropZone
            disabled={isConverting || isPackagingZip}
            onAddFiles={({ files, messages }) => addFiles(files, messages)}
          />

          <ImageToWebpBatchSection
            files={files}
            hasFiles={hasFiles}
            isConverting={isConverting}
            isPackagingZip={isPackagingZip}
            onResetStatuses={invalidateCompletedResults}
            resettableResultsCount={convertedFiles.length + failedFiles.length}
            supportedFilesCount={supportedFiles.length}
            unsupportedCount={unsupportedCount}
          />
        </div>

        <ImageToWebpSidebar
          convertedFilesCount={convertedFiles.length}
          downloadUrl={downloadUrl}
          failedFilesCount={failedFiles.length}
          filesCount={files.length}
          isConverting={isConverting}
          isPackagingZip={isPackagingZip}
          notice={notice}
          onConvert={() => void handleConvert()}
          onDownload={handleDownload}
          onQualityChange={(value) => {
            setQuality(value);
            invalidateCompletedResults();
          }}
          progressValue={progressValue}
          quality={quality}
          supportedFilesCount={supportedFiles.length}
          totalCount={totalCount}
        />
      </section>
    </div>
  );
}

async function createZipBlob(files: ConvertedImagePayload[]) {
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
