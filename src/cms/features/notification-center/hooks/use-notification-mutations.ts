"use client";
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/cms/lib/notifications";
import { bulkMarkNotificationsRead, markNotificationRead, markNotificationUnread } from "../api/notifications.client";
import { notificationInvalidationKeys, notificationMutationKey, notificationQueryKeys } from "../lib/notification-query-keys";
import type { BulkReadInput } from "../types";
export function useNotificationMutations() { const client = useQueryClient(); const globalPending = useIsMutating({ mutationKey: notificationMutationKey }) > 0; const common = { mutationKey: notificationMutationKey, scope: { id: "cms-notification-state" } } as const; const invalidate = async (id?: string) => Promise.all(notificationInvalidationKeys(id).map((queryKey) => client.invalidateQueries({ queryKey }))); return {
  globalPending,
  markRead: useMutation({ ...common, mutationFn: markNotificationRead, onSuccess: async (item) => { client.setQueryData(notificationQueryKeys.detail(item.id), item); await invalidate(item.id); }, onError: () => notify.error("Không thể đánh dấu thông báo đã đọc.", "notification-state") }),
  markUnread: useMutation({ ...common, mutationFn: markNotificationUnread, onSuccess: async (item) => { client.setQueryData(notificationQueryKeys.detail(item.id), item); await invalidate(item.id); }, onError: () => notify.error("Không thể đánh dấu thông báo chưa đọc.", "notification-state") }),
  bulkRead: useMutation({ ...common, mutationFn: (input: BulkReadInput) => bulkMarkNotificationsRead(input), onSuccess: async (result) => { await invalidate(); notify.success(result.updated > 0 ? `Đã cập nhật ${result.updated} thông báo.` : "Không có thông báo cần cập nhật.", "notification-bulk"); }, onError: () => notify.error("Không thể cập nhật các thông báo.", "notification-bulk") }),
}; }
