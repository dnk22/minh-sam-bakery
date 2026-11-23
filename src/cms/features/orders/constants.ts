import type { CmsBadgeVariant } from "@/cms/components/ui/badge/badge";

import type { OrderPaymentMethod, OrderStatus } from "./types";

export const ORDER_STATUSES = ["PENDING_CONFIRMATION", "REJECTED", "CONFIRMED", "NEED_CALLBACK", "COMPLETED"] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_OPTIONS: ReadonlyArray<{ value: OrderStatus; label: string }> = [
  { value: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "CONFIRMED", label: "Chờ giao hàng" },
  { value: "NEED_CALLBACK", label: "Cần gọi lại" },
  { value: "COMPLETED", label: "Hoàn thành" },
];

export function getOrderStatusPresentation(status: OrderStatus): { label: string; variant: CmsBadgeVariant } {
  if (status === "CONFIRMED") return { label: "Chờ giao hàng", variant: "success" };
  if (status === "COMPLETED") return { label: "Hoàn thành", variant: "default" };
  if (status === "REJECTED") return { label: "Từ chối", variant: "destructive" };
  if (status === "NEED_CALLBACK") return { label: "Cần gọi lại", variant: "warning" };
  return { label: "Chờ xác nhận", variant: "secondary" };
}

export function getOrderPaymentLabel(method: OrderPaymentMethod) {
  return method === "BANK_TRANSFER" ? "Chuyển khoản" : "Thanh toán tại quán";
}
