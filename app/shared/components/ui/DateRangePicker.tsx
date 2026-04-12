"use client";
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";

import { DateRangePicker as AriaDateRangePicker } from "react-aria-components";
import { LuCalendar } from "react-icons/lu";

import { DateInput } from "@/shared/components/ui/DateField";
import { Description, FieldError, FieldGroup, Label } from "@/shared/components/ui/Field";
import { FieldButton } from "@/shared/components/ui/FieldButton";
import { Popover } from "@/shared/components/ui/Popover";
import { RangeCalendar } from "@/shared/components/ui/RangeCalendar";
import { composeTailwindRenderProps } from "@/shared/utils/react-aria";

export interface DateRangePickerProps<T extends DateValue> extends AriaDateRangePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 font-sans max-w-full",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="w-auto min-w-52 cursor-text disabled:cursor-default">
        <div className="flex w-fit flex-1 items-center overflow-x-auto overflow-y-clip [scrollbar-width:none]">
          <DateInput slot="start" className="ps-3 pe-2 text-sm" />
          <span
            aria-hidden="true"
            className="text-neutral-800 group-disabled:text-neutral-200 dark:text-neutral-200 dark:group-disabled:text-neutral-600 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
          >
            –
          </span>
          <DateInput slot="end" className="flex-1 ps-2 pe-3 text-sm" />
        </div>
        <FieldButton className="mr-1 w-6 outline-offset-0">
          <LuCalendar aria-hidden className="h-4 w-4" />
        </FieldButton>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="p-2">
        <RangeCalendar />
      </Popover>
    </AriaDateRangePicker>
  );
}
