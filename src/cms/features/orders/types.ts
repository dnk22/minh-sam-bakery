import type { PaginationMetaDto } from "@/lib/api/types";

import type { Order } from "@/lib/contracts/order/order.types";
export type { Order, OrderStatus, OrderPaymentMethod, OrderItem } from "@/lib/contracts/order/order.types";
export type OrderView = "pending" | "delivery" | "completed" | "history";
export type OrderAction = "detail" | "confirm" | "complete" | "reject";

export type OrderList = { items: Order[]; pagination: PaginationMetaDto };
export type OrderListParams = {
  page: number;
  limit: number;
  createdFrom: string;
  createdTo: string;
  search?: string;
  deliveryDate?: string;
  deliveryTime?: string;
};
export type UpdateOrderStatusInput = { status: "CONFIRMED" | "REJECTED" | "COMPLETED" };
export type OrderModalState = { id: string; section?: OrderAction } | null;
