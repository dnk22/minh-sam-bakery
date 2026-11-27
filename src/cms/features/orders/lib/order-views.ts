import type { OrderAction, OrderStatus, OrderView, UpdateOrderStatusInput } from "../types.ts";

export const ORDER_VIEW_CONFIG: Record<OrderView, {
  title: string;
  description: string;
  endpoint: "orders" | "history";
  statuses: readonly OrderStatus[];
  actions: readonly OrderAction[];
}> = {
  pending: {
    title: "Chờ xác nhận",
    description: "Đơn hàng cần xác nhận hoặc liên hệ lại khách hàng.",
    endpoint: "orders",
    statuses: ["PENDING_CONFIRMATION", "NEED_CALLBACK"],
    actions: ["detail", "confirm", "reject"],
  },
  delivery: {
    title: "Đợi giao hàng",
    description: "Các đơn đã được xác nhận và đang chờ giao.",
    endpoint: "orders",
    statuses: ["CONFIRMED"],
    actions: ["detail", "complete", "reject"],
  },
  completed: {
    title: "Hoàn thành",
    description: "Các đơn đã được Backend chuyển sang trạng thái hoàn thành.",
    endpoint: "orders",
    statuses: ["COMPLETED"],
    actions: ["detail"],
  },
  history: {
    title: "Lịch sử",
    description: "Lịch sử đơn từ chối và đơn hoàn thành.",
    endpoint: "history",
    statuses: ["REJECTED", "COMPLETED"],
    actions: ["detail"],
  },
};

export function isOrderView(value: string): value is OrderView {
  return Object.prototype.hasOwnProperty.call(ORDER_VIEW_CONFIG, value);
}

export function canPerformOrderAction(view: OrderView, status: OrderStatus, action: OrderAction) {
  if (action === "detail") return true;
  if (view === "pending" && (status === "PENDING_CONFIRMATION" || status === "NEED_CALLBACK")) {
    return action === "confirm" || action === "reject";
  }
  return view === "delivery" && status === "CONFIRMED" && (action === "reject" || action === "complete");
}

export function targetOrderStatus(action: Exclude<OrderAction, "detail">): UpdateOrderStatusInput["status"] {
  return ORDER_ACTION_CONFIG[action].status;
}

export const ORDER_ACTION_CONFIG = {
  confirm: { status: "CONFIRMED", label: "Xác nhận", title: "Xác nhận đơn hàng", confirmLabel: "Xác nhận đơn", verb: "xác nhận", destructive: false },
  complete: { status: "COMPLETED", label: "Hoàn thành", title: "Hoàn thành đơn hàng", confirmLabel: "Hoàn thành đơn", verb: "hoàn thành", destructive: false },
  reject: { status: "REJECTED", label: "Từ chối", title: "Từ chối đơn hàng", confirmLabel: "Từ chối đơn", verb: "từ chối", destructive: true },
} as const satisfies Record<Exclude<OrderAction, "detail">, { status: UpdateOrderStatusInput["status"]; label: string; title: string; confirmLabel: string; verb: string; destructive: boolean }>;
