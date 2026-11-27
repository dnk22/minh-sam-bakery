"use client";

import type { ComponentProps, ReactNode } from "react";

import { useToolbarPending } from "@/cms/components/toolbar/toolbar-pending-context";
import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { cn } from "@/cms/lib/cn";

import styles from "./input.module.css";

export type CmsInputProps = Omit<ComponentProps<"input">, "size"> & {
  containerClassName?: string;
  controlSize?: "default" | "sm";
  invalid?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function CmsInput({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  containerClassName,
  controlSize = "default",
  disabled: disabledProp,
  id,
  invalid,
  leadingIcon,
  trailingIcon,
  ...props
}: CmsInputProps) {
  const { pending } = useToolbarPending();
  const disabled = disabledProp || pending;
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
      {leadingIcon ? <span className={styles.icon} aria-hidden="true">{leadingIcon}</span> : null}
      <input
        {...props}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        className={cn(styles.input, className)}
        disabled={disabled}
        id={field.controlId}
      />
      {trailingIcon ? <span className={styles.icon} aria-hidden="true">{trailingIcon}</span> : null}
    </span>
  );
}
