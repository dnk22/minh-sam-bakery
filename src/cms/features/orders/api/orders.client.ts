import { cmsApiClient } from "@/cms/lib/api/client";

import { serializeOrderListParams } from "../lib/order-data";
import type { Order, OrderList, OrderListParams, OrderView, UpdateOrderStatusInput } from "../types";

export function getOrders(view: OrderView, params: OrderListParams, signal?: AbortSignal) {
  const query = serializeOrderListParams(params);
  const path = view === "history" ? "/orders/history" : "/orders";
  if (view !== "history") query.set("view", view);
  return cmsApiClient.get<OrderList>(`${path}?${query}`, { signal });
}

export const getOrder = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<Order>(`/orders/${encodeURIComponent(id)}`, { signal });

export const updateOrderStatus = (id: string, input: UpdateOrderStatusInput) =>
  cmsApiClient.put<Order>(`/orders/${encodeURIComponent(id)}/update`, input);
