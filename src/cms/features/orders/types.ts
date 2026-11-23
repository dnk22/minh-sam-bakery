import type { PaginationMetaDto } from "@/lib/api/types";

export type OrderStatus = "PENDING_CONFIRMATION" | "REJECTED" | "CONFIRMED" | "NEED_CALLBACK" | "COMPLETED";
export type OrderView = "pending" | "delivery" | "completed" | "history";
export type OrderAction = "detail" | "confirm" | "reject";
export type OrderPaymentMethod = "AT_STORE" | "BANK_TRANSFER";

export type OrderProductItem = {
  id: string;
  sku: string;
  name: string;
  unitPrice: string;
  imageUrl?: string | null;
};

export type Order = {
  id: string;
  email?: string | null;
  phone: string;
  shippingAddress: string;
  fullName?: string | null;
  note?: string | null;
  paymentMethod: OrderPaymentMethod;
  paymentImageUrl?: string | null;
  status: OrderStatus;
  deliveryDate?: string | null;
  deliveryTime?: string | null;
  productIds: string[];
  totalAmount: string;
  products: OrderProductItem[];
  createdAt: string;
  updatedAt: string;
};

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
export type UpdateOrderStatusInput = { status: "CONFIRMED" | "REJECTED" };
export type OrderModalState = { id: string; section?: OrderAction } | null;
