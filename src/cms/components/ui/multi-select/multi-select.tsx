"use client";

import { Check, ChevronDown } from "lucide-react";
import { type ComponentPropsWithRef } from "react";

import { CmsPopover, CmsPopoverContent, CmsPopoverTrigger } from "@/cms/components/ui/popover";
import { cn } from "@/cms/lib/cn";

import styles from "./multi-select.module.css";

export type CmsMultiSelectOption = { label: string; value: string; disabled?: boolean };
export type CmsMultiSelectProps = Omit<ComponentPropsWithRef<"button">, "onChange" | "value" | "children"> & {
  options: readonly CmsMultiSelectOption[];
  value: readonly string[];
  onValueChange: (next: string[]) => void;
  placeholder?: string;
  containerClassName?: string;
  controlSize?: "default" | "sm";
};

export function CmsMultiSelect({
  "aria-label": ariaLabel,
  className,
  containerClassName,
  controlSize = "default",
  disabled,
  onValueChange,
  options,
  placeholder = "Tất cả",
  value,
  ...triggerProps
}: CmsMultiSelectProps) {
  const selectedLabels = options.filter((option) => value.includes(option.value)).map((option) => option.label);
  const display = selectedLabels.length === 0 ? placeholder
    : selectedLabels.length <= 2 ? selectedLabels.join(", ")
    : `${selectedLabels.length} mục đã chọn`;

  return <CmsPopover>
    <span className={cn(styles.root, containerClassName)} data-size={controlSize}>
      <CmsPopoverTrigger asChild>
        <button {...triggerProps} aria-label={ariaLabel} className={cn(styles.trigger, className)} disabled={disabled} type="button">
          <span className={styles.value}>{display}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      </CmsPopoverTrigger>
      <CmsPopoverContent align="start" className={styles.menu} collisionPadding={12}>
        <div aria-label={ariaLabel ?? "Lựa chọn nhiều mục"} className={styles.options} role="group">
          {options.map((option) => {
            const checked = value.includes(option.value);
            return <label className={styles.option} key={option.value}>
              <input
                checked={checked}
                disabled={option.disabled}
                onChange={(event) => onValueChange(event.target.checked
                  ? [...value, option.value]
                  : value.filter((v) => v !== option.value))}
                type="checkbox"
              />
              <span>{option.label}</span>
              {checked ? <Check aria-hidden="true" size={15} /> : null}
            </label>;
          })}
        </div>
      </CmsPopoverContent>
    </span>
  </CmsPopover>;
}
