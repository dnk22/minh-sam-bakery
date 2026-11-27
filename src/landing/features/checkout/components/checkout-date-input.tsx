import { CalendarDays } from "lucide-react";
import { checkoutInputStyles } from "./checkout-field";
import styles from "./checkout-date-input.module.css";

export function CheckoutDateInput({ value, min, error, onChange }: {
  value: string;
  min: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <span className="relative block min-w-0 max-w-full">
      <input
        className={`${checkoutInputStyles} ${styles.input}`}
        data-checkout-field="receiveDate"
        min={min}
        onChange={event => onChange(event.target.value)}
        type="date"
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "checkout-receiveDate-error" : undefined}
      />
      <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-outline" />
    </span>
  );
}
