"use client";

import { useDeferredValue, useEffect, useState } from "react";

import {
  DEFAULT_DOCUMENT_HTML,
  EDITOR_STORAGE_KEY,
  EDITOR_WRAP_PARAGRAPH_STORAGE_KEY,
  formatHtmlOutput,
  normalizeHtmlDocument,
} from "../utils/htmlDocument";

export function useHtmlEditor() {
  const [html, setHtml] = useState(DEFAULT_DOCUMENT_HTML);
  const [wrapInParagraph, setWrapInParagraph] = useState(true);
  const [hasLoadedInitialValue, setHasLoadedInitialValue] = useState(false);
  const deferredHtml = useDeferredValue(html);
  const deferredOutputHtml = useDeferredValue(formatHtmlOutput(html, wrapInParagraph));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedHtml = window.localStorage.getItem(EDITOR_STORAGE_KEY);
    const savedWrapPreference = window.localStorage.getItem(EDITOR_WRAP_PARAGRAPH_STORAGE_KEY);

    if (savedHtml) {
      setHtml(normalizeHtmlDocument(savedHtml));
    }

    if (savedWrapPreference) {
      setWrapInParagraph(savedWrapPreference !== "false");
    }

    setHasLoadedInitialValue(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedInitialValue) {
      return;
    }

    window.localStorage.setItem(EDITOR_STORAGE_KEY, html);
  }, [hasLoadedInitialValue, html]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedInitialValue) {
      return;
    }

    window.localStorage.setItem(
      EDITOR_WRAP_PARAGRAPH_STORAGE_KEY,
      wrapInParagraph ? "true" : "false",
    );
  }, [hasLoadedInitialValue, wrapInParagraph]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  function updateHtml(nextHtml: string) {
    setHtml(normalizeHtmlDocument(nextHtml));
    setCopied(false);
  }

  function resetHtml() {
    setHtml(DEFAULT_DOCUMENT_HTML);
    setCopied(false);
  }

  async function copyHtml() {
    if (!deferredOutputHtml || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(deferredOutputHtml);
    setCopied(true);
  }

  return {
    copied,
    copyHtml,
    deferredHtml,
    deferredOutputHtml,
    html,
    resetHtml,
    setWrapInParagraph,
    updateHtml,
    wrapInParagraph,
  };
}
