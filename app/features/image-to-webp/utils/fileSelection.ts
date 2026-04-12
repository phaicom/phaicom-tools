import { isDirectoryDropItem, isFileDropItem, type DropItem } from "react-aria-components";

import type { ImageFileSelection } from "../types";

export async function collectDroppedImageFiles(
  items: Iterable<DropItem>,
): Promise<ImageFileSelection> {
  const files: File[] = [];
  const messages: string[] = [];

  for (const item of items) {
    if (isFileDropItem(item)) {
      files.push(await item.getFile());
      continue;
    }

    if (isDirectoryDropItem(item)) {
      messages.push(`Skipped folder "${item.name}". Folder uploads are not supported yet.`);
      continue;
    }

    messages.push("Skipped one dropped item because it was not a file.");
  }

  return { files, messages };
}

export function createImageFileSelection(fileList: FileList | null): ImageFileSelection {
  return {
    files: fileList ? Array.from(fileList) : [],
    messages: [],
  };
}
