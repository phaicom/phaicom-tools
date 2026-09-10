"use client";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";

import type { EditorTheme, PlaygroundLanguage } from "../types";

export function CodeEditor({
  language,
  onChange,
  theme,
  value,
}: {
  language: PlaygroundLanguage;
  onChange: (value: string) => void;
  theme: EditorTheme;
  value: string;
}) {
  const extensions = useMemo(
    () => [
      language === "html"
        ? html({ autoCloseTags: true })
        : language === "css"
          ? css()
          : javascript(),
    ],
    [language],
  );

  return (
    <CodeMirror
      aria-label={`${language === "javascript" ? "JavaScript" : language.toUpperCase()} code editor`}
      value={value}
      height="100%"
      minHeight="420px"
      theme={theme}
      extensions={extensions}
      basicSetup={{
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        indentOnInput: true,
        lineNumbers: true,
      }}
      onChange={onChange}
      className="h-full min-h-105 overflow-auto font-mono text-sm [&_.cm-editor]:h-full [&_.cm-editor]:min-h-105 [&_.cm-scroller]:font-mono"
    />
  );
}
