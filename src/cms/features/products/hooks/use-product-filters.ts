"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { clearProductAdvancedFilterQuery, parseOptionalBoolean, parseProductPage, parseProductStatus } from "../lib/product-data";
import type { ProductStatus } from "../types";

export type ProductFilters = {
  search: string; status?: ProductStatus; categoryId?: string; isFeatured?: boolean; isBestSeller?: boolean; page: number; isFiltered: boolean;
  setSearch: (value: string) => void; setStatus: (value?: ProductStatus) => void; setCategoryId: (value?: string) => void;
  setFeatured: (value?: boolean) => void; setBestSeller: (value?: boolean) => void; setPage: (value: number) => void; clearFilters: () => void;
  clearAdvancedFilters: () => void;
};

export function useProductFilters(): ProductFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serialized = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const status = parseProductStatus(searchParams.get("status"));
  const categoryId = searchParams.get("categoryId")?.trim() || undefined;
  const isFeatured = parseOptionalBoolean(searchParams.get("isFeatured"));
  const isBestSeller = parseOptionalBoolean(searchParams.get("isBestSeller"));
  const page = parseProductPage(searchParams.get("page"));
  const replace = useCallback((query: URLSearchParams) => {
    const next = query.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router]);
  const update = useCallback((values: Record<string, string | number | boolean | null | undefined>, resetPage = false) => {
    const query = new URLSearchParams(serialized);
    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === 1)) query.delete(key);
      else if (value !== undefined) query.set(key, String(value));
    });
    if (resetPage) query.delete("page");
    replace(query);
  }, [replace, serialized]);
  return {
    search, status, categoryId, isFeatured, isBestSeller, page,
    isFiltered: Boolean(search || status || categoryId || isFeatured !== undefined || isBestSeller !== undefined),
    setSearch: useCallback((value: string) => update({ search: value || null }, true), [update]),
    setStatus: useCallback((value?: ProductStatus) => update({ status: value ?? null }, true), [update]),
    setCategoryId: useCallback((value?: string) => update({ categoryId: value ?? null }, true), [update]),
    setFeatured: useCallback((value?: boolean) => update({ isFeatured: value ?? null }, true), [update]),
    setBestSeller: useCallback((value?: boolean) => update({ isBestSeller: value ?? null }, true), [update]),
    setPage: useCallback((value: number) => update({ page: value }), [update]),
    clearAdvancedFilters: useCallback(() => replace(clearProductAdvancedFilterQuery(new URLSearchParams(serialized))), [replace, serialized]),
    clearFilters: useCallback(() => update({ search: null, status: null, categoryId: null, isFeatured: null, isBestSeller: null }, true), [update]),
  };
}
