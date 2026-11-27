import type { DashboardPreset } from "./types";

export const DASHBOARD_PRESETS: { value: DashboardPreset; label: string }[] = [
  { value: "today", label: "Hôm nay" }, { value: "yesterday", label: "Hôm qua" },
  { value: "last7", label: "7 ngày gần nhất" }, { value: "last30", label: "30 ngày gần nhất" },
  { value: "month", label: "Tháng này" }, { value: "previousMonth", label: "Tháng trước" },
  { value: "year", label: "Năm nay" }, { value: "custom", label: "Tùy chỉnh" },
];
export const ORDER_STATUS_LABELS = {
  PENDING_CONFIRMATION: "Chờ xác nhận", REJECTED: "Từ chối", CONFIRMED: "Đợi giao hàng",
  NEED_CALLBACK: "Cần gọi lại", COMPLETED: "Hoàn thành",
} as const;
