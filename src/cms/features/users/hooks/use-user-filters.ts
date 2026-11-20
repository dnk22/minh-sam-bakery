"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { UserStatus } from "../types";
import { parseUserPage, parseUserStatus } from "../lib/user-filter-data";

export type UserFilters = {
  search: string;
  status?: UserStatus;
  roleId?: string;
  page: number;
  isFiltered: boolean;
  setSearch: (value: string) => void;
  setStatus: (value?: UserStatus) => void;
  setRoleId: (value?: string) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
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

  const updateUrl = useCallback((values: Partial<{ search: string | null; status: UserStatus | null; roleId: string | null; page: number | null }>, resetPage = false) => {
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
    search, status, roleId, page,
    isFiltered: Boolean(search || status || roleId),
    setSearch: useCallback((value: string) => updateUrl({ search: value || null }, true), [updateUrl]),
    setStatus: useCallback((value?: UserStatus) => updateUrl({ status: value ?? null }, true), [updateUrl]),
    setRoleId: useCallback((value?: string) => updateUrl({ roleId: value ?? null }, true), [updateUrl]),
    setPage: useCallback((value: number) => updateUrl({ page: value }), [updateUrl]),
    clearFilters: useCallback(() => updateUrl({ search: null, status: null, roleId: null }, true), [updateUrl]),
  };
}
