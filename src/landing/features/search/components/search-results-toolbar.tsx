import { ChevronDown, X } from "lucide-react";

import type { CatalogCategory } from "@/landing/features/catalog/types";

import type { SearchQuery, SearchSort } from "../query";
import { PRICE_OPTIONS, SORT_OPTIONS } from "../search-options";
import type { SearchFilterActions } from "./search-filter-panel";

type SearchResultsToolbarProps = SearchFilterActions & {
  categories: CatalogCategory[];
  query: SearchQuery;
  currentCount: number;
  totalCount: number;
};

export function SearchResultsToolbar({
  query, categories, currentCount, totalCount, onChange, onReset,
}: SearchResultsToolbarProps) {
  const selectedCategory = categories.find((item) => item.slug === query.category);
  const chips = [
    query.q ? { key: "q", label: "“" + query.q + "”", clear: () => onChange({ q: "" }) } : null,
    selectedCategory ? { key: "category", label: selectedCategory.name, clear: () => onChange({ category: null }) } : null,
    query.price !== "all" ? {
      key: "price",
      label: PRICE_OPTIONS.find((item) => item.value === query.price)?.label ?? query.price,
      clear: () => onChange({ price: "all" }),
    } : null,
  ].filter((chip): chip is { key: string; label: string; clear: () => void } => chip !== null);

  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:flex-row md:items-center">
      <div className="flex min-w-0 flex-col gap-space-sm">
        <span className="font-body-md text-body-md font-semibold text-primary">
          Hiển thị {currentCount} trên {totalCount} sản phẩm phù hợp
        </span>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-space-xs">
            {chips.map((chip) => (
              <span className="inline-flex max-w-full items-center gap-1 rounded bg-surface-container-high px-2.5 py-1 font-body-sm text-body-sm text-primary" key={chip.key}>
                <span className="min-w-0 break-all">{chip.label}</span>
                <button aria-label={"Xóa " + chip.label} className="shrink-0" onClick={chip.clear} type="button"><X className="size-3.5" /></button>
              </span>
            ))}
            <button className="font-label-ui text-body-sm text-secondary underline" onClick={onReset} type="button">Xóa tất cả</button>
          </div>
        )}
      </div>
      <label className="flex shrink-0 items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        Sắp xếp:
        <span className="relative">
          <select
            aria-label="Sắp xếp sản phẩm"
            className="cursor-pointer appearance-none rounded-lg bg-surface-container-low py-2 pr-8 pl-3 font-body-sm text-body-sm text-on-surface"
            value={query.sort}
            onChange={(event) => onChange({ sort: event.target.value as SearchSort })}
          >
            {SORT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-outline" />
        </span>
      </label>
    </div>
  );
}
