"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { parseSystemConfigPage } from "../lib/system-config-data";

export type SystemConfigFilters = { search: string; page: number; isFiltered: boolean; applyFilters: (values: Pick<SystemConfigFilters, "search">) => void; setSearch: (value: string) => void; setPage: (value: number) => void; clearFilters: () => void };

export function useSystemConfigFilters(): SystemConfigFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const page = parseSystemConfigPage(searchParams.get("page"));
  const updateUrl = useCallback((values: { search?: string | null; page?: number | null }, resetPage = false) => {
    const query = new URLSearchParams(serializedParams);
    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === 1)) query.delete(key);
      else if (value !== undefined) query.set(key, String(value));
    });
    if (resetPage) query.delete("page");
    const next = query.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router, serializedParams]);
  return {
    search, page, isFiltered: Boolean(search),
    applyFilters: useCallback((values: Pick<SystemConfigFilters, "search">) => updateUrl({ search: values.search.trim() || null }, true), [updateUrl]),
    setSearch: useCallback((value: string) => updateUrl({ search: value || null }, true), [updateUrl]),
    setPage: useCallback((value: number) => updateUrl({ page: value }), [updateUrl]),
    clearFilters: useCallback(() => updateUrl({ search: null }, true), [updateUrl]),
  };
}
