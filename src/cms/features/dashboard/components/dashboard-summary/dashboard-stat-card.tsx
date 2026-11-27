import type { LucideIcon } from "lucide-react";
import styles from "./dashboard-summary.module.css";

export function DashboardStatCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return <article className={styles.card}><div className={styles.label}><span>{label}</span><Icon size={20} aria-hidden="true" /></div><strong className={styles.value}>{value}</strong><small>{note}</small></article>;
}
