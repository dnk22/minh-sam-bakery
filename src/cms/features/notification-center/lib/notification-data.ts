import type { BulkReadResult, CmsNotification, NotificationFilter, NotificationList, NotificationListParams, UnreadCount } from "../types";

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const optionalString = (value: unknown) => value === undefined || value === null || typeof value === "string";

export function isCmsNotification(value: unknown): value is CmsNotification {
  return record(value) && typeof value.id === "string" && value.id.length > 0 && typeof value.type === "string" && value.type.length > 0 &&
    typeof value.title === "string" && typeof value.message === "string" && optionalString(value.link) &&
    (value.metadata === undefined || value.metadata === null || record(value.metadata)) && typeof value.isRead === "boolean" &&
    optionalString(value.readAt) && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isNotificationList(value: unknown): value is NotificationList {
  if (!record(value) || !Array.isArray(value.items) || !value.items.every(isCmsNotification) || !record(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages]
    .every((item) => typeof item === "number" && Number.isFinite(item));
}

export const isUnreadCount = (value: unknown): value is UnreadCount => record(value) && typeof value.count === "number" && Number.isSafeInteger(value.count) && value.count >= 0;
export const isBulkReadResult = (value: unknown): value is BulkReadResult => record(value) && typeof value.updated === "number" && Number.isSafeInteger(value.updated) && value.updated >= 0;
export function parseNotificationPage(value: string | null) { const page = Number(value ?? 1); return Number.isSafeInteger(page) && page > 0 ? page : 1; }
export function parseNotificationFilter(value: string | null): NotificationFilter { return value === "read" || value === "unread" ? value : "all"; }
export function notificationFilterValue(filter: "all" | "unread" | "read") { return filter === "read" ? true : filter === "unread" ? false : undefined; }
export function buildNotificationListQuery(params: NotificationListParams) { const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) }); if (params.isRead !== undefined) query.set("isRead", String(params.isRead)); return query.toString(); }
export function notificationStatePath(id: string, state: "read" | "unread") { return `/notifications/${encodeURIComponent(id)}/${state}`; }
