"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CmsButton } from "@/cms/components/ui/button";
import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { formatVnd } from "@/cms/lib/format-vnd";
import { revenuePoints } from "../../lib/dashboard-chart-data";
import type { DashboardReport } from "../../lib/dashboard-schema";
import type { DashboardParams, RevenueGroup } from "../../types";
import styles from "../dashboard-charts.module.css";

const compact = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });
const formatPeriod = (period: string) => period.length === 10 ? period.slice(8) + "/" + period.slice(5, 7) : period.slice(5) + "/" + period.slice(0, 4);

export function RevenueChart({ report, range, group, onGroupChange }: { report: DashboardReport; range: DashboardParams; group: RevenueGroup; onGroupChange: (group: RevenueGroup) => void }) {
  const gradient = useId();
  const points = revenuePoints(report, group, range);
  const data = points.map(point => ({ ...point, amount: Number(point.revenue) }));
  return <section className={styles.panel} aria-label="Biểu đồ doanh thu">
    <header className={styles.heading}>
      <div><h2>Doanh thu</h2><p>Đơn hoàn thành · theo ngày tạo đơn</p></div>
      <div className={styles.switch}>
        <CmsButton type="button" size="sm" variant={group === "day" ? "default" : "outline"} aria-pressed={group === "day"} onClick={() => onGroupChange("day")}>Ngày</CmsButton>
        <CmsButton type="button" size="sm" variant={group === "month" ? "default" : "outline"} aria-pressed={group === "month"} onClick={() => onGroupChange("month")}>Tháng</CmsButton>
      </div>
    </header>
    {!points.length ? <CollectionState kind="empty">Chưa có dữ liệu doanh thu.</CollectionState> : <>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 8, left: 0 }} accessibilityLayer>
            <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--cms-primary)" stopOpacity={.25}/><stop offset="100%" stopColor="var(--cms-primary)" stopOpacity={.02}/></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="var(--cms-border)" strokeDasharray="3 3"/>
            <XAxis dataKey="period" tickFormatter={formatPeriod} tick={{ fill: "var(--cms-muted-foreground)", fontSize: 11 }} minTickGap={20} axisLine={false} tickLine={false}/>
            <YAxis domain={[0, "auto"]} width={62} tickFormatter={value => compact.format(Number(value))} tick={{ fill: "var(--cms-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
            <Tooltip content={({ active, label }) => {
              const point = points.find(item => item.period === label);
              return active && point ? <div className={styles.tooltip}><strong>{point.period}</strong><span>{formatVnd(point.revenue)}</span><small>{point.orders} đơn</small></div> : null;
            }}/>
            <Area type="linear" dataKey="amount" name="Doanh thu" stroke="var(--cms-primary)" strokeWidth={2} fill={`url(#${gradient})`} dot={points.length === 1} activeDot={{ r: 4 }} isAnimationActive={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <details className={styles.details}><summary>Dữ liệu biểu đồ</summary><div className={styles.dataList}>{points.map(point => <div key={point.period}><span>{point.period}</span><strong>{formatVnd(point.revenue)}</strong><span>{point.orders} đơn</span></div>)}</div></details>
    </>}
  </section>;
}
