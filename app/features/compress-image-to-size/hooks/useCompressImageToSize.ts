import { useEffect, useRef, useState } from "react";

import { getFileFingerprint } from "@/features/image-to-webp/utils/file";

import type { CompressionFileItem, CompressionOptions } from "../types";

import {
  MAX_FILE_BYTES,
  MAX_FILE_COUNT,
  SUPPORTED_IMAGE_EXTENSIONS,
  SUPPORTED_IMAGE_TYPES,
} from "../constants";
import { createBrowserZip } from "../utils/browserZip";
import { compressImageToSize } from "../utils/compression";

function isSupportedImage(file: File) {
  const type = file.type.toLowerCase();
  if (SUPPORTED_IMAGE_TYPES.some((supported) => supported === type)) return true;
  const name = file.name.toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.some((extension) => name.endsWith(extension));
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}

export function useCompressImageToSize(options: CompressionOptions, settingsKey: string) {
  const [items, setItems] = useState<CompressionFileItem[]>([]);
  const [notice, setNotice] = useState("Choose settings and add up to 10 images.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const itemsRef = useRef(items);
  const previousSettingsKey = useRef(settingsKey);

  itemsRef.current = items;

  useEffect(() => {
    if (previousSettingsKey.current === settingsKey) return;
    previousSettingsKey.current = settingsKey;

    setItems((current) =>
      current.map((item) => {
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        return {
          ...item,
          outputUrl: undefined,
          result: undefined,
          error: undefined,
          status: "queued",
        };
      }),
    );
    setNotice("Settings changed. Compress the selected images again.");
  }, [settingsKey]);

  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      }
    },
    [],
  );

  function addFiles(incoming: File[], messages: string[] = []) {
    setItems((current) => {
      const next = [...current];
      const known = new Set(current.map((item) => item.id));
      const feedback = [...messages];
      let remaining = Math.max(0, MAX_FILE_COUNT - current.length);

      for (const file of incoming) {
        if (remaining === 0) {
          feedback.push(`Only ${MAX_FILE_COUNT} images can be processed at once.`);
          break;
        }
        if (file.size > MAX_FILE_BYTES) {
          feedback.push(`${file.name} exceeds the 30 MB limit.`);
          continue;
        }
        if (!isSupportedImage(file)) {
          feedback.push(`${file.name} is not a supported image format.`);
          continue;
        }

        const id = getFileFingerprint(file);
        if (known.has(id)) {
          feedback.push(`${file.name} is already selected.`);
          continue;
        }

        known.add(id);
        remaining -= 1;
        next.push({
          file,
          id,
          previewUrl: URL.createObjectURL(file),
          status: "queued",
        });
      }

      const added = next.length - current.length;
      setNotice(
        feedback.length
          ? feedback.join(" ")
          : added
            ? `${added} ${added === 1 ? "image" : "images"} ready to compress.`
            : "No images were added.",
      );
      return next;
    });
  }

  function removeFile(id: string) {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      }
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function compressAll() {
    if (isProcessing || items.length === 0) return;
    setIsProcessing(true);
    setNotice(`Optimizing ${items.length} ${items.length === 1 ? "image" : "images"} locally…`);
    let successCount = 0;

    for (const [index, item] of items.entries()) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "processing", error: undefined, result: undefined }
            : entry,
        ),
      );
      setProgressMessage(`Processing ${index + 1} of ${items.length}: ${item.file.name}`);

      try {
        const result = await compressImageToSize(item.file, options, setProgressMessage);
        const outputUrl = URL.createObjectURL(result.outputBlob);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: "done", result, outputUrl, error: undefined }
              : entry,
          ),
        );
        successCount += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Image compression failed.";
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: "error", error: message } : entry,
          ),
        );
      }
    }

    setIsProcessing(false);
    setProgressMessage("");
    setNotice(
      successCount
        ? `Finished ${successCount} of ${items.length} ${items.length === 1 ? "image" : "images"}.`
        : "No images could be compressed. Review the errors below.",
    );
  }

  function downloadResult(item: CompressionFileItem) {
    if (item.outputUrl && item.result) triggerDownload(item.outputUrl, item.result.fileName);
  }

  async function downloadAll() {
    const completed = items.flatMap((item) =>
      item.result ? [{ blob: item.result.outputBlob, name: item.result.fileName }] : [],
    );
    if (completed.length === 0) return;
    if (completed.length === 1) {
      const item = items.find((entry) => entry.result);
      if (item) downloadResult(item);
      return;
    }

    setNotice("Preparing a local ZIP download…");
    const zip = await createBrowserZip(completed);
    const url = URL.createObjectURL(zip);
    triggerDownload(url, "compressed-images.zip");
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    setNotice(`Downloaded ${completed.length} compressed images in one ZIP.`);
  }

  return {
    addFiles,
    compressAll,
    downloadAll,
    downloadResult,
    isProcessing,
    items,
    notice,
    progressMessage,
    removeFile,
  };
}
