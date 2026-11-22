"use client";
import { useQuery } from "@tanstack/react-query";
import { getNotification, getNotifications, getUnreadCount } from "../api/notifications.client";
import { notificationQueryKeys } from "../lib/notification-query-keys";
import type { NotificationListParams } from "../types";
export const NOTIFICATION_POLL_INTERVAL_MS = 60_000;
export const useNotifications = (params: NotificationListParams, enabled = true) => useQuery({ queryKey: notificationQueryKeys.list(params), queryFn: ({ signal }) => getNotifications(params, signal), enabled, staleTime: 15_000 });
export const useNotificationDetail = (id?: string) => useQuery({ queryKey: notificationQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getNotification(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
export const useUnreadNotificationCount = () => useQuery({ queryKey: notificationQueryKeys.unreadCount(), queryFn: ({ signal }) => getUnreadCount(signal), staleTime: 30_000, refetchInterval: NOTIFICATION_POLL_INTERVAL_MS, refetchIntervalInBackground: false, refetchOnWindowFocus: true });
