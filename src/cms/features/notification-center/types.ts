import type { PaginationMetaDto } from "@/lib/api/types";

export type CmsNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationList = { items: CmsNotification[]; pagination: PaginationMetaDto };
export type NotificationListParams = { page: number; limit: number; isRead?: boolean };
export type UnreadCount = { count: number };
export type BulkReadInput = { ids?: string[]; all?: boolean };
export type BulkReadResult = { updated: number };
export type NotificationFilter = "all" | "unread" | "read";
