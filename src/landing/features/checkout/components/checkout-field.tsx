import type { ReactNode } from "react";

export const checkoutInputStyles =
  "w-full rounded-lg border border-outline-variant bg-surface px-3 py-3 font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30";

export function CheckoutField({ field, label, error, required, children }: {
  field: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 font-label-ui text-label-ui text-on-surface">
      <span>{label}{required ? <span className="text-error"> *</span> : null}</span>
      {children}
      {error ? (
        <span className="block font-body-sm text-[12px] text-error" id={`checkout-${field}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
