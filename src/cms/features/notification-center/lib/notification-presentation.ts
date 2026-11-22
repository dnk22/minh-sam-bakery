import { validOrderId } from "../../orders/lib/order-data.ts";
import type { CmsNotification } from "../types.ts";

export function getNotificationTypePresentation(type: string) {
  if (type === "ORDER_CREATED") return { label: "Đơn hàng mới", tone: "order" as const };
  return { label: "Thông báo hệ thống", tone: "default" as const };
}

export function safeCmsNotificationLink(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const url = new URL(value, "https://cms.invalid");
    if (url.origin !== "https://cms.invalid" || (url.pathname !== "/cms" && !url.pathname.startsWith("/cms/"))) return null;
    // The order detail screen is a modal on /cms/orders, not a dynamic route.
    const orderMatch = /^\\/cms\\/orders\\/([^/]+)\\/?$/.exec(url.pathname);
    if (orderMatch) {
      const orderId = decodeURIComponent(orderMatch[1]);
      if (!validOrderId(orderId)) return null;
      url.searchParams.set("orderId", orderId);
      return `/cms/orders${url.search}${url.hash}`;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return null; }
}

/** Prefer a validated CMS link; ORDER_CREATED can also carry an orderId in metadata. */
export function resolveCmsNotificationDestination(
  notification: Pick<CmsNotification, "type" | "link" | "metadata">,
): string | null {
  const link = safeCmsNotificationLink(notification.link);
  if (link) return link;

  const orderId = notification.metadata?.orderId;
  if (notification.type === "ORDER_CREATED" && typeof orderId === "string" && validOrderId(orderId)) {
    const params = new URLSearchParams({ orderId });
    return `/cms/orders?${params.toString()}`;
  }
  return null;
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
