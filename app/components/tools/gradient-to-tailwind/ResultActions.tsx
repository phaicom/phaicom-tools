import { LuCheck, LuClipboard, LuRefreshCcw } from "react-icons/lu";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ResultActionsProps = {
  canConvert: boolean;
  canCopy: boolean;
  copied: boolean;
  onConvert: () => void;
  onCopy: () => void;
};

export function ResultActions({
  canConvert,
  canCopy,
  copied,
  onConvert,
  onCopy,
}: ResultActionsProps) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-none sm:justify-end">
      <Button
        onPress={onConvert}
        isDisabled={!canConvert}
        className="h-10 min-w-0 flex-1 rounded-xl px-4 sm:min-w-28 sm:flex-none"
      >
        <span className="flex flex-row items-center gap-2">
          <LuRefreshCcw />
          Convert
        </span>
      </Button>

      <Button
        variant="secondary"
        onPress={onCopy}
        isDisabled={!canCopy}
        className={({ isDisabled }) =>
          cn(
            "h-10 min-w-0 flex-1 rounded-xl px-4 sm:min-w-24 sm:flex-none",
            copied && !isDisabled && "border-emerald-500/30 bg-emerald-500/10",
          )
        }
      >
        <span className="flex flex-row items-center gap-2">
          {copied ? <LuCheck /> : <LuClipboard />}
          {copied ? "Copied" : "Copy"}
        </span>
      </Button>
    </div>
  );
}
