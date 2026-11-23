import { SlidersHorizontal } from "lucide-react";

import type { CatalogCategory } from "@/landing/features/catalog/types";

import { PRICE_OPTIONS } from "../search-options";
import type { SearchQuery } from "../query";

export type SearchFilterActions = {
  onChange: (patch: Partial<SearchQuery>) => void;
  onReset: () => void;
};

export type SearchFilterPanelProps = SearchFilterActions & {
  categories: CatalogCategory[];
  query: SearchQuery;
  radioPrefix: "desktop" | "mobile";
  hideHeading?: boolean;
};

export function SearchFilterPanel({
  categories, query, onChange, onReset, radioPrefix, hideHeading = false,
}: SearchFilterPanelProps) {
  return (
    <div className="min-w-0">
      {!hideHeading && (
        <div className="flex items-center justify-between gap-space-sm pb-space-md">
          <div className="flex items-center gap-space-xs">
            <SlidersHorizontal className="size-5 text-secondary" aria-hidden="true" />
            <h2 className="font-headline-sm text-headline-sm text-primary">Bộ lọc</h2>
          </div>
          <button className="font-body-sm text-body-sm text-secondary underline" onClick={onReset} type="button">Đặt lại</button>
        </div>
      )}
      <fieldset className="flex flex-col gap-space-sm border-b border-outline-variant py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Danh mục</legend>
        <FilterRadio
          label="Tất cả loại bánh"
          checked={query.category === null}
          name={`${radioPrefix}-search-category`}
          onChange={() => onChange({ category: null })}
        />
        {categories.map((category) => (
          <FilterRadio
            key={category.slug}
            label={category.name}
            checked={query.category === category.slug}
            name={`${radioPrefix}-search-category`}
            onChange={() => onChange({ category: category.slug })}
          />
        ))}
      </fieldset>
      <fieldset className="mt-space-md flex flex-col gap-space-sm py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Khoảng giá</legend>
        {PRICE_OPTIONS.map((item) => (
          <FilterRadio
            key={item.value}
            label={item.label}
            checked={query.price === item.value}
            name={`${radioPrefix}-search-price`}
            onChange={() => onChange({ price: item.value })}
          />
        ))}
      </fieldset>
      <button className="mt-space-md w-full rounded-lg bg-surface-container px-space-md py-2.5 font-label-ui text-label-ui text-primary hover:bg-surface-container-high" type="button" onClick={onReset}>
        Thiết lập lại bộ lọc
      </button>
    </div>
  );
}

function FilterRadio({ label, name, checked, onChange }: {
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-center gap-space-sm">
      <input className="size-4 shrink-0 accent-primary" name={name} type="radio" checked={checked} onChange={onChange} />
      <span className="min-w-0 break-words font-body-md text-body-md text-on-surface">{label}</span>
    </label>
  );
}
