"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { CmsDropdown, CmsDropdownContent, CmsDropdownTrigger } from "@/cms/components/ui/dropdown-menu";
import { cn } from "@/cms/lib/cn";

import styles from "./select.module.css";

export type CmsSelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string | number;
};

export type CmsSelectProps = Omit<ComponentPropsWithRef<"button">, "onChange" | "value" | "defaultValue" | "children" | "size"> & {
  containerClassName?: string;
  controlSize?: "default" | "sm";
  defaultValue?: string | number;
  invalid?: boolean;
  options: readonly CmsSelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  onValueChange?: (value: string) => void;
  /** Compatibility with existing controlled CMS toolbars. New callers should use onValueChange. */
  onChange?: (event: { target: { value: string } }) => void;
};

/**
 * CMS single-choice menu. Form consumers use React Hook Form's Controller;
 * the trigger receives field.ref/onBlur and the selected value is supplied by field.value.
 * Built on the already-installed Radix menu primitives (keyboard, focus and escape support).
 */
export function CmsSelect({
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  className,
  containerClassName,
  controlSize = "default",
  defaultValue = "",
  disabled,
  id,
  invalid,
  name,
  onChange,
  onValueChange,
  options,
  placeholder = "Chọn một mục",
  required,
  value,
  ...triggerProps
}: CmsSelectProps) {
  const field = useCmsFormFieldControl({ id, describedBy, invalid, ariaInvalid });
  const generatedId = useId();
  const menuId = `${field.controlId ?? generatedId}-options`;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(String(defaultValue));
  const selected = value === undefined ? internalValue : String(value);
  const selectedOption = options.find((option) => String(option.value) === selected);
  const changeValue = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    onChange?.({ target: { value: next } });
  };

  return (
    <CmsDropdown modal={false} onOpenChange={setOpen} open={open}>
      <span className={cn(styles.root, containerClassName)} data-size={controlSize} data-disabled={disabled || undefined} data-invalid={field.invalid || undefined}>
        {name ? <input name={name} type="hidden" value={selected} disabled={disabled} /> : null}
        <CmsDropdownTrigger asChild>
          <button
            {...triggerProps}
            aria-controls={menuId}
            aria-describedby={field.describedBy}
            aria-expanded={open}
            aria-invalid={field.invalid || undefined}
            aria-label={ariaLabel}
            aria-required={required || undefined}
            className={cn(styles.trigger, className)}
            disabled={disabled}
            id={field.controlId}
            role="combobox"
            type="button"
          >
            <span className={styles.value} data-placeholder={!selectedOption || undefined}>
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDown aria-hidden="true" className={styles.chevron} size={16} />
          </button>
        </CmsDropdownTrigger>
        <CmsDropdownContent align="start" collisionPadding={12} className={styles.menu} id={menuId} sideOffset={5}>
          <Dropdown.RadioGroup onValueChange={changeValue} value={selected}>
            {options.length ? options.map((option) => (
              <Dropdown.RadioItem className={styles.option} disabled={option.disabled} key={String(option.value)} value={String(option.value)}>
                <span className={styles.optionLabel}>{option.label}</span>
                <Dropdown.ItemIndicator className={styles.indicator}><Check aria-hidden="true" size={15} /></Dropdown.ItemIndicator>
              </Dropdown.RadioItem>
            )) : <div className={styles.empty}>Không có lựa chọn</div>}
          </Dropdown.RadioGroup>
        </CmsDropdownContent>
      </span>
    </CmsDropdown>
  );
}

/** Controlled React Hook Form adapter for custom dropdowns. */
export function CmsFormSelect<T extends FieldValues>({
  control,
  name,
  ...props
}: Omit<CmsSelectProps, "name" | "value" | "defaultValue" | "onValueChange" | "onChange"> & {
  control: Control<T>;
  name: FieldPath<T>;
}) {
  const {
    field: {
      name: fieldName,
      onBlur,
      onChange,
      ref,
      value,
    },
  } = useController({ control, name });
  return (
    <CmsSelect
      {...props}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      ref={ref}
      value={value == null ? "" : String(value)}
    />
  );
}
