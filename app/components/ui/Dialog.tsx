"use client";
import type { DialogProps } from "react-aria-components";

import { Dialog as RACDialog } from "react-aria-components";

import { cn } from "@/lib/utils";

export function Dialog(props: DialogProps) {
  return (
    <RACDialog
      {...props}
      className={cn(
        "relative box-border max-h-[inherit] overflow-auto p-6 outline [[data-placement]>&]:p-4",
        props.className,
      )}
    />
  );
}
