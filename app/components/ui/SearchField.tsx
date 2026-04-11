"use client";
import type {
  SearchFieldProps as AriaSearchFieldProps,
  ValidationResult,
} from "react-aria-components";

import { SearchField as AriaSearchField } from "react-aria-components";
import { LuSearch, LuX } from "react-icons/lu";

import { Description, FieldError, FieldGroup, Input, Label } from "@/components/ui/Field";
import { FieldButton } from "@/components/ui/FieldButton";
import { composeTailwindRenderProps } from "@/lib/react-aria-utils";

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: SearchFieldProps) {
  return (
    <AriaSearchField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 min-w-10 font-sans max-w-full",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <LuSearch
          aria-hidden
          className="ml-2 h-4 w-4 text-neutral-500 group-disabled:text-neutral-200 dark:text-neutral-400 dark:group-disabled:text-neutral-600 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
        />
        <Input
          placeholder={placeholder}
          className="pl-2 [&::-webkit-search-cancel-button]:hidden"
        />
        <FieldButton className="mr-1 w-6 group-empty:invisible">
          <LuX aria-hidden className="h-4 w-4" />
        </FieldButton>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaSearchField>
  );
}
