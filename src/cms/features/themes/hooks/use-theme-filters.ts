"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { parseThemeActive, parseThemePage } from "../lib/theme-data";

export type ThemeFilters = {
  page: number;
  search: string;
  isActive?: boolean;
  isFiltered: boolean;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setActive: (value?: boolean) => void;
  clear: () => void;
};

export function useThemeFilters(): ThemeFilters {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const serialized = params.toString();
  const page = parseThemePage(params.get("page"));
  const search = params.get("search")?.trim() ?? "";
  const isActive = parseThemeActive(params.get("isActive"));

  const change = useCallback((updates: Record<string, string | null>, resetPage = false) => {
    const query = new URLSearchParams(serialized);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || (key === "page" && value === "1")) query.delete(key);
      else query.set(key, value);
    }
    if (resetPage) query.delete("page");
    const next = query.toString();
    router.replace(next ? pathname + "?" + next : pathname, { scroll: false });
  }, [pathname, router, serialized]);

  return {
    page,
    search,
    isActive,
    isFiltered: Boolean(search || isActive !== undefined),
    setPage: useCallback((next) => change({ page: String(next) }), [change]),
    setSearch: useCallback((next) => change({ search: next || null }, true), [change]),
    setActive: useCallback((next) => change({ isActive: next === undefined ? null : String(next) }, true), [change]),
    clear: useCallback(() => change({ search: null, isActive: null }, true), [change]),
  };
}
