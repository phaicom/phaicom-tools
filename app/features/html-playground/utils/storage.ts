import type { StoredPlaygroundState } from "../types";

import { DEFAULT_CODE, PLAYGROUND_STORAGE_KEY } from "../constants";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function loadPlaygroundState(): StoredPlaygroundState | null {
  try {
    const raw = window.localStorage.getItem(PLAYGROUND_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPlaygroundState>;
    if (
      !parsed.code ||
      !isString(parsed.code.html) ||
      !isString(parsed.code.css) ||
      !isString(parsed.code.javascript)
    ) {
      return null;
    }
    return {
      code: parsed.code,
      activeTab: ["html", "css", "javascript"].includes(parsed.activeTab ?? "")
        ? parsed.activeTab!
        : "html",
      autoRun: parsed.autoRun === true,
      orientation: parsed.orientation === "vertical" ? "vertical" : "horizontal",
      editorTheme: parsed.editorTheme === "dark" ? "dark" : "light",
    };
  } catch {
    return null;
  }
}

export function savePlaygroundState(state: StoredPlaygroundState) {
  try {
    window.localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function defaultPlaygroundState(): StoredPlaygroundState {
  return {
    code: { ...DEFAULT_CODE },
    activeTab: "html",
    autoRun: false,
    orientation: "horizontal",
    editorTheme: "light",
  };
}
