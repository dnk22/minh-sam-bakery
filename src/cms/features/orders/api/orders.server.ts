import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isOrder, isOrderList } from "../lib/order-data";
import { ORDER_VIEW_CONFIG } from "../lib/order-views";
import type { Order, OrderList, OrderListParams, OrderView, UpdateOrderStatusInput } from "../types";

export async function backendOrderList(
  accessToken: string, view: OrderView, params: OrderListParams, signal?: AbortSignal,
): Promise<OrderList> {
  const config = ORDER_VIEW_CONFIG[view];
  return (await backendRequest({
    path: config.endpoint === "history" ? "/api/v1/orders/history" : "/api/v1/orders",
    query: {
      page: params.page,
      limit: params.limit,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
      search: params.search,
      status: [...config.statuses],
      deliveryDate: params.deliveryDate,
      deliveryTime: params.deliveryTime,
    },
    accessToken,
    cache: "no-store",
    signal,
    validate: isOrderList,
  })).data;
}

export async function backendOrderDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Order> {
  return (await backendRequest({
    path: `/api/v1/orders/${encodeURIComponent(id)}`,
    accessToken, cache: "no-store", signal, validate: isOrder,
  })).data;
}

export async function backendUpdateOrderStatus(
  accessToken: string, id: string, input: UpdateOrderStatusInput, signal?: AbortSignal,
): Promise<Order> {
  return (await backendRequest({
    path: `/api/v1/orders/${encodeURIComponent(id)}/update`,
    method: "PUT", body: input, accessToken, cache: "no-store", signal, validate: isOrder,
  })).data;
}
