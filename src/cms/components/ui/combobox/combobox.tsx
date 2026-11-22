"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useState, type ComponentPropsWithRef } from "react";

import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { CmsPopover, CmsPopoverContent, CmsPopoverTrigger } from "@/cms/components/ui/popover";
import { filterSelectOptions } from "@/cms/components/ui/select/select-options";
import { cn } from "@/cms/lib/cn";

import styles from "./combobox.module.css";

export type CmsComboboxOption = { value: string; label: string; disabled?: boolean };
export type CmsComboboxProps = Omit<ComponentPropsWithRef<"button">, "onChange" | "value" | "defaultValue" | "children"> & {
  options: readonly CmsComboboxOption[];
  value: string;
  onValueChange: (next: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  containerClassName?: string;
  invalid?: boolean;
  controlSize?: "default" | "sm";
};

export function CmsCombobox({
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  className,
  containerClassName,
  controlSize = "default",
  disabled,
  emptyMessage = "Không tìm thấy kết quả",
  id,
  invalid,
  name,
  onValueChange,
  options,
  placeholder = "Chọn một mục",
  required,
  searchPlaceholder = "Tìm kiếm...",
  value,
  ...triggerProps
}: CmsComboboxProps) {
  const field = useCmsFormFieldControl({ id, describedBy, invalid, ariaInvalid });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const matches = filterSelectOptions(options, search);
  const chosen = options.find((option) => option.value === value);
  const pick = (next: string) => {
    if (next !== value) onValueChange(next);
    setOpen(false);
  };
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) { setSearch(""); setActiveIndex(0); }
  };
  const move = (step: number) => {
    if (!matches.length) return;
    let next = activeIndex;
    for (let i = 0; i < matches.length; i++) {
      next = (next + step + matches.length) % matches.length;
      if (!matches[next].disabled) { setActiveIndex(next); return; }
    }
  };

  return (
    <CmsPopover open={open} onOpenChange={onOpenChange}>
      <span className={cn(styles.root, containerClassName)} data-size={controlSize} data-invalid={field.invalid || undefined}>
        {name ? <input name={name} type="hidden" value={value} disabled={disabled} /> : null}
        <CmsPopoverTrigger asChild>
          <button
            {...triggerProps}
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
            <span className={styles.value} data-placeholder={!chosen || undefined}>{chosen?.label ?? placeholder}</span>
            <ChevronDown aria-hidden="true" className={styles.chevron} size={16} />
          </button>
        </CmsPopoverTrigger>
        <CmsPopoverContent align="start" className={styles.menu} collisionPadding={12} onOpenAutoFocus={(event) => {
          // Radix focuses the search input automatically as the first tabbable child.
          if (!options.length) event.preventDefault();
        }}>
          <div className={styles.searchBox}>
            <Search aria-hidden="true" size={16} />
            <input
              aria-label={searchPlaceholder}
              aria-activedescendant={matches[activeIndex] && !matches[activeIndex].disabled ? `${field.controlId}-option-${activeIndex}` : undefined}
              autoFocus
              className={styles.input}
              onChange={(event) => { setSearch(event.target.value); setActiveIndex(0); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
                if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
                if (event.key === "Enter" && matches[activeIndex] && !matches[activeIndex].disabled) {
                  event.preventDefault(); pick(matches[activeIndex].value);
                }
              }}
              placeholder={searchPlaceholder}
              role="combobox"
              aria-controls={field.controlId ? `${field.controlId}-options` : undefined}
              aria-expanded={open}
              value={search}
            />
          </div>
          <div className={styles.options} id={field.controlId ? `${field.controlId}-options` : undefined} role="listbox">
            {matches.length ? matches.map((option, index) => (
              <button
                aria-selected={value === option.value}
                className={styles.option}
                data-active={index === activeIndex || undefined}
                disabled={option.disabled}
                id={field.controlId ? `${field.controlId}-option-${index}` : undefined}
                key={option.value}
                onClick={() => pick(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                tabIndex={-1}
                type="button"
              >
                <span>{option.label}</span>
                {value === option.value ? <Check aria-hidden="true" size={15} /> : null}
              </button>
            )) : <p className={styles.empty}>{emptyMessage}</p>}
          </div>
        </CmsPopoverContent>
      </span>
    </CmsPopover>
  );
}
