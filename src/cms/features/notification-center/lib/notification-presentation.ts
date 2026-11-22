export function getNotificationTypePresentation(type: string) {
  if (type === "ORDER_CREATED") return { label: "Đơn hàng mới", tone: "order" as const };
  return { label: "Thông báo hệ thống", tone: "default" as const };
}

export function safeCmsNotificationLink(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const url = new URL(value, "https://cms.invalid");
    if (url.origin !== "https://cms.invalid" || (url.pathname !== "/cms" && !url.pathname.startsWith("/cms/"))) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return null; }
}

export function formatNotificationTime(value: string, now = Date.now()) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return value;
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
}
