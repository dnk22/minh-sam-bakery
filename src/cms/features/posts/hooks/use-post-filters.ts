"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { clearPostAdvancedFilterQuery, parsePostBoolean, parsePostPage, parsePostStatus } from "../lib/post-data";
import type { PostStatus } from "../types";

export type PostFilters = { search: string; status?: PostStatus; showOnLanding?: boolean; page: number; isFiltered: boolean; setSearch: (value: string) => void; setStatus: (value?: PostStatus) => void; setShowOnLanding: (value?: boolean) => void; setPage: (value: number) => void; clearFilters: () => void; clearAdvancedFilters: () => void };
export function usePostFilters(): PostFilters {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams(); const serialized = params.toString();
  const search = params.get("search")?.trim() ?? ""; const status = parsePostStatus(params.get("status")); const showOnLanding = parsePostBoolean(params.get("showOnLanding")); const page = parsePostPage(params.get("page"));
  const replace = useCallback((query: URLSearchParams) => { const next = query.toString(); router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false }); }, [pathname, router]);
  const update = useCallback((values: Record<string, string | number | boolean | null | undefined>, resetPage = false) => { const query = new URLSearchParams(serialized); Object.entries(values).forEach(([key, value]) => { if (value === null) query.delete(key); else if (value !== undefined) query.set(key, String(value)); }); if (resetPage) query.delete("page"); replace(query); }, [replace, serialized]);
  return { search, status, showOnLanding, page, isFiltered: Boolean(search || status || showOnLanding !== undefined),
    setSearch: useCallback((value) => update({ search: value || null }, true), [update]), setStatus: useCallback((value) => update({ status: value ?? null }, true), [update]),
    setShowOnLanding: useCallback((value) => update({ showOnLanding: value ?? null }, true), [update]), setPage: useCallback((value) => update({ page: value > 1 ? value : null }), [update]),
    clearFilters: useCallback(() => update({ search: null, status: null, showOnLanding: null }, true), [update]),
    clearAdvancedFilters: useCallback(() => replace(clearPostAdvancedFilterQuery(new URLSearchParams(serialized))), [replace, serialized]) };
}
