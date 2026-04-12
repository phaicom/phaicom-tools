import { useEffect, useMemo, useRef, useState } from "react";

import type { BatchFile, BatchFileStatus, BatchNotice, ConvertedImagePayload } from "../types";

import { DEFAULT_WEBP_QUALITY, WEBP_ZIP_FILENAME } from "../constants";
import { convertImageToWebp, createZipBlob } from "../services/image-to-webp.client";
import { getFileFingerprint, isAcceptedImageFile } from "../utils/file";

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

export function useImageToWebp() {
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

  function updateFileStatus(id: string, updater: (file: BatchFile) => BatchFile) {
    setFiles((currentFiles) => currentFiles.map((file) => (file.id === id ? updater(file) : file)));
  }

  function invalidateCompletedResults() {
    setFiles((currentFiles) => markFilesQueued(currentFiles));
    resetBatchRun();
    setNotice(null);
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

      setNotice(allMessages.length > 0 ? { tone: "neutral", text: allMessages.join(" ") } : null);

      if (addedCount === 0) {
        return currentFiles;
      }

      resetBatchRun();
      return markFilesQueued(nextFiles);
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
        const convertedAsset = await convertImageToWebp(file.file, quality);
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

  return {
    completedCount,
    convertedFiles,
    downloadUrl,
    failedFiles,
    files,
    isConverting,
    isPackagingZip,
    notice,
    quality,
    supportedFiles,
    totalCount,
    addFiles,
    handleConvert,
    handleDownload,
    invalidateCompletedResults,
    setQuality,
  };
}
