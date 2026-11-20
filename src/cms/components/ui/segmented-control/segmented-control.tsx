"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/cms/lib/cn";

import styles from "./segmented-control.module.css";

export type CmsSegmentedControlOption<TValue extends string> = {
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  value: TValue;
};

export type CmsSegmentedControlProps<TValue extends string> = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onChange: (value: TValue) => void;
  options: readonly CmsSegmentedControlOption<TValue>[];
  value: TValue;
};

export function CmsSegmentedControl<TValue extends string>({
  ariaLabel,
  className,
  disabled = false,
  onChange,
  options,
  value,
}: CmsSegmentedControlProps<TValue>) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const enabledIndices = options
      .map((option, index) => (!disabled && !option.disabled ? index : -1))
      .filter((index) => index >= 0);
    if (!enabledIndices.length) return;

    const position = enabledIndices.indexOf(currentIndex);
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = enabledIndices[(position + 1) % enabledIndices.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = enabledIndices[(position - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (event.key === "Home") {
      nextIndex = enabledIndices[0];
    } else if (event.key === "End") {
      nextIndex = enabledIndices.at(-1);
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    const option = options[nextIndex];
    if (!option) return;
    buttons.current[nextIndex]?.focus();
    onChange(option.value);
  };

  return (
    <div
      aria-label={ariaLabel}
      className={cn(styles.control, className)}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const checked = option.value === value;
        const optionDisabled = disabled || option.disabled;
        return (
          <button
            aria-checked={checked}
            className={styles.option}
            data-active={checked || undefined}
            disabled={optionDisabled}
            key={option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => moveFocus(event, index)}
            ref={(node) => { buttons.current[index] = node; }}
            role="radio"
            tabIndex={checked ? 0 : -1}
            type="button"
          >
            {option.icon ? <span className={styles.icon} aria-hidden="true">{option.icon}</span> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
