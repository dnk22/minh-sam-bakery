"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";

import { routes } from "@/landing/lib/routes";

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
    <div className="mb-space-lg flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-3 shadow-sm sm:p-space-md">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 font-body-md text-sm font-semibold text-primary sm:text-body-md">
          {currentCount !== totalCount && currentCount !== 0 && `Hiển thị ${currentCount} trên ${totalCount} sản phẩm`}
        </span>
        <Link
          className="group inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded font-label-ui text-xs font-medium text-primary transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:text-label-ui"
          href={routes.search}
        >
          Xem tất cả
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
      {chips.length > 0 && (
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
      )}
    </div>
  );
}
