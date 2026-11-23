"use client";

import { X } from "lucide-react";

import type { CatalogQuery } from "../../query";

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
