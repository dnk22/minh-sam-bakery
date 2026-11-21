import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isOrder, isOrderList } from "../lib/order-data";
import type { Order, OrderList, OrderListParams, UpdateOrderStatusInput } from "../types";

export async function backendOrderList(accessToken: string, params: OrderListParams, signal?: AbortSignal): Promise<OrderList> {
  return (await backendRequest({
    path: "/api/v1/orders",
    query: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.statuses,
      deliveryDate: params.deliveryDate,
      deliveryTime: params.deliveryTime,
      sortCreated: params.sortCreated,
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
    accessToken,
    cache: "no-store",
    signal,
    validate: isOrder,
  })).data;
}

export async function backendUpdateOrderStatus(accessToken: string, id: string, input: UpdateOrderStatusInput, signal?: AbortSignal): Promise<Order> {
  return (await backendRequest({
    path: `/api/v1/orders/${encodeURIComponent(id)}/update`,
    method: "PUT",
    body: input,
    accessToken,
    cache: "no-store",
    signal,
    validate: isOrder,
  })).data;
}
