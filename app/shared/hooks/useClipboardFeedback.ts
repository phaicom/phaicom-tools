"use client";

import { useEffect, useState } from "react";

type UseClipboardFeedbackOptions = {
  resetDelay?: number;
};

const DEFAULT_RESET_DELAY = 1800;

export function useClipboardFeedback(options: UseClipboardFeedbackOptions = {}) {
  const { resetDelay = DEFAULT_RESET_DELAY } = options;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), resetDelay);
    return () => window.clearTimeout(timeoutId);
  }, [copied, resetDelay]);

  async function copyText(value: string) {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
      return false;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    return true;
  }

  function resetCopied() {
    setCopied(false);
  }

  return {
    copied,
    copyText,
    resetCopied,
  };
}
