"use client";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";

import { DatePicker as AriaDatePicker } from "react-aria-components";
import { LuCalendar } from "react-icons/lu";

import { Calendar } from "@/components/ui/Calendar";
import { DateInput } from "@/components/ui/DateField";
import { Description, FieldError, FieldGroup, Label } from "@/components/ui/Field";
import { FieldButton } from "@/components/ui/FieldButton";
import { Popover } from "@/components/ui/Popover";
import { composeTailwindRenderProps } from "@/lib/react-aria-utils";

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      {...props}
      className={composeTailwindRenderProps(props.className, "group flex flex-col gap-1 font-sans")}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="w-auto min-w-52 cursor-text disabled:cursor-default">
        <DateInput className="min-w-37.5 flex-1 px-3 text-sm" />
        <FieldButton className="mr-1 w-6 outline-offset-0">
          <LuCalendar aria-hidden className="h-4 w-4" />
        </FieldButton>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="p-2">
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
