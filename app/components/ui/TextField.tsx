"use client";
import type { TextFieldProps as AriaTextFieldProps, ValidationResult } from "react-aria-components";

import { TextField as AriaTextField } from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Input, Label, fieldBorderStyles } from "@/components/ui/Field";
import { composeTailwindRenderProps, focusRing } from "@/lib/react-aria-utils";

const inputStyles = tv({
  extend: focusRing,
  base: "box-border min-h-9 rounded-lg border px-3 py-0 font-sans text-sm transition",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({ label, description, errorMessage, ...props }: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(props.className, "flex flex-col gap-1 font-sans")}
    >
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
