"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getOrder, getOrders } from "../api/orders.client";
import { orderQueryKeys } from "../lib/order-query-keys";
import type { OrderListParams, OrderView } from "../types";

export function useOrders(view: OrderView, params: OrderListParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(view, params),
    queryFn: ({ signal }) => getOrders(view, params, signal),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useOrderDetail(id?: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(id ?? ""),
    queryFn: ({ signal }) => getOrder(id ?? "", signal),
    enabled: Boolean(id),
    staleTime: 5_000,
    retry: false,
  });
}
