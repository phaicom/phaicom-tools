import type { CompressionFormat, ResizeStrategy } from "../types";

import { FORMAT_DETAILS, RESIZE_DETAILS } from "../constants";

export type TargetOption = 50 | 100 | 200 | 500 | 1024 | 2048 | 5120 | "custom";
export type TargetUnit = "KB" | "MB";

const targets: Array<{ description: string; label: string; value: TargetOption }> = [
  { value: 50, label: "Under 50 KB", description: "For especially strict upload fields." },
  { value: 100, label: "Under 100 KB", description: "Useful for IDs and official forms." },
  { value: 200, label: "Under 200 KB", description: "A common portal upload limit." },
  { value: 500, label: "Under 500 KB", description: "Good for listings and applications." },
  { value: 1024, label: "Under 1 MB", description: "Balanced for CMS and chat uploads." },
  { value: 2048, label: "Under 2 MB", description: "Fits many email and web forms." },
  { value: 5120, label: "Under 5 MB", description: "More room for fine image detail." },
  { value: "custom", label: "Custom", description: "Enter any positive KB or MB value." },
];

type CompressionSettingsProps = {
  customError: string | null;
  customUnit: TargetUnit;
  customValue: string;
  disabled: boolean;
  format: CompressionFormat;
  onCustomUnitChange: (unit: TargetUnit) => void;
  onCustomValueChange: (value: string) => void;
  onFormatChange: (format: CompressionFormat) => void;
  onResizeStrategyChange: (strategy: ResizeStrategy) => void;
  onTargetChange: (target: TargetOption) => void;
  resizeStrategy: ResizeStrategy;
  targetLabel: string;
  targetOption: TargetOption;
};

export function CompressionSettings(props: CompressionSettingsProps) {
  const {
    customError,
    customUnit,
    customValue,
    disabled,
    format,
    onCustomUnitChange,
    onCustomValueChange,
    onFormatChange,
    onResizeStrategyChange,
    onTargetChange,
    resizeStrategy,
    targetLabel,
    targetOption,
  } = props;

  return (
    <section className="border border-border bg-card p-5 sm:p-6">
      <p className="text-sm font-semibold text-primary">Compression settings</p>
      <h2 className="mt-2 text-xl">Choose the result you need</h2>

      <div className="mt-7 space-y-8">
        <fieldset disabled={disabled}>
          <legend className="text-sm font-semibold">Target file size</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {targets.map((target) => {
              const selected = targetOption === target.value;
              return (
                <button
                  key={target.value}
                  type="button"
                  onClick={() => onTargetChange(target.value)}
                  aria-pressed={selected}
                  className={`min-h-24 cursor-pointer rounded-md border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 ${selected ? "border-primary bg-primary/8 ring-1 ring-primary/15" : "border-border bg-background hover:border-primary/35"}`}
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {target.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {target.description}
                  </span>
                </button>
              );
            })}
          </div>

          {targetOption === "custom" ? (
            <div className="mt-4 max-w-md">
              <label htmlFor="custom-target" className="text-sm font-medium text-foreground">
                Custom target
              </label>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                <input
                  id="custom-target"
                  type="number"
                  min="0.01"
                  step="any"
                  inputMode="decimal"
                  value={customValue}
                  onChange={(event) => onCustomValueChange(event.target.value)}
                  aria-invalid={Boolean(customError)}
                  aria-describedby={customError ? "custom-target-error" : undefined}
                  className="h-11 min-w-0 rounded-md border border-input bg-background px-3 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
                <select
                  value={customUnit}
                  onChange={(event) => onCustomUnitChange(event.target.value as TargetUnit)}
                  aria-label="Custom target unit"
                  className="h-11 rounded-md border border-input bg-background px-3 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
              {customError ? (
                <p id="custom-target-error" className="mt-2 text-sm text-destructive">
                  {customError}
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="mt-4 border-l-2 border-primary pl-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Target: {targetLabel}.</strong> Output stays at or
            below this size whenever the selected strategy makes it possible.
          </p>
        </fieldset>

        <fieldset disabled={disabled}>
          <legend className="text-sm font-semibold">Output format</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(Object.keys(FORMAT_DETAILS) as CompressionFormat[]).map((value) => {
              const selected = format === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onFormatChange(value)}
                  aria-pressed={selected}
                  className={`min-h-11 cursor-pointer rounded-md border px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/35"}`}
                >
                  {FORMAT_DETAILS[value].label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {FORMAT_DETAILS[format].description}
          </p>
        </fieldset>

        <fieldset disabled={disabled}>
          <legend className="text-sm font-semibold">Resize strategy</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {RESIZE_DETAILS.map((strategy) => {
              const selected = resizeStrategy === strategy.value;
              return (
                <button
                  key={strategy.value}
                  type="button"
                  onClick={() => onResizeStrategyChange(strategy.value)}
                  aria-pressed={selected}
                  className={`min-h-20 cursor-pointer rounded-md border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${selected ? "border-primary bg-primary/8 ring-1 ring-primary/15" : "border-border bg-background hover:border-primary/35"}`}
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {strategy.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {strategy.description}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
