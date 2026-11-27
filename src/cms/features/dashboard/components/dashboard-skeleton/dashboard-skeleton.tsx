import styles from "./dashboard-skeleton.module.css";
export function DashboardSkeleton() {
  return <div className={styles.root} role="status" aria-label="Đang tải báo cáo" aria-busy="true"><div className={styles.stats}>{Array.from({ length: 4 }, (_, index) => <div key={index} className={styles.card}/>)}</div><div className={styles.charts}><div/><div/></div><div className={styles.table}/></div>;
}
