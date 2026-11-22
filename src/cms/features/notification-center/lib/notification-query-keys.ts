import type { NotificationListParams } from "../types";
export const notificationQueryKeys = {
  all: ["cms", "notifications"] as const,
  lists: () => ["cms", "notifications", "list"] as const,
  list: (params: NotificationListParams) => ["cms", "notifications", "list", params] as const,
  unreadCount: () => ["cms", "notifications", "unread-count"] as const,
  detail: (id: string) => ["cms", "notifications", "detail", id] as const,
};
export const notificationMutationKey = ["cms", "notifications", "mutation"] as const;
export function notificationInvalidationKeys(id?: string) {
  return [notificationQueryKeys.lists(), notificationQueryKeys.unreadCount(), ...(id ? [notificationQueryKeys.detail(id)] : [])] as const;
}
