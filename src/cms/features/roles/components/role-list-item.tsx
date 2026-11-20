import { ShieldCheck } from "lucide-react";

import type { Role } from "../types";
import styles from "./roles-collection/roles-collection.module.css";

export function RoleListItem({ role }: { role: Role }) {
  return (
    <div className={styles.item}>
      <span className={styles.icon}><ShieldCheck aria-hidden="true" /></span>
      <span className={styles.itemContent}>
        <strong>{role.name}</strong>
        <span>{role.code}</span>
      </span>
    </div>
  );
}
