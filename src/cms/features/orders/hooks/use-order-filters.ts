"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { isCalendarDate } from "../lib/order-format";
import { clearOrderAdvancedFilterQuery, clearOrderFilterQuery, parseOrderPage, parseOrderStatuses } from "../lib/order-data";
import type { OrderStatus } from "../types";

export type OrderFilters = {
  search: string;
  statuses: OrderStatus[];
  deliveryDate?: string;
  deliveryTime: string;
  sortCreated: "asc" | "desc";
  page: number;
  isFiltered: boolean;
  setSearch: (value: string) => void;
  setStatuses: (values: OrderStatus[]) => void;
  setDeliveryDate: (value?: string) => void;
  setDeliveryTime: (value: string) => void;
  setSortCreated: (value: "asc" | "desc") => void;
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
  const statuses = parseOrderStatuses(searchParams.getAll("status"));
  const rawDate = searchParams.get("deliveryDate")?.trim();
  const deliveryDate = rawDate && isCalendarDate(rawDate) ? rawDate : undefined;
  const deliveryTime = searchParams.get("deliveryTime")?.trim() ?? "";
  const sortCreated = searchParams.get("sortCreated") === "asc" ? "asc" : "desc";
  const page = parseOrderPage(searchParams.get("page"));

  const commit = useCallback((mutate: (query: URLSearchParams) => void, resetPage = false) => {
    const query = new URLSearchParams(serialized);
    mutate(query);
    if (resetPage) query.delete("page");
    const next = query.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router, serialized]);

  return {
    search,
    statuses,
    deliveryDate,
    deliveryTime,
    sortCreated,
    page,
    isFiltered: Boolean(search || statuses.length || deliveryDate || deliveryTime || sortCreated !== "desc"),
    setSearch: useCallback((value: string) => commit((query) => value ? query.set("search", value) : query.delete("search"), true), [commit]),
    setStatuses: useCallback((values: OrderStatus[]) => commit((query) => {
      query.delete("status");
      values.forEach((status) => query.append("status", status));
    }, true), [commit]),
    setDeliveryDate: useCallback((value?: string) => commit((query) => value ? query.set("deliveryDate", value) : query.delete("deliveryDate"), true), [commit]),
    setDeliveryTime: useCallback((value: string) => commit((query) => value ? query.set("deliveryTime", value) : query.delete("deliveryTime"), true), [commit]),
    setSortCreated: useCallback((value: "asc" | "desc") => commit((query) => value === "asc" ? query.set("sortCreated", value) : query.delete("sortCreated"), true), [commit]),
    setPage: useCallback((value: number) => commit((query) => value > 1 ? query.set("page", String(value)) : query.delete("page")), [commit]),
    clearAdvancedFilters: useCallback(() => commit(clearOrderAdvancedFilterQuery), [commit]),
    clearFilters: useCallback(() => commit(clearOrderFilterQuery), [commit]),
  };
}
