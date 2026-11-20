"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { CategoryStatus } from "../types";

export type CategoryView = "flat" | "tree";

type FilterUpdate = Partial<{
  search: string | null;
  status: CategoryStatus | null;
  view: CategoryView | null;
  page: number | null;
}>;

export type CategoryFilters = {
  search: string;
  status?: CategoryStatus;
  view: CategoryView;
  page: number;
  isFiltered: boolean;
  setSearch: (value: string) => void;
  setStatus: (value?: CategoryStatus) => void;
  setView: (value: CategoryView) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
};

function normalizePage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function normalizeStatus(value: string | null): CategoryStatus | undefined {
  return value === "VISIBLE" || value === "HIDDEN" ? value : undefined;
}

export function useCategoryFilters(): CategoryFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const status = normalizeStatus(searchParams.get("status"));
  const view = searchParams.get("view") === "tree" ? "tree" : "flat";
  const page = normalizePage(searchParams.get("page"));

  const updateUrl = useCallback(
    (values: FilterUpdate, resetPage = false) => {
      const query = new URLSearchParams(serializedParams);
      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === "" || (key === "page" && value === 1)) {
          query.delete(key);
        } else {
          query.set(key, String(value));
        }
      });
      if (resetPage) query.delete("page");
      const next = query.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router, serializedParams],
  );

  return {
    search,
    status,
    view,
    page,
    isFiltered: Boolean(search || status),
    setSearch: useCallback(
      (value: string) => updateUrl({ search: value || null }, true),
      [updateUrl],
    ),
    setStatus: useCallback(
      (value?: CategoryStatus) => updateUrl({ status: value ?? null }, true),
      [updateUrl],
    ),
    setView: useCallback(
      (value: CategoryView) =>
        updateUrl({ view: value === "tree" ? "tree" : null }, true),
      [updateUrl],
    ),
    setPage: useCallback(
      (value: number) => updateUrl({ page: value }),
      [updateUrl],
    ),
    clearFilters: useCallback(
      () => updateUrl({ search: null, status: null }, true),
      [updateUrl],
    ),
  };
}
