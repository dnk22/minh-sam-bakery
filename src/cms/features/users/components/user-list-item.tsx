import { UserRound } from "lucide-react";

import type { CmsUser } from "../types";
import styles from "./users-collection/users-collection.module.css";

export function UserListItem({ user }: { user: CmsUser }) {
  return <div className={styles.item}>
    <span className={styles.icon}><UserRound aria-hidden="true" /></span>
    <span className={styles.itemContent}><strong>{user.fullName}</strong><span>{user.email}</span><small>{user.role.name}</small></span>
  </div>;
}
