"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { clearOrderAdvancedFilterQuery, clearOrderFilterQuery, parseOrderPage } from "../lib/order-data";
import { getDefaultOrderCreatedRange, isCalendarDate, isValidOrderCreatedRange } from "../lib/order-format";

export type OrderFilters = {
  search: string;
  createdFrom: string;
  createdTo: string;
  deliveryDate?: string;
  deliveryTime: string;
  page: number;
  isFiltered: boolean;
  setSearch: (value: string) => void;
  setCreatedRange: (range: { createdFrom: string; createdTo: string }) => void;
  setDeliveryDate: (value?: string) => void;
  setDeliveryTime: (value: string) => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
  clearAdvancedFilters: () => void;
};

export function useOrderFilters(): OrderFilters {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serialized = searchParams.toString();
  const search = searchParams.get("search")?.trim() ?? "";
  const initial = getDefaultOrderCreatedRange();
  const rawFrom = searchParams.get("createdFrom") ?? initial.createdFrom;
  const rawTo = searchParams.get("createdTo") ?? initial.createdTo;
  const validRange = isValidOrderCreatedRange(rawFrom, rawTo);
  const createdFrom = validRange ? rawFrom : initial.createdFrom;
  const createdTo = validRange ? rawTo : initial.createdTo;
  const rawDate = searchParams.get("deliveryDate")?.trim();
  const deliveryDate = rawDate && isCalendarDate(rawDate) ? rawDate : undefined;
  const deliveryTime = searchParams.get("deliveryTime")?.trim() ?? "";
  const page = parseOrderPage(searchParams.get("page"));

  const commit = useCallback((mutate: (query: URLSearchParams) => void, resetPage = false) => {
    const query = new URLSearchParams(serialized);
    mutate(query);
    if (resetPage) query.delete("page");
    const next = query.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router, serialized]);

  return {
    search, createdFrom, createdTo, deliveryDate, deliveryTime, page,
    isFiltered: Boolean(search || deliveryDate || deliveryTime ||
      createdFrom !== initial.createdFrom || createdTo !== initial.createdTo),
    setSearch: useCallback((value: string) => commit((query) => value ? query.set("search", value) : query.delete("search"), true), [commit]),
    setCreatedRange: useCallback(({ createdFrom: from, createdTo: to }) => {
      if (!isValidOrderCreatedRange(from, to)) return;
      commit((query) => { query.set("createdFrom", from); query.set("createdTo", to); }, true);
    }, [commit]),
    setDeliveryDate: useCallback((value?: string) => commit((query) => value ? query.set("deliveryDate", value) : query.delete("deliveryDate"), true), [commit]),
    setDeliveryTime: useCallback((value: string) => commit((query) => value ? query.set("deliveryTime", value) : query.delete("deliveryTime"), true), [commit]),
    setPage: useCallback((value: number) => commit((query) => value > 1 ? query.set("page", String(value)) : query.delete("page")), [commit]),
    clearAdvancedFilters: useCallback(() => commit(clearOrderAdvancedFilterQuery), [commit]),
    clearFilters: useCallback(() => commit((query) => { const defaults = getDefaultOrderCreatedRange(); clearOrderFilterQuery(query); query.set("createdFrom", defaults.createdFrom); query.set("createdTo", defaults.createdTo); }, true), [commit]),
  };
}
