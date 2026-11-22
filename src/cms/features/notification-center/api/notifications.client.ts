import { cmsApiClient } from "@/cms/lib/api/client";
import { buildNotificationListQuery, notificationStatePath } from "../lib/notification-data";
import type { BulkReadInput, BulkReadResult, CmsNotification, NotificationList, NotificationListParams, UnreadCount } from "../types";
export const getNotifications = (params: NotificationListParams, signal?: AbortSignal) => cmsApiClient.get<NotificationList>(`/notifications?${buildNotificationListQuery(params)}`, { signal });
export const getUnreadCount = (signal?: AbortSignal) => cmsApiClient.get<UnreadCount>("/notifications/unread-count", { signal });
export const getNotification = (id: string, signal?: AbortSignal) => cmsApiClient.get<CmsNotification>(`/notifications/${encodeURIComponent(id)}`, { signal });
export const markNotificationRead = (id: string) => cmsApiClient.patch<CmsNotification>(notificationStatePath(id, "read"));
export const markNotificationUnread = (id: string) => cmsApiClient.patch<CmsNotification>(notificationStatePath(id, "unread"));
export const bulkMarkNotificationsRead = (input: BulkReadInput) => cmsApiClient.post<BulkReadResult>("/notifications/bulk-read", input);
