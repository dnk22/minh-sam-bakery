import { cmsApiClient } from "@/cms/lib/api/client";

import { serializeOrderListParams } from "../lib/order-data";
import type { Order, OrderList, OrderListParams, UpdateOrderStatusInput } from "../types";

export function getOrders(params: OrderListParams, signal?: AbortSignal) {
  return cmsApiClient.get<OrderList>(`/orders?${serializeOrderListParams(params)}`, { signal });
}

export const getOrder = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<Order>(`/orders/${encodeURIComponent(id)}`, { signal });

export const updateOrderStatus = (id: string, input: UpdateOrderStatusInput) =>
  cmsApiClient.put<Order>(`/orders/${encodeURIComponent(id)}/update`, input);
