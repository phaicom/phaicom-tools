"use client";

import type { Editor } from "@tiptap/react";

import { useEffect, useRef } from "react";

import type { EditorMode } from "../components/EditorModeTabs";

import {
  formatHtmlSourceDocument,
  normalizeHtmlDocument,
  sanitizeEditorHtmlDocument,
} from "../utils/htmlDocument";

type UseEditorDocumentLifecycleParams = {
  editor: Editor | null;
  html: string;
  mode: EditorMode;
  onChange: (html: string) => void;
};

export function useEditorDocumentLifecycle({
  editor,
  html,
  mode,
  onChange,
}: UseEditorDocumentLifecycleParams) {
  const previousModeRef = useRef<EditorMode>(mode);

  useEffect(() => {
    if (!editor || mode !== "rich-text") {
      return;
    }

    const currentHtml = normalizeHtmlDocument(editor.getHTML());
    const nextHtml = normalizeHtmlDocument(html);

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, html, mode]);

  useEffect(() => {
    if (!editor) {
      previousModeRef.current = mode;
      return;
    }

    const previousMode = previousModeRef.current;
    previousModeRef.current = mode;

    if (previousMode === "rich-text" && mode === "html") {
      const formattedHtml = formatHtmlSourceDocument(html);

      if (formattedHtml !== html) {
        onChange(formattedHtml);
      }

      return;
    }

    if (previousMode === mode || previousMode !== "html" || mode !== "rich-text") {
      return;
    }

    const sanitizedHtml = sanitizeEditorHtmlDocument(html);
    editor.commands.setContent(sanitizedHtml, { emitUpdate: false });

    if (sanitizedHtml !== html) {
      onChange(sanitizedHtml);
    }
  }, [editor, html, mode, onChange]);
}
