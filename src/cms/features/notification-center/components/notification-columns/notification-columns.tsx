import type { ColumnDef } from "@tanstack/react-table";
import { Mail, MailOpen } from "lucide-react";
import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { formatNotificationTime, getNotificationTypePresentation } from "../../lib/notification-presentation";
import type { CmsNotification } from "../../types";
import styles from "./notification-columns.module.css";
export type NotificationActions = { onDetail: (item: CmsNotification) => void; onToggleRead: (item: CmsNotification) => void; onSelect: (id: string, selected: boolean) => void; selected: ReadonlySet<string>; allSelected: boolean; onSelectAll: (selected: boolean) => void; pending: boolean };
export function createNotificationColumns(actions: NotificationActions): ColumnDef<CmsNotification, unknown>[] { return [
  { id: "select", size: 48, header: () => <input className={styles.check} type="checkbox" aria-label="Chọn tất cả thông báo trên trang" checked={actions.allSelected} onChange={(event) => actions.onSelectAll(event.target.checked)} />, cell: ({ row }) => <input className={styles.check} type="checkbox" aria-label={`Chọn ${row.original.title}`} checked={actions.selected.has(row.original.id)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onChange={(event) => actions.onSelect(row.original.id, event.target.checked)} /> },
  { accessorKey: "title", header: "Thông báo", size: 270, cell: ({ row }) => <div className={styles.copy} data-unread={!row.original.isRead || undefined}><strong>{row.original.title}</strong><span>{row.original.message}</span></div> },
  { accessorKey: "type", header: "Loại", size: 140, cell: ({ row }) => <CmsBadge variant="secondary">{getNotificationTypePresentation(row.original.type).label}</CmsBadge> },
  { accessorKey: "createdAt", header: "Thời gian", size: 135, cell: ({ row }) => <time className={styles.time} dateTime={row.original.createdAt}>{formatNotificationTime(row.original.createdAt)}</time> },
  { accessorKey: "isRead", header: "Trạng thái", size: 100, cell: ({ row }) => <CmsBadge variant={row.original.isRead ? "secondary" : "default"}>{row.original.isRead ? "Đã đọc" : "Chưa đọc"}</CmsBadge> },
  { id: "actions", header: "Thao tác", size: 82, cell: ({ row }) => <CmsRowActions onView={() => actions.onDetail(row.original)} viewLabel={`Xem ${row.original.title}`} moreLabel={`Mở thao tác cho ${row.original.title}`} actions={[{ key: "toggle-read", label: row.original.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc", icon: row.original.isRead ? <Mail aria-hidden="true" size={15} /> : <MailOpen aria-hidden="true" size={15} />, disabled: actions.pending, onSelect: () => actions.onToggleRead(row.original) }]} /> },
]; }
