"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { UserStatus } from "../types";
import { clearUserAdvancedFilterQuery, parseUserPage, parseUserStatus } from "../lib/user-filter-data";

export type UserFilters = {
  search: string;
  status?: UserStatus;
  roleId?: string;
  page: number;
  isFiltered: boolean;
  applyFilters: (values: Pick<UserFilters, "search" | "status" | "roleId">) => void; setSearch: (value: string) => void;
  setStatus: (value?: UserStatus) => void;
  setRoleId: (value?: string) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
  clearAdvancedFilters: () => void;
};

export function useUserFilters(): UserFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const status = parseUserStatus(searchParams.get("status"));
  const roleId = searchParams.get("roleId")?.trim() || undefined;
  const page = parseUserPage(searchParams.get("page"));
  const replace = useCallback((query: URLSearchParams) => {
    const next = query.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router]);

  const updateUrl = useCallback((values: Partial<{ search: string | null; status: UserStatus | null; roleId: string | null; page: number | null }>, resetPage = false) => {
    const query = new URLSearchParams(serializedParams);
    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === 1)) query.delete(key);
      else if (value !== undefined) query.set(key, String(value));
    });
    if (resetPage) query.delete("page");
    replace(query);
  }, [replace, serializedParams]);

  return {
    search, status, roleId, page,
    isFiltered: Boolean(search || status || roleId),
    applyFilters: useCallback((values: Pick<UserFilters, "search" | "status" | "roleId">) => updateUrl({ search: values.search.trim() || null, status: values.status ?? null, roleId: values.roleId ?? null }, true), [updateUrl]),
    setSearch: useCallback((value: string) => updateUrl({ search: value || null }, true), [updateUrl]),
    setStatus: useCallback((value?: UserStatus) => updateUrl({ status: value ?? null }, true), [updateUrl]),
    setRoleId: useCallback((value?: string) => updateUrl({ roleId: value ?? null }, true), [updateUrl]),
    setPage: useCallback((value: number) => updateUrl({ page: value }), [updateUrl]),
    clearAdvancedFilters: useCallback(() => replace(clearUserAdvancedFilterQuery(new URLSearchParams(serializedParams))), [replace, serializedParams]),
    clearFilters: useCallback(() => updateUrl({ search: null, status: null, roleId: null }, true), [updateUrl]),
  };
}
