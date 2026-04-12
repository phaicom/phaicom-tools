import { useEffect, useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

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
    setCopied(false);
    setOutput("");
    setError(null);
  }

  async function handleCopy() {
    if (!output || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  function updateInput(value: string) {
    setInput(value);
    setCopied(false);
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
