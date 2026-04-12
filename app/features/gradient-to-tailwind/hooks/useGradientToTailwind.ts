import { useState } from "react";

import { useClipboardFeedback } from "@/shared/hooks/useClipboardFeedback";

import type { ConverterMode } from "../types";

import { DEFAULT_CONVERTER_MODE, DEFAULT_GRADIENT_INPUT } from "../constants";
import { convertGradientToTailwindBg, convertGradientToTailwindText } from "../utils";

function convertByMode(mode: ConverterMode, input: string) {
  switch (mode) {
    case "gradient-bg":
      return convertGradientToTailwindBg(input);
    case "gradient-text":
      return convertGradientToTailwindText(input);
  }
}

export function useGradientToTailwind() {
  const [mode, setMode] = useState<ConverterMode>(DEFAULT_CONVERTER_MODE);
  const [input, setInput] = useState(DEFAULT_GRADIENT_INPUT);
  const [output, setOutput] = useState(() =>
    convertByMode(DEFAULT_CONVERTER_MODE, DEFAULT_GRADIENT_INPUT),
  );
  const { copied, copyText, resetCopied } = useClipboardFeedback();
  const [error, setError] = useState<string | null>(null);

  function runConversion(nextMode = mode, nextInput = input) {
    const trimmedInput = nextInput.trim();

    if (trimmedInput !== nextInput) {
      setInput(trimmedInput);
    }

    if (!trimmedInput) {
      setOutput("");
      setError("Add CSS or a gradient value.");
      return;
    }

    const nextOutput = convertByMode(nextMode, trimmedInput);

    if (!nextOutput) {
      setOutput("");
      setError("Could not parse that gradient.");
      return;
    }

    setOutput(nextOutput);
    setError(null);
  }

  function handleModeChange(nextMode: ConverterMode) {
    setMode(nextMode);
    resetCopied();
    setOutput("");
    setError(null);
  }

  async function handleCopy() {
    await copyText(output);
  }

  function updateInput(value: string) {
    setInput(value);
    resetCopied();
  }

  return {
    copied,
    error,
    input,
    mode,
    output,
    runConversion,
    handleCopy,
    handleModeChange,
    updateInput,
  };
}
