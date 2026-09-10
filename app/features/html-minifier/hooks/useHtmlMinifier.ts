"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useClipboardFeedback } from "@/shared/hooks/useClipboardFeedback";

import type { HtmlMinifierOptions } from "../types";

import { DEFAULT_OPTIONS, HTML_MINIFIER_STORAGE_KEY, MAX_HTML_FILE_BYTES } from "../constants";
import { getDownloadName, getMinifierStats, minifyHtml } from "../utils/minifyHtml";

export function useHtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("Paste HTML or choose a local file to get started.");
  const [isMinifying, setIsMinifying] = useState(false);
  const hydratedRef = useRef(false);
  const inputRef = useRef(input);
  const { copied, copyText, resetCopied } = useClipboardFeedback();

  useEffect(() => {
    try {
      setInput(window.localStorage.getItem(HTML_MINIFIER_STORAGE_KEY) ?? "");
    } catch {
      // Storage can be unavailable in privacy modes; the editor still works normally.
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    inputRef.current = input;
    if (!hydratedRef.current) return;
    try {
      if (input) window.localStorage.setItem(HTML_MINIFIER_STORAGE_KEY, input);
      else window.localStorage.removeItem(HTML_MINIFIER_STORAGE_KEY);
    } catch {
      // Keep the in-memory editor usable when storage is unavailable.
    }
  }, [input]);

  const runMinifier = useCallback(async () => {
    const value = inputRef.current;
    if (!value.trim()) {
      setError("Paste some HTML before minifying.");
      setNotice("Input is empty.");
      return;
    }

    setIsMinifying(true);
    setError(null);
    try {
      const result = await minifyHtml(value, options);
      setOutput(result);
      setNotice("HTML minified successfully.");
      resetCopied();
    } catch {
      setError("Unable to minify this HTML. Please check the markup and try again.");
      setNotice("Minification failed. Your previous result and input are unchanged.");
    } finally {
      setIsMinifying(false);
    }
  }, [options, resetCopied]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void runMinifier();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runMinifier]);

  const stats = useMemo(() => (output ? getMinifierStats(input, output) : null), [input, output]);

  function updateInput(value: string) {
    inputRef.current = value;
    setInput(value);
    setError(null);
    resetCopied();
  }

  async function loadFile(file: File) {
    if (!/\.html?$/i.test(file.name)) {
      setError("Choose an .html or .htm file.");
      setNotice("That file type is not supported.");
      return;
    }
    if (file.size > MAX_HTML_FILE_BYTES) {
      setError("That file is larger than the 2 MB limit.");
      setNotice("Choose a smaller HTML file.");
      return;
    }
    try {
      updateInput(await file.text());
      setOutput("");
      setSourceName(file.name);
      setNotice(`${file.name} loaded locally.`);
    } catch {
      setError("Unable to read that file. Please try another HTML file.");
    }
  }

  async function copyOutput() {
    try {
      if (await copyText(output)) setNotice("Copied minified HTML.");
    } catch {
      setError("Unable to copy automatically. Select the output and copy it manually.");
    }
  }

  function downloadOutput() {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getDownloadName(sourceName);
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(`Downloaded ${anchor.download}.`);
  }

  function clear() {
    updateInput("");
    setOutput("");
    setSourceName(null);
    setError(null);
    setNotice("Input and output cleared.");
  }

  function updateOption(key: keyof HtmlMinifierOptions, value: boolean) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return {
    clear,
    copied,
    copyOutput,
    downloadOutput,
    error,
    input,
    isMinifying,
    loadFile,
    notice,
    options,
    output,
    runMinifier,
    sourceName,
    stats,
    updateInput,
    updateOption,
  };
}
