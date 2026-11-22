"use client";

import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import type {
  CatalogPrice,
  CatalogQuery,
  CatalogSort,
} from "./query";

export function CatalogSearchForm({
  compact = false,
  value = "",
  ariaLabel = "Tìm sản phẩm",
  placeholder,
  onSearch,
}: {
  compact?: boolean;
  value?: string;
  ariaLabel?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState({ sourceValue: value, draft: value });
  const draft = inputState.sourceValue === value ? inputState.draft : value;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(draft.trim());
  };
  const input = (
    <input
      aria-label={ariaLabel}
      className={
        compact
          ? "w-full rounded bg-surface-container-lowest py-space-sm pr-28 pl-12 font-body-md text-body-md text-on-surface shadow-inner placeholder:text-outline focus:bg-surface-bright focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          : "min-w-0 w-full bg-transparent px-space-sm py-3.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      }
      maxLength={100}
      name="q"
      onChange={(event) => setInputState({ sourceValue: value, draft: event.target.value })}
      placeholder={
        placeholder ??
        (compact
          ? "Tìm bánh, hộp quà, hương vị bạn yêu thích..."
          : "Tìm tên bánh, hương vị, nguyên liệu (ví dụ: Cốm non, Thập cẩm, Sơn mài...)")
      }
      ref={inputRef}
      type="search"
      value={draft}
    />
  );
  if (compact)
    return (
      <form
        className="relative flex w-full min-w-0 items-center"
        onSubmit={submit}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-space-md size-5 text-secondary"
        />
        {input}
        <button
          className="absolute right-1 rounded bg-primary px-space-md py-1.5 font-label-ui text-label-ui text-secondary-fixed transition-colors hover:bg-primary-container"
          type="submit"
        >
          Tìm kiếm
        </button>
      </form>
    );
  return (
    <form
      className="relative flex min-w-0 items-center overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm"
      onSubmit={submit}
    >
      <Search
        aria-hidden="true"
        className="ml-space-md size-[22px] shrink-0 text-outline"
      />
      {input}
      {draft.length > 0 && (
        <button
          aria-label="Xóa tìm kiếm"
          className="mr-1 p-2 text-outline transition-colors hover:text-on-surface"
          onClick={() => {
            setInputState({ sourceValue: value, draft: "" });
            inputRef.current?.focus();
            onSearch?.("");
          }}
          type="button"
        >
          <X className="size-[18px]" />
        </button>
      )}
      <button
        className="flex shrink-0 items-center gap-space-xs bg-primary px-space-lg py-3.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container"
        type="submit"
      >
        <span>Tìm kiếm</span>
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

export const catalogPriceOptions: { value: CatalogPrice; label: string }[] = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-200", label: "Dưới 200.000đ" },
  { value: "200-500", label: "200.000đ – 500.000đ" },
  { value: "over-500", label: "Trên 500.000đ" },
];

export function CatalogFilterForm({
  query,
  onChange,
  onReset,
}: {
  query: CatalogQuery;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onReset: () => void;
}) {
  return (
    <form
      className="w-full min-w-0"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-center justify-between pb-space-md">
        <div className="flex items-center gap-space-xs">
          <SlidersHorizontal className="size-5 text-secondary" />
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Bộ Lọc
          </h2>
        </div>
        <button
          className="font-body-sm text-body-sm text-secondary underline"
          onClick={onReset}
          type="button"
        >
          Đặt lại
        </button>
      </div>
      <fieldset className="flex min-w-0 flex-col gap-space-sm py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">
          Khoảng giá niêm yết
        </legend>
        {catalogPriceOptions.map((item) => (
          <FilterRadio
            checked={query.price === item.value}
            key={item.value}
            label={item.label}
            name="price"
            onChange={() => onChange({ price: item.value })}
          />
        ))}
      </fieldset>
      <button
        className="mt-space-md w-full rounded bg-surface-container px-space-md py-2.5 font-label-ui text-label-ui text-primary"
        onClick={onReset}
        type="button"
      >
        Thiết lập lại bộ lọc
      </button>
    </form>
  );
}

function FilterRadio({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-center gap-space-xs">
      <input
        checked={checked}
        className="size-4 shrink-0 accent-primary"
        name={name}
        onChange={onChange}
        type="radio"
      />
      <span className="min-w-0 break-words font-body-md text-body-md text-on-surface">
        {label}
      </span>
    </label>
  );
}

export function CatalogToolbar({
  query,
  currentCount,
  totalCount,
  onChange,
  onReset,
}: {
  query: CatalogQuery;
  currentCount: number;
  totalCount: number;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onReset: () => void;
}) {
  const chips = [
    query.q
      ? { key: "q", label: `“${query.q}”`, clear: () => onChange({ q: "" }) }
      : null,
    query.price !== "all"
      ? {
          key: "price",
          label:
            catalogPriceOptions.find((item) => item.value === query.price)
              ?.label ?? query.price,
          clear: () => onChange({ price: "all" }),
        }
      : null,
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];
  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:flex-row md:items-center">
      <div className="flex flex-wrap items-center gap-space-sm">
        <span className="font-body-md text-body-md font-semibold text-primary">
          Hiển thị {currentCount} trên {totalCount} sản phẩm phù hợp
        </span>
        <div className="flex flex-wrap items-center gap-space-xs">
          {chips.map((chip) => (
            <span
              className="inline-flex items-center gap-1 rounded bg-surface-container-high px-2.5 py-1 text-body-sm font-medium text-primary"
              key={chip.key}
            >
              {chip.label}
              <button
                aria-label={`Xóa bộ lọc ${chip.label}`}
                onClick={chip.clear}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          {chips.length > 0 && (
            <button
              className="ml-1 font-label-ui text-body-sm text-secondary hover:underline"
              onClick={onReset}
              type="button"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-space-xs">
        <label
          className="font-body-sm text-body-sm text-on-surface-variant"
          htmlFor="catalog-sort"
        >
          Sắp xếp:
        </label>
        <div className="relative">
          <select
            className="cursor-pointer appearance-none rounded bg-surface-container-low py-1.5 pr-8 pl-3 font-body-sm text-body-sm text-on-surface"
            id="catalog-sort"
            onChange={(event) =>
              onChange({ sort: event.target.value as CatalogSort })
            }
            value={query.sort}
          >
            <option value="default">Mới đăng</option>
            <option value="price-asc">Giá niêm yết tăng dần</option>
            <option value="price-desc">Giá niêm yết giảm dần</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-[18px] -translate-y-1/2 text-outline" />
        </div>
      </div>
    </div>
  );
}
