"use client";

import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsPopover, CmsPopoverContent, CmsPopoverTrigger } from "@/cms/components/ui/popover";

import { useNotificationMutations } from "../../hooks/use-notification-mutations";
import { useNotifications, useUnreadNotificationCount } from "../../hooks/use-notifications";
import { formatNotificationTime, safeCmsNotificationLink } from "../../lib/notification-presentation";
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

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) { void count.refetch(); void recent.refetch(); }
  };
  const activate = async (item: CmsNotification) => {
    if (pending) return;
    if (!item.isRead) { try { await mutations.markRead.mutateAsync(item.id); } catch { return; } }
    setOpen(false);
    router.push(safeCmsNotificationLink(item.link) ?? "/cms/notifications");
  };

  return <CmsPopover open={open} onOpenChange={changeOpen}>
    <CmsPopoverTrigger asChild><CmsButton className={styles.trigger} type="button" size="icon" variant="ghost" aria-label={unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}>
      <Bell aria-hidden="true" size={18} />{unread ? <span className={styles.badge} aria-hidden="true">{unread > 99 ? "99+" : unread}</span> : null}
    </CmsButton></CmsPopoverTrigger>
    <CmsPopoverContent align="end" className={styles.panel} aria-label="Thông báo gần đây">
      <header className={styles.header}><div><h2>Thông báo</h2>{unread ? <p>{unread} thông báo chưa đọc</p> : <p>Không có thông báo mới</p>}</div>
        <CmsButton type="button" size="sm" variant="ghost" disabled={!unread || pending} onClick={() => mutations.bulkRead.mutate({ all: true })}><CheckCheck aria-hidden="true" size={15} /> Đọc tất cả</CmsButton>
      </header>
      <div className={styles.body}>{recent.isLoading ? <div className={styles.state}><LoaderCircle className={styles.spin} aria-hidden="true" /> Đang tải…</div>
        : recent.error ? <div className={styles.state} role="alert"><span>{recent.error instanceof Error ? recent.error.message : "Không thể tải thông báo."}</span><button type="button" onClick={() => recent.refetch()}>Thử lại</button></div>
        : !recent.data?.items.length ? <p className={styles.state}>Chưa có thông báo.</p>
        : recent.data.items.map((item) => <button type="button" key={item.id} className={styles.item} data-unread={!item.isRead || undefined} disabled={pending} onClick={() => void activate(item)}>
          <span className={styles.dot} aria-hidden="true" /><span className={styles.copy}><strong>{item.title}</strong><span>{item.message}</span><time dateTime={item.createdAt}>{formatNotificationTime(item.createdAt)}</time></span>
        </button>)}</div>
      <footer className={styles.footer}><button type="button" onClick={() => { setOpen(false); router.push("/cms/notifications"); }}>Xem tất cả thông báo</button></footer>
    </CmsPopoverContent>
  </CmsPopover>;
}
