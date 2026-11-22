"use client";

import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsPopover, CmsPopoverContent, CmsPopoverTrigger } from "@/cms/components/ui/popover";

import { useNotificationMutations } from "../../hooks/use-notification-mutations";
import { useNotifications, useUnreadNotificationCount } from "../../hooks/use-notifications";
import { formatNotificationTime, resolveCmsNotificationDestination } from "../../lib/notification-presentation";
import type { CmsNotification } from "../../types";
import styles from "./notification-bell.module.css";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const count = useUnreadNotificationCount();
  const recent = useNotifications({ page: 1, limit: 5 }, open);
  const mutations = useNotificationMutations();
  const pending = mutations.globalPending;
  const unread = count.data?.count ?? 0;
  const countUnavailable = count.isError && !count.data;

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) { void count.refetch(); void recent.refetch(); }
  };
  const activate = (item: CmsNotification) => {
    if (pending) return;
    // Reading is best-effort: a failed update must not prevent navigation.
    if (!item.isRead) mutations.markRead.mutate(item.id);
    setOpen(false);
    router.push(resolveCmsNotificationDestination(item) ?? "/cms/notifications");
  };

  return <CmsPopover open={open} onOpenChange={changeOpen}>
    <CmsPopoverTrigger asChild><CmsButton className={styles.trigger} type="button" size="icon" variant="ghost" aria-label={count.isError ? (countUnavailable ? "Thông báo, chưa thể tải số chưa đọc" : `Thông báo, ${unread} chưa đọc; dữ liệu có thể chưa cập nhật`) : unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}>
      <Bell aria-hidden="true" size={18} />{countUnavailable ? <span className={`${styles.badge} ${styles.badgeError}`} aria-hidden="true">!</span> : unread ? <span className={styles.badge} aria-hidden="true">{unread > 99 ? "99+" : unread}</span> : null}
    </CmsButton></CmsPopoverTrigger>
    <CmsPopoverContent align="end" className={styles.panel} aria-label="Thông báo gần đây">
      <header className={styles.header}><div><h2>Thông báo</h2>{count.isError ? <p role="status">Chưa thể cập nhật số chưa đọc. <button className={styles.retry} type="button" onClick={() => void count.refetch()}>Thử lại</button></p> : unread ? <p>{unread} thông báo chưa đọc</p> : <p>Không có thông báo mới</p>}</div>
        <CmsButton type="button" size="sm" variant="ghost" disabled={pending || (!count.isError && !unread)} onClick={() => mutations.bulkRead.mutate({ all: true })}><CheckCheck aria-hidden="true" size={15} /> Đọc tất cả</CmsButton>
      </header>
      <div className={styles.body}>{recent.isLoading ? <div className={styles.state}><LoaderCircle className={styles.spin} aria-hidden="true" /> Đang tải…</div>
        : recent.error ? <div className={styles.state} role="alert"><span>{recent.error instanceof Error ? recent.error.message : "Không thể tải thông báo."}</span><button type="button" onClick={() => recent.refetch()}>Thử lại</button></div>
        : !recent.data?.items.length ? <p className={styles.state}>Chưa có thông báo.</p>
        : recent.data.items.map((item) => <button type="button" key={item.id} className={styles.item} data-unread={!item.isRead || undefined} disabled={pending} onClick={() => activate(item)}>
          <span className={styles.dot} aria-hidden="true" /><span className={styles.copy}><strong>{item.title}</strong><span>{item.message}</span><time dateTime={item.createdAt}>{formatNotificationTime(item.createdAt)}</time></span>
        </button>)}</div>
      <footer className={styles.footer}><button type="button" onClick={() => { setOpen(false); router.push("/cms/notifications"); }}>Xem tất cả thông báo</button></footer>
    </CmsPopoverContent>
  </CmsPopover>;
}
