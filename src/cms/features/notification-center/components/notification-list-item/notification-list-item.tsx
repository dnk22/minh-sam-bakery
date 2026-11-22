import { Bell } from "lucide-react";
import { formatNotificationTime } from "../../lib/notification-presentation";
import type { CmsNotification } from "../../types";
import styles from "./notification-list-item.module.css";
export function NotificationListItem({ item }: { item: CmsNotification }) { return <div className={styles.item} data-unread={!item.isRead || undefined}><span className={styles.icon}><Bell aria-hidden="true" /></span><span className={styles.copy}><strong>{item.title}</strong><span>{item.message}</span><time dateTime={item.createdAt}>{formatNotificationTime(item.createdAt)}</time></span></div>; }
