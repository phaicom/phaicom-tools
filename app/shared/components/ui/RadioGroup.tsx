"use client";
import type { ReactNode } from "react";
import type {
  RadioGroupProps as RACRadioGroupProps,
  RadioProps,
  ValidationResult,
} from "react-aria-components";

import {
  composeRenderProps,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Label } from "@/shared/components/ui/Field";
import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

export interface RadioGroupProps extends Omit<RACRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      className={composeTailwindRenderProps(props.className, "group flex flex-col gap-2 font-sans")}
    >
      <Label>{props.label}</Label>
      <div className="flex gap-2 group-orientation-horizontal:gap-4 group-orientation-vertical:flex-col">
        {props.children}
      </div>
      {props.description && <Description>{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </RACRadioGroup>
  );
}

const styles = tv({
  extend: focusRing,
  base: "box-border h-4.5 w-4.5 rounded-full border bg-white transition-all dark:bg-neutral-900",
  variants: {
    isSelected: {
      false:
        "border-neutral-400 group-pressed:border-neutral-500 dark:border-neutral-400 dark:group-pressed:border-neutral-300",
      true: "border-neutral-700 group-pressed:border-neutral-800 dark:border-neutral-300 dark:group-pressed:border-neutral-200 forced-colors:border-[Highlight]!",
    },
    isInvalid: {
      true: "border-red-700 group-pressed:border-red-800 dark:border-red-600 dark:group-pressed:border-red-700 forced-colors:border-[Mark]!",
    },
    isDisabled: {
      true: "border-neutral-200 dark:border-neutral-700 forced-colors:border-[GrayText]!",
    },
  },
});

export function Radio(props: RadioProps) {
  return (
    <RACRadio
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex relative gap-2 items-center group text-neutral-800 disabled:text-neutral-300 dark:text-neutral-200 dark:disabled:text-neutral-600 forced-colors:disabled:text-[GrayText] text-sm transition [-webkit-tap-highlight-color:transparent]",
      )}
    >
      {composeRenderProps(props.children, (children, renderProps) => (
        <>
          <div className={styles(renderProps)} />
          {children}
        </>
      ))}
    </RACRadio>
  );
}
