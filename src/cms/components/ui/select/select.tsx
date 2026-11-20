"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { cn } from "@/cms/lib/cn";

import styles from "./select.module.css";

export type CmsSelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string | number;
};

export type CmsSelectProps = ComponentProps<"select"> & {
  containerClassName?: string;
  controlSize?: "default" | "sm";
  invalid?: boolean;
  options?: readonly CmsSelectOption[];
};

export function CmsSelect({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  children,
  className,
  containerClassName,
  controlSize = "default",
  disabled,
  id,
  invalid,
  options,
  ...props
}: CmsSelectProps) {
  const field = useCmsFormFieldControl({
    id,
    describedBy: ariaDescribedBy,
    invalid,
    ariaInvalid,
  });

  return (
    <span
      className={cn(styles.root, containerClassName)}
      data-disabled={disabled || undefined}
      data-invalid={field.invalid || undefined}
      data-size={controlSize}
    >
      <select
        {...props}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        className={cn(styles.select, className)}
        disabled={disabled}
        id={field.controlId}
      >
        {children ?? options?.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} aria-hidden="true" size={16} />
    </span>
  );
}
