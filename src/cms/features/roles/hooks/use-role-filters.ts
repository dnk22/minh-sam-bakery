"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type RoleFilters = {
  search: string;
  page: number;
  isFiltered: boolean;
  setSearch: (value: string) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
};

export function parseRolePage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function useRoleFilters(): RoleFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const page = parseRolePage(searchParams.get("page"));

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
    search,
    page,
    isFiltered: Boolean(search),
    setSearch: useCallback((value: string) => updateUrl({ search: value || null }, true), [updateUrl]),
    setPage: useCallback((value: number) => updateUrl({ page: value }), [updateUrl]),
    clearFilters: useCallback(() => updateUrl({ search: null }, true), [updateUrl]),
  };
}
