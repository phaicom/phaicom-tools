"use client";
import type { FormProps } from "react-aria-components";

import { Form as RACForm } from "react-aria-components";

import { cn } from "@/shared/utils/cn";

export function Form(props: FormProps) {
  return <RACForm {...props} className={cn("flex flex-col gap-6", props.className)} />;
}
