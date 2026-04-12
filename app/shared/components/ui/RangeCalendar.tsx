"use client";
import type {
  RangeCalendarProps as AriaRangeCalendarProps,
  DateValue,
} from "react-aria-components";

import {
  RangeCalendar as AriaRangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { CalendarGridHeader, CalendarHeader } from "@/shared/components/ui/Calendar";
import { composeTailwindRenderProps, focusRing } from "@/shared/utils/react-aria";

export interface RangeCalendarProps<T extends DateValue> extends Omit<
  AriaRangeCalendarProps<T>,
  "visibleDuration"
> {
  errorMessage?: string;
}

const cell = tv({
  extend: focusRing,
  base: "flex h-full w-full items-center justify-center rounded-full text-neutral-900 forced-color-adjust-none dark:text-neutral-200",
  variants: {
    selectionState: {
      none: "group-hover:bg-neutral-200 group-pressed:bg-neutral-300 dark:group-hover:bg-neutral-700 dark:group-pressed:bg-neutral-600",
      middle: [
        "group-hover:bg-blue-200 dark:group-hover:bg-blue-900 forced-colors:group-hover:bg-[Highlight]",
        "group-invalid:group-hover:bg-red-200 dark:group-invalid:group-hover:bg-red-900 forced-colors:group-invalid:group-hover:bg-[Mark]",
        "group-pressed:bg-blue-300 dark:group-pressed:bg-blue-800 forced-colors:text-[HighlightText] forced-colors:group-pressed:bg-[Highlight]",
        "group-invalid:group-pressed:bg-red-300 dark:group-invalid:group-pressed:bg-red-800 forced-colors:group-invalid:group-pressed:bg-[Mark]",
      ],
      cap: "bg-blue-600 text-white group-invalid:bg-red-600 forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:group-invalid:bg-[Mark]",
    },
    isDisabled: {
      true: "text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]",
    },
  },
});

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <AriaRangeCalendar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "font-sans w-[calc(9*var(--spacing)*7)] max-w-full @container",
      )}
    >
      <CalendarHeader />
      <CalendarGrid className="border-spacing-0 [&_td]:px-0 [&_td]:py-px">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="group aspect-square w-[calc(100cqw/7)] cursor-default text-sm outline [-webkit-tap-highlight-color:transparent] outside-month:text-neutral-300 selected:bg-blue-100 invalid:selected:bg-red-100 dark:selected:bg-blue-700/30 dark:invalid:selected:bg-red-700/30 forced-colors:selected:bg-[Highlight] forced-colors:invalid:selected:bg-[Mark] selection-start:rounded-s-full selection-end:rounded-e-full [td:first-child_&]:rounded-s-full [td:last-child_&]:rounded-e-full"
            >
              {({
                formattedDate,
                isSelected,
                isSelectionStart,
                isSelectionEnd,
                isFocusVisible,
                isDisabled,
              }) => (
                <span
                  className={cell({
                    selectionState:
                      isSelected && (isSelectionStart || isSelectionEnd)
                        ? "cap"
                        : isSelected
                          ? "middle"
                          : "none",
                    isDisabled,
                    isFocusVisible,
                  })}
                >
                  {formattedDate}
                </span>
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-red-600">
          {errorMessage}
        </Text>
      )}
    </AriaRangeCalendar>
  );
}
