"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getOrder, getOrders } from "../api/orders.client";
import { orderQueryKeys } from "../lib/order-query-keys";
import type { OrderListParams } from "../types";

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: ({ signal }) => getOrders(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
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
