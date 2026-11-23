"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useNotificationFilters } from "../../hooks/use-notification-filters";
import { useNotificationMutations } from "../../hooks/use-notification-mutations";
import { useNotifications } from "../../hooks/use-notifications";
import { notificationFilterValue } from "../../lib/notification-data";
import type { CmsNotification } from "../../types";
import { NotificationDetailModal } from "../notification-detail-modal/notification-detail-modal";
import { NotificationToolbar } from "../notification-toolbar/notification-toolbar";
import { NotificationsCollection } from "../notifications-collection/notifications-collection";
import styles from "./notifications-page.module.css";

const PAGE_SIZE = 20;

export function NotificationsPage() {
  const filters = useNotificationFilters();
  const query = useNotifications({ page: filters.page, limit: PAGE_SIZE, isRead: notificationFilterValue(filters.filter) });
  const mutations = useNotificationMutations();
  const [detailId, setDetailId] = useState<string | null>(null);
  const sessionKey = `${filters.filter}:${filters.page}:${query.data?.items.map((item) => item.id).join(",") ?? "loading"}`;
  const [selection, setSelection] = useState<{ key: string; ids: Set<string> }>({ key: "", ids: new Set() });
  const selected = selection.key === sessionKey ? selection.ids : new Set<string>();
  const items = query.data?.items ?? [];
  const pending = mutations.globalPending;

  useEffect(() => {
    const totalPages = query.data?.pagination.totalPages;
    if (!query.isPlaceholderData && totalPages !== undefined && filters.page > Math.max(1, totalPages)) filters.setPage(Math.max(1, totalPages));
  }, [filters, query.data?.pagination.totalPages, query.isPlaceholderData]);

  const updateSelection = (updater: (ids: Set<string>) => void) => setSelection((current) => {
    const ids = new Set(current.key === sessionKey ? current.ids : []);
    updater(ids);
    return { key: sessionKey, ids };
  });
  const toggleRead = useCallback((item: CmsNotification) => {
    if (pending) return;
    if (item.isRead) mutations.markUnread.mutate(item.id);
    else mutations.markRead.mutate(item.id);
  }, [mutations.markRead, mutations.markUnread, pending]);
  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const readSelected = () => {
    if (!selected.size || pending) return;
    mutations.bulkRead.mutate({ ids: [...selected] }, { onSuccess: () => setSelection({ key: sessionKey, ids: new Set() }) });
  };

  return <CmsMain className={styles.main}>
    <header className={styles.heading}><div><h1>Thông báo</h1><p>Theo dõi hoạt động mới và cập nhật trạng thái thông báo.</p></div><CmsButton className="cms-page-header-action" type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><RefreshCw aria-hidden="true" size={17} /> {query.isFetching ? "Đang tải…" : "Làm mới"}</CmsButton></header>
    <NotificationToolbar filter={filters.filter} selectedCount={selected.size} pending={pending} onFilter={filters.setFilter} onReadSelected={readSelected} onReadAll={() => { if (!pending) mutations.bulkRead.mutate({ all: true }); }} />
    <NotificationsCollection query={query} setPage={filters.setPage} filterActive={filters.filter !== "all"} onDetail={(item) => setDetailId(item.id)} onToggleRead={toggleRead}
      onSelect={(id, checked) => updateSelection((ids) => { if (checked) ids.add(id); else ids.delete(id); })} selected={selected} allSelected={allSelected}
      onSelectAll={(checked) => updateSelection((ids) => { items.forEach((item) => { if (checked) ids.add(item.id); else ids.delete(item.id); }); })} pending={pending} />
    <NotificationDetailModal id={detailId} onClose={() => setDetailId(null)} />
  </CmsMain>;
}
