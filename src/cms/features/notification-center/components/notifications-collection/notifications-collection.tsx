"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import type { CmsNotification, NotificationList } from "../../types";
import { createNotificationColumns, type NotificationActions } from "../notification-columns/notification-columns";
import { NotificationListItem } from "../notification-list-item/notification-list-item";
import styles from "./notifications-collection.module.css";

export function NotificationsCollection({ query, setPage, filterActive, ...actions }: NotificationActions & {
  query: UseQueryResult<NotificationList, Error>;
  setPage: (page: number) => void;
  filterActive: boolean;
}) {
  const columns = useMemo(() => createNotificationColumns(actions), [actions]);
  const list = query.data;
  return <ResponsiveCollection<CmsNotification>
    className={styles.table} columns={columns} data={list?.items ?? []}
    getItemKey={(item) => item.id} getRowId={(item) => item.id}
    getItemLabel={(item) => `Xem ${item.title}`} onItemClick={actions.onDetail}
    loading={query.isLoading} error={query.error instanceof Error ? query.error.message : undefined}
    onRetry={() => query.refetch()} emptyState="Chưa có thông báo nào."
    filteredEmptyState="Không có thông báo phù hợp." isFiltered={filterActive}
    renderItem={(item) => <NotificationListItem item={item} />}
    renderAccessory={(item) => <div className={styles.accessory} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <input type="checkbox" aria-label={`Chọn ${item.title}`} checked={actions.selected.has(item.id)} onChange={(event) => actions.onSelect(item.id, event.target.checked)} />
      <CmsBadge variant={item.isRead ? "secondary" : "default"}>{item.isRead ? "Đã đọc" : "Mới"}</CmsBadge>
    </div>}
    pagination={list ? { meta: list.pagination, onPageChange: setPage } : undefined}
  />;
}
