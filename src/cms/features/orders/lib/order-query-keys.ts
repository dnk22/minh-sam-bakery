import type { OrderListParams, OrderView } from "../types";

export const orderQueryKeys = {
  all: ["cms", "orders"] as const,
  lists: () => ["cms", "orders", "list"] as const,
  list: (view: OrderView, params: OrderListParams) => ["cms", "orders", "list", view, params] as const,
  details: () => ["cms", "orders", "detail"] as const,
  detail: (id: string) => ["cms", "orders", "detail", id] as const,
};

export const orderInvalidationKeys = (id: string) => [orderQueryKeys.lists(), orderQueryKeys.detail(id)] as const;
