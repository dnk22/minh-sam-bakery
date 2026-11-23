"use client";

import { Minus, Plus } from "lucide-react";

export type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  appearance?: "flat" | "bordered" | "raised";
  subject?: string;
};

/** Purely presentational quantity control shared by Catalog, Product and Cart. */
export function QuantityStepper({
  value, onChange, min = 1, max = 20, size = "md", appearance = "flat", subject,
}: QuantityStepperProps) {
  const container = appearance === "raised"
    ? "flex items-center rounded-lg bg-surface-container-low p-1 shadow-inner"
    : appearance === "bordered"
      ? "flex items-center rounded-lg border border-outline-variant bg-surface"
      : "flex items-center rounded-lg bg-surface-container-low";
  const buttonStyle = size === "sm"
    ? "flex size-8 items-center justify-center rounded bg-surface text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
    : "flex size-10 items-center justify-center text-on-surface disabled:opacity-40";
  const numberStyle = size === "sm"
    ? "w-10 select-none text-center font-headline-sm text-headline-sm font-semibold text-primary"
    : "min-w-10 text-center font-label-ui font-semibold text-primary";

  return (
    <div className={container}>
      <button
        aria-label={subject ? `Giảm số lượng ${subject}` : "Giảm số lượng"}
        className={buttonStyle}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        <Minus aria-hidden="true" className={size === "sm" ? "size-[18px]" : "size-4"} />
      </button>
      <output className={numberStyle} aria-live="polite">{value}</output>
      <button
        aria-label={subject ? `Tăng số lượng ${subject}` : "Tăng số lượng"}
        className={buttonStyle}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        type="button"
      >
        <Plus aria-hidden="true" className={size === "sm" ? "size-[18px]" : "size-4"} />
      </button>
    </div>
  );
}
