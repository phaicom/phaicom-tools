import { Label, TextArea, TextField } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

import { MODE_CONTENT } from "../constants";
import { useGradientToTailwind } from "../hooks/useGradientToTailwind";
import { ConverterModeTabs } from "./ConverterModeTabs";
import { ResultActions } from "./ResultActions";

export function GradientToTailwindPage() {
  const {
    copied,
    error,
    handleCopy,
    handleModeChange,
    input,
    mode,
    output,
    runConversion,
    updateInput,
  } = useGradientToTailwind();
  const currentMode = MODE_CONTENT[mode];

  return (
    <div className="space-y-8">
      <header className="space-y-4">
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
                onChange={updateInput}
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
