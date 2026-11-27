"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { ORDER_STATUS_LABELS } from "../../constants";
import type { DashboardReport } from "../../lib/dashboard-schema";
import styles from "../dashboard-charts.module.css";

const colors = { PENDING_CONFIRMATION: "#b9851a", REJECTED: "#d35b65", CONFIRMED: "#4a83c4", NEED_CALLBACK: "#9870c8", COMPLETED: "#25966b" };

export function OrderStatusChart({ items }: { items: DashboardReport["ordersByStatus"] }) {
  const data = Object.entries(ORDER_STATUS_LABELS).map(([status, name]) => ({
    status, name, count: items.filter(item => item.status === status).reduce((sum, item) => sum + item.count, 0), fill: colors[status as keyof typeof colors],
  }));
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return <section className={styles.panel} aria-label="Trạng thái đơn hàng">
    <header className={styles.heading}><div><h2>Trạng thái đơn hàng</h2><p>Tất cả trạng thái</p></div></header>
    {total === 0 ? <CollectionState kind="empty">Chưa có đơn hàng trong khoảng này.</CollectionState> : <>
      <div className={styles.donut} aria-label={`Tổng ${total} đơn hàng`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer>
            <Pie data={data.filter(item => item.count > 0)} dataKey="count" nameKey="name" innerRadius="65%" outerRadius="85%" stroke="none" isAnimationActive={false}/>
            <Tooltip contentStyle={{ background: "var(--cms-card)", color: "var(--cms-foreground)", border: "1px solid var(--cms-border)", borderRadius: 8 }} formatter={value => [Number(value).toLocaleString("vi-VN") + " đơn", "Số đơn"]}/>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.donutCenter}><strong>{total.toLocaleString("vi-VN")}</strong><small>Tổng đơn</small></div>
      </div>
      <ul className={styles.legend}>{data.map(item => <li key={item.status}><span className={styles.dot} style={{ background: item.fill }}/><span>{item.name}</span><strong>{item.count.toLocaleString("vi-VN")}</strong></li>)}</ul>
    </>}
  </section>;
}
