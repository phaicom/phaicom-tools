import { useEffect, useState } from "react";
import { Label, TextArea, TextField } from "react-aria-components";

import {
  ConverterModeTabs,
  type ConverterMode,
} from "@/components/tools/gradient-to-tailwind/ConverterModeTabs";
import { ResultActions } from "@/components/tools/gradient-to-tailwind/ResultActions";
import { cn } from "@/lib/utils";
import {
  convertGradientToTailwindBg,
  convertGradientToTailwindText,
} from "@/utils/gradient-to-tailwind";

export const handle = {
  docsNav: {
    title: "Gradient to Tailwind",
    order: 10,
  },
};

export function meta() {
  return [
    { title: "Gradient to Tailwind | Phaicom Tools" },
    {
      name: "description",
      content: "Convert CSS gradients into Tailwind background and text utility classes.",
    },
  ];
}

const defaultMode: ConverterMode = "gradient-bg";
const defaultInput = "linear-gradient(90deg, #ff0000 0%, #00ff00 100%)";

const modeContent: Record<
  ConverterMode,
  {
    description: string;
    placeholder: string;
    helper: string;
    outputHint: string;
  }
> = {
  "gradient-bg": {
    description: "Keep the gradient as a background utility.",
    placeholder: "linear-gradient(90deg, #ff0000 0%, #00ff00 100%)",
    helper: "Use a complete gradient value.",
    outputHint: "Background class",
  },
  "gradient-text": {
    description: "Create a text gradient utility string.",
    placeholder: "linear-gradient(90deg, #ec4899 0%, #f59e0b 100%)",
    helper: "Adds text clipping and transparency.",
    outputHint: "Text gradient classes",
  },
};

function convertByMode(mode: ConverterMode, input: string) {
  switch (mode) {
    case "gradient-bg":
      return convertGradientToTailwindBg(input);
    case "gradient-text":
      return convertGradientToTailwindText(input);
  }
}

export default function GradientToTailwindDocsPage() {
  const [mode, setMode] = useState<ConverterMode>(defaultMode);
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState(() => convertByMode(defaultMode, defaultInput));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentMode = modeContent[mode];

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  function runConversion(nextMode = mode, nextInput = input) {
    const trimmedInput = nextInput.trim();

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

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          Developer Tool
        </p>
        <div className="space-y-3">
          <h1>Gradient to Tailwind</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Convert CSS gradients into concise Tailwind classes for backgrounds and text.
          </p>
        </div>
      </header>

      <ConverterModeTabs
        mode={mode}
        onChange={handleModeChange}
        actions={
          <ResultActions
            canConvert={input.trim().length > 0}
            canCopy={output.length > 0}
            copied={copied}
            onConvert={() => runConversion()}
            onCopy={() => void handleCopy()}
          />
        }
      >
        <section>
          <div className="space-y-6 rounded-[1.75rem] bg-card/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">Converter</h2>
              <p className="text-sm text-muted-foreground">{currentMode.description}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <EditorField
                label="Input"
                description={currentMode.helper}
                value={input}
                onChange={(value) => {
                  setInput(value);
                  setCopied(false);
                }}
                placeholder={currentMode.placeholder}
              />

              <OutputPanel
                label="Output"
                hint={error ? "Review input" : currentMode.outputHint}
                value={output}
                error={error}
              />
            </div>
          </div>
        </section>
      </ConverterModeTabs>
    </div>
  );
}

function EditorField({
  description,
  label,
  onChange,
  placeholder,
  value,
}: {
  description: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <TextField className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>

      <TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={({ isFocusVisible, isHovered }) =>
          cn(
            "min-h-112 w-full resize-y rounded-[1.5rem] bg-background px-5 py-4 font-mono text-sm leading-7 text-foreground shadow-sm transition outline-none placeholder:text-muted-foreground/70",
            isHovered && "bg-card",
            isFocusVisible && "ring-2 ring-ring/20",
          )
        }
      />
    </TextField>
  );
}

function OutputPanel({
  error,
  hint,
  label,
  value,
}: {
  error: string | null;
  hint: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <span className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {hint}
        </span>
      </div>

      <div
        className={cn(
          "min-h-112 rounded-[1.5rem] bg-background px-5 py-4 font-mono text-sm leading-7 whitespace-pre-wrap shadow-sm",
          error ? "text-destructive" : "text-foreground",
        )}
      >
        {error ?? (value || "Converted classes appear here.")}
      </div>
    </div>
  );
}
