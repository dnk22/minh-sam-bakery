"use client";

import type { ComponentProps } from "react";

import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { cn } from "@/cms/lib/cn";

import styles from "./textarea.module.css";

export type CmsTextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function CmsTextarea({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  id,
  invalid,
  ...props
}: CmsTextareaProps) {
  const field = useCmsFormFieldControl({
    id,
    describedBy: ariaDescribedBy,
    invalid,
    ariaInvalid,
  });

  return (
    <textarea
      {...props}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      className={cn(styles.textarea, className)}
      id={field.controlId}
    />
  );
}
