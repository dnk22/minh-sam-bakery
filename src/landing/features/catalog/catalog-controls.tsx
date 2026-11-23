"use client";

import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import type { CatalogQuery } from "./query";

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
      className="relative flex min-w-0 items-center overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm p-[1px] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
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
        className="flex shrink-0 items-center rounded-lg gap-space-xs bg-primary px-space-lg py-3.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container"
        type="submit"
      >
        <span>Tìm kiếm</span>
        <ArrowRight className="size-4" />
      </button>
    </form>
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
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];
  return (
    <div className="mb-space-lg flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:flex-row md:items-center">
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
    </div>
  );
}
