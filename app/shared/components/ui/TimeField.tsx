"use client";
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
  ValidationResult,
} from "react-aria-components";

import { TimeField as AriaTimeField } from "react-aria-components";

import { DateInput } from "@/shared/components/ui/DateField";
import { Description, FieldError, Label } from "@/shared/components/ui/Field";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: TimeFieldProps<T>) {
  return (
    <AriaTimeField
      {...props}
      className={composeTailwindRenderProps(props.className, "flex flex-col gap-1 font-sans")}
    >
      <Label>{label}</Label>
      <DateInput />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTimeField>
  );
}
