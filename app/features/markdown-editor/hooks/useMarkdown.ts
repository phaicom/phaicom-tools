"use client";

import { useEffect, useRef, useState } from "react";

import { DEFAULT_MARKDOWN, MARKDOWN_EDITOR_STORAGE_KEY } from "../constants";

export function useMarkdown() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMarkdown = window.localStorage.getItem(MARKDOWN_EDITOR_STORAGE_KEY);

    if (savedMarkdown && savedMarkdown !== DEFAULT_MARKDOWN) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(MARKDOWN_EDITOR_STORAGE_KEY, markdown);
  }, [markdown]);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    },
    [],
  );

  async function copyMarkdown() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(markdown);
    setCopied(true);

    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function resetMarkdown() {
    setMarkdown(DEFAULT_MARKDOWN);
  }

  return {
    copied,
    copyMarkdown,
    markdown,
    resetMarkdown,
    setMarkdown,
  };
}
