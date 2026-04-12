import { Label, TextArea, TextField } from "react-aria-components";

import { PageIntro } from "@/shared/components/content/PageIntro";
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
      <PageIntro
        title="Gradient to Tailwind"
        description="Convert CSS gradients into concise Tailwind classes for backgrounds and text."
      />

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
          <div className="space-y-6 rounded-sm bg-card/85 p-5 shadow-xs backdrop-blur sm:p-6">
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
            "min-h-112 w-full resize-y rounded-sm bg-background px-5 py-4 font-mono text-sm leading-7 text-foreground shadow-none transition outline-none placeholder:text-muted-foreground/70",
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
          "min-h-112 rounded-sm bg-background px-5 py-4 font-mono text-sm leading-7 whitespace-pre-wrap shadow-none",
          error ? "text-destructive" : "text-foreground",
        )}
      >
        {error ?? (value || "Converted classes appear here.")}
      </div>
    </div>
  );
}
