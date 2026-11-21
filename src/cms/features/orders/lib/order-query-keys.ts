import type { OrderListParams } from "../types";

export const orderQueryKeys = {
  all: ["cms", "orders"] as const,
  lists: () => ["cms", "orders", "list"] as const,
  list: (params: OrderListParams) => ["cms", "orders", "list", params] as const,
  details: () => ["cms", "orders", "detail"] as const,
  detail: (id: string) => ["cms", "orders", "detail", id] as const,
};

export const orderInvalidationKeys = (id: string) => [orderQueryKeys.lists(), orderQueryKeys.detail(id)] as const;
