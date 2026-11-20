"use client";

import {
  createContext,
  useContext,
  useId,
  type AriaAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/cms/lib/cn";

import styles from "./form-field.module.css";

type FormFieldContextValue = {
  controlId?: string;
  describedBy?: string;
  invalid: boolean;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export type CmsFormFieldProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  label: ReactNode;
  required?: boolean;
};

export function CmsFormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  required = false,
}: CmsFormFieldProps) {
  const generatedId = useId();
  const baseId = htmlFor ?? generatedId;
  const descriptionId = description ? `${baseId}-description` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const labelContent = (
    <>
      {label}
      {required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
    </>
  );

  return (
    <FormFieldContext
      value={{ controlId: htmlFor, describedBy, invalid: Boolean(error) }}
    >
      <div className={cn(styles.field, className)}>
        {htmlFor ? (
          <label className={styles.label} htmlFor={htmlFor}>{labelContent}</label>
        ) : (
          <div className={styles.label}>{labelContent}</div>
        )}
        {children}
        {description ? (
          <p className={styles.description} id={descriptionId}>{description}</p>
        ) : null}
        {error ? (
          <p className={styles.error} id={errorId} role="alert">{error}</p>
        ) : null}
      </div>
    </FormFieldContext>
  );
}

export function useCmsFormFieldControl({
  id,
  describedBy,
  invalid,
  ariaInvalid,
}: {
  id?: string;
  describedBy?: string;
  invalid?: boolean;
  ariaInvalid?: AriaAttributes["aria-invalid"];
}) {
  const field = useContext(FormFieldContext);
  const resolvedDescribedBy = [describedBy, field?.describedBy]
    .filter(Boolean)
    .join(" ") || undefined;
  const explicitlyInvalid =
    ariaInvalid === true ||
    ariaInvalid === "true" ||
    ariaInvalid === "grammar" ||
    ariaInvalid === "spelling";

  return {
    controlId: id ?? field?.controlId,
    describedBy: resolvedDescribedBy,
    invalid: Boolean(invalid || explicitlyInvalid || field?.invalid),
  };
}
