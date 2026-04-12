"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { useClipboardFeedback } from "@/shared/hooks/useClipboardFeedback";

import {
  DEFAULT_DOCUMENT_HTML,
  EDITOR_STORAGE_KEY,
  normalizeHtmlDocument,
} from "../utils/htmlDocument";

export function useHtmlEditor() {
  const [html, setHtml] = useState(DEFAULT_DOCUMENT_HTML);
  const [hasLoadedInitialValue, setHasLoadedInitialValue] = useState(false);
  const deferredHtml = useDeferredValue(html);
  const { copied, copyText, resetCopied } = useClipboardFeedback();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedHtml = window.localStorage.getItem(EDITOR_STORAGE_KEY);

    if (savedHtml) {
      setHtml(normalizeHtmlDocument(savedHtml));
    }

    setHasLoadedInitialValue(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedInitialValue) {
      return;
    }

    window.localStorage.setItem(EDITOR_STORAGE_KEY, html);
  }, [hasLoadedInitialValue, html]);

  function updateHtml(nextHtml: string) {
    setHtml(normalizeHtmlDocument(nextHtml));
    resetCopied();
  }

  function resetHtml() {
    setHtml(DEFAULT_DOCUMENT_HTML);
    resetCopied();
  }

  async function copyHtml() {
    await copyText(html);
  }

  return {
    copied,
    copyHtml,
    deferredHtml,
    html,
    resetHtml,
    updateHtml,
  };
}
