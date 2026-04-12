import type { ConverterMode, ModeContent } from "./types";

export const DEFAULT_CONVERTER_MODE: ConverterMode = "gradient-bg";
export const DEFAULT_GRADIENT_INPUT = "linear-gradient(90deg, #ff0000 0%, #00ff00 100%)";

export const MODE_CONTENT: Record<ConverterMode, ModeContent> = {
  "gradient-bg": {
    description: "Keep the gradient as a background utility.",
    helper: "Paste a gradient value or a full background declaration.",
    outputHint: "Background class",
    placeholder: "background: linear-gradient(135deg, #80F1A6 0%, #EFD000 100%);",
  },
  "gradient-text": {
    description: "Create a text gradient utility string.",
    helper: "Also works with full CSS background declarations.",
    outputHint: "Text gradient classes",
    placeholder: "background: linear-gradient(90deg, #ec4899 0%, #f59e0b 100%);",
  },
};
