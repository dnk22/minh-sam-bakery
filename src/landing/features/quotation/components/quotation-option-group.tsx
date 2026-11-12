import { CheckCircle2 } from "lucide-react";

export function QuotationOptionGroup<T extends string>({
  error,
  field,
  label,
  note,
  onChange,
  options,
  value,
}: {
  error?: string;
  field: string;
  label: string;
  note?: string;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  value: T;
}) {
  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? `${field}-error` : undefined}>
      <legend className="w-full font-label-ui text-label-ui font-semibold text-on-surface">
        <span className="flex items-center justify-between gap-2"><span>{label}</span>{note && <span className="font-label-eyebrow text-[11px] uppercase text-secondary">{note}</span>}</span>
      </legend>
      <div className="grid grid-cols-2 gap-2" role="radiogroup">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button aria-checked={selected} className={`flex min-h-10 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-center text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected ? "border-2 border-primary bg-primary-container/10 font-bold text-primary shadow-sm" : "border border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary"}`} data-field={field} key={option.value} onClick={() => onChange(option.value)} role="radio" type="button">
              <span>{option.label}</span>{selected && <CheckCircle2 aria-hidden="true" className="size-[15px] text-primary" />}
            </button>
          );
        })}
      </div>
      {error && <p className="font-body-sm text-body-sm text-error" id={`${field}-error`}>{error}</p>}
    </fieldset>
  );
}
