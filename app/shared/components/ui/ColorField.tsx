"use client";
import type {
  ColorFieldProps as AriaColorFieldProps,
  ValidationResult,
} from "react-aria-components";

import { ColorField as AriaColorField } from "react-aria-components";
import { tv } from "tailwind-variants";

import {
  Description,
  FieldError,
  Input,
  Label,
  fieldBorderStyles,
} from "@/shared/components/ui/Field";
import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

const inputStyles = tv({
  extend: focusRing,
  base: "box-border min-h-9 rounded-lg border px-3 py-0 font-sans text-sm transition [-webkit-tap-highlight-color:transparent]",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface ColorFieldProps extends AriaColorFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function ColorField({ label, description, errorMessage, ...props }: ColorFieldProps) {
  return (
    <AriaColorField
      {...props}
      className={composeTailwindRenderProps(props.className, "flex flex-col gap-1 font-sans")}
    >
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaColorField>
  );
}
