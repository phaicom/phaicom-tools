"use client";
import type {
  DateFieldProps as AriaDateFieldProps,
  DateInputProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";

import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Label, fieldGroupStyles } from "@/shared/components/ui/Field";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      {...props}
      className={composeTailwindRenderProps(props.className, "flex flex-col gap-1")}
    >
      {label && <Label>{label}</Label>}
      <DateInput />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}

const segmentStyles = tv({
  base: "inline rounded-xs p-0.5 whitespace-nowrap text-neutral-800 caret-transparent outline-0 forced-color-adjust-none [-webkit-tap-highlight-color:transparent] dark:text-neutral-200 forced-colors:text-[ButtonText] type-literal:p-0",
  variants: {
    isPlaceholder: {
      true: "text-neutral-600 dark:text-neutral-400",
    },
    isDisabled: {
      true: "text-neutral-200 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
    isFocused: {
      true: "bg-blue-600 text-white dark:text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
});

export function DateInput(props: Omit<DateInputProps, "children">) {
  return (
    <AriaDateInput
      className={(renderProps) =>
        fieldGroupStyles({
          ...renderProps,
          class:
            "inline min-w-37.5 px-3 h-9 text-sm leading-8.5 font-sans cursor-text disabled:cursor-default whitespace-nowrap overflow-x-auto [scrollbar-width:none]",
        })
      }
      {...props}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </AriaDateInput>
  );
}
