"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useClipboardFeedback } from "@/shared/hooks/useClipboardFeedback";

import type {
  ConsoleEntry,
  EditorTheme,
  PlaygroundCode,
  PlaygroundLanguage,
  PlaygroundOrientation,
} from "../types";

import { DEFAULT_CODE } from "../constants";
import { buildPreviewDocument, downloadHtml, parsePreviewMessage } from "../utils/preview";
import { defaultPlaygroundState, loadPlaygroundState, savePlaygroundState } from "../utils/storage";

export function useHtmlPlayground() {
  const initial = defaultPlaygroundState();
  const [code, setCode] = useState(initial.code);
  const [activeTab, setActiveTab] = useState<PlaygroundLanguage>(initial.activeTab);
  const [autoRun, setAutoRun] = useState(initial.autoRun);
  const [orientation, setOrientation] = useState<PlaygroundOrientation>(initial.orientation);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>(initial.editorTheme);
  const [previewDocument, setPreviewDocument] = useState("");
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const tokenRef = useRef("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hydratedRef = useRef(false);
  const { copied, copyText, resetCopied } = useClipboardFeedback();

  const run = useCallback((nextCode: PlaygroundCode) => {
    const token = crypto.randomUUID();
    tokenRef.current = token;
    setConsoleEntries([]);
    setPreviewDocument(buildPreviewDocument(nextCode, token));
    setRunCount((value) => value + 1);
  }, []);

  useEffect(() => {
    const restored = loadPlaygroundState() ?? initial;
    setCode(restored.code);
    setActiveTab(restored.activeTab);
    setAutoRun(restored.autoRun);
    setOrientation(restored.orientation);
    setEditorTheme(restored.editorTheme);
    hydratedRef.current = true;
    run(restored.code);
    // This initialization intentionally runs once after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    savePlaygroundState({ code, activeTab, autoRun, orientation, editorTheme });
  }, [activeTab, autoRun, code, editorTheme, orientation]);

  useEffect(() => {
    if (!hydratedRef.current || !autoRun) return;
    const timeout = window.setTimeout(() => run(code), 450);
    return () => window.clearTimeout(timeout);
  }, [autoRun, code, run]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const entry = parsePreviewMessage(event.data, tokenRef.current);
      if (!entry) return;
      setConsoleEntries((current) => [
        ...current.slice(-99),
        { ...entry, id: Date.now() + Math.random() },
      ]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key === "Enter") {
        event.preventDefault();
        run(code);
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        setSaved(savePlaygroundState({ code, activeTab, autoRun, orientation, editorTheme }));
        window.setTimeout(() => setSaved(false), 1600);
      } else if (event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        setOrientation((value) => (value === "horizontal" ? "vertical" : "horizontal"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, autoRun, code, editorTheme, orientation, run]);

  function updateActiveCode(value: string) {
    resetCopied();
    setCode((current) => ({ ...current, [activeTab]: value }));
  }

  function reset() {
    const nextCode = { ...DEFAULT_CODE };
    setCode(nextCode);
    setActiveTab("html");
    setConsoleEntries([]);
    run(nextCode);
  }

  return {
    activeTab,
    autoRun,
    code,
    consoleEntries,
    copied,
    editorTheme,
    iframeRef,
    orientation,
    previewDocument,
    runCount,
    saved,
    clearConsole: () => setConsoleEntries([]),
    copyActiveCode: () => copyText(code[activeTab]),
    download: () => downloadHtml(code),
    reset,
    run: () => run(code),
    setActiveTab,
    setAutoRun,
    setEditorTheme,
    setOrientation,
    updateActiveCode,
  };
}
