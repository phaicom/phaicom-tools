export type PlaygroundLanguage = "html" | "css" | "javascript";

export type PlaygroundCode = Record<PlaygroundLanguage, string>;

export type PlaygroundOrientation = "horizontal" | "vertical";

export type EditorTheme = "light" | "dark";

export type ConsoleLevel = "log" | "warn" | "error";

export type ConsoleEntry = {
  id: number;
  level: ConsoleLevel;
  message: string;
};

export type StoredPlaygroundState = {
  code: PlaygroundCode;
  activeTab: PlaygroundLanguage;
  autoRun: boolean;
  orientation: PlaygroundOrientation;
  editorTheme: EditorTheme;
};
