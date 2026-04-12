"use client";

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";

import type { HtmlDocument } from "../types/editor";

import {
  DEFAULT_DOCUMENT_HTML,
  EDITOR_STORAGE_KEY,
  normalizeHtmlDocument,
} from "../utils/htmlDocument";

export function useHtmlEditor() {
  const [html, setHtml] = useState<HtmlDocument>(DEFAULT_DOCUMENT_HTML);
  const deferredHtml = useDeferredValue(html);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedHtml = window.localStorage.getItem(EDITOR_STORAGE_KEY);

    if (savedHtml) {
      setHtml(normalizeHtmlDocument(savedHtml));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(EDITOR_STORAGE_KEY, html);
  }, [html]);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    },
    [],
  );

  function updateHtml(nextHtml: string) {
    const normalizedHtml = normalizeHtmlDocument(nextHtml);

    startTransition(() => {
      setHtml(normalizedHtml);
    });
  }

  function resetHtml() {
    setHtml(DEFAULT_DOCUMENT_HTML);
  }

  async function copyHtml() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(html);
    setCopied(true);

    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1800);
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
