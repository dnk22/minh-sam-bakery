import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { ORDER_STATUS_LABELS } from "../../constants";
import { statusSegments } from "../../lib/dashboard-chart-data";
import type { DashboardReport } from "../../lib/dashboard-schema";
import styles from "../dashboard-charts.module.css";

const colors = { PENDING_CONFIRMATION: "#b9851a", REJECTED: "#d35b65", CONFIRMED: "#4a83c4", NEED_CALLBACK: "#9870c8", COMPLETED: "#25966b" };
export function OrderStatusChart({ items }: { items: DashboardReport["ordersByStatus"] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const segments = statusSegments(items);
  return <section className={styles.panel} aria-label="Trạng thái đơn hàng">
    <header className={styles.heading}><div><h2>Trạng thái đơn hàng</h2><p>Tất cả trạng thái</p></div></header>
    {total === 0 ? <CollectionState kind="empty">Chưa có đơn hàng trong khoảng này.</CollectionState> : <>
      <svg className={styles.donut} viewBox="0 0 160 160" role="img" aria-label={`Tổng ${total} đơn hàng`}>
        <circle cx="80" cy="80" r="58" fill="none" stroke="var(--cms-muted)" strokeWidth="20"/>
        {segments.filter(item => item.count > 0).map(item => <circle key={item.status} cx="80" cy="80" r="58" fill="none" pathLength="100" stroke={colors[item.status]} strokeWidth="20" strokeDasharray={`${item.percent} ${100 - item.percent}`} strokeDashoffset={-item.offset} transform="rotate(-90 80 80)"><title>{ORDER_STATUS_LABELS[item.status]}: {item.count} đơn</title></circle>)}
        <text x="80" y="78" textAnchor="middle" className={styles.donutTotal}>{total.toLocaleString("vi-VN")}</text><text x="80" y="96" textAnchor="middle" className={styles.axisLabel}>Tổng đơn</text>
      </svg>
      <ul className={styles.legend}>{Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => {
        const count = items.filter(item => item.status === status).reduce((sum, item) => sum + item.count, 0);
        return <li key={status}><span className={styles.dot} style={{ background: colors[status as keyof typeof colors] }}/><span>{label}</span><strong>{count.toLocaleString("vi-VN")}</strong></li>;
      })}</ul>
    </>}
  </section>;
}
