import { SlidersHorizontal } from "lucide-react";

import type { SystemConfig } from "../../types";
import styles from "./system-config-list-item.module.css";

export function SystemConfigListItem({ config }: { config: SystemConfig }) {
  return <div className={styles.item}><span className={styles.icon}><SlidersHorizontal aria-hidden="true" /></span><span className={styles.itemContent}><strong>{config.key}</strong><span>{config.value}</span></span></div>;
}
