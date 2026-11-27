"use client";
import { useId, useState } from "react";
import { CmsButton } from "@/cms/components/ui/button";
import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { formatVnd } from "@/cms/lib/format-vnd";
import { revenuePoints } from "../../lib/dashboard-chart-data";
import type { DashboardReport } from "../../lib/dashboard-schema";
import type { DashboardParams, RevenueGroup } from "../../types";
import styles from "../dashboard-charts.module.css";

const WIDTH = 640, HEIGHT = 240, LEFT = 78, RIGHT = 16, TOP = 16, BOTTOM = 35;
const compact = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });
const formatPeriod = (period: string) => period.length === 10 ? period.slice(8) + "/" + period.slice(5, 7) : period.slice(5) + "/" + period.slice(0, 4);

export function RevenueChart({ report, range, group, onGroupChange }: { report: DashboardReport; range: DashboardParams; group: RevenueGroup; onGroupChange: (group: RevenueGroup) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const gradient = useId();
  const points = revenuePoints(report, group, range);
  const selected = points.find(item => item.period === active);
  const peak = points.reduce((max, item) => Math.max(max, Number(item.revenue)), 1);
  const innerWidth = WIDTH - LEFT - RIGHT, innerHeight = HEIGHT - TOP - BOTTOM;
  const x = (index: number) => LEFT + (points.length === 1 ? innerWidth / 2 : index / Math.max(1, points.length - 1) * innerWidth);
  const y = (value: number) => TOP + innerHeight * (1 - value / peak);
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(Number(point.revenue))}`).join(" ");
  const area = points.length > 1 ? `${line} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z` : "";
  const tickStep = Math.max(1, Math.ceil((points.length - 1) / 5));
  return <section className={styles.panel} aria-label="Biểu đồ doanh thu">
    <header className={styles.heading}><div><h2>Doanh thu</h2><p>Đơn hoàn thành · theo ngày tạo đơn</p></div><div className={styles.switch}>
      <CmsButton type="button" size="sm" variant={group === "day" ? "default" : "outline"} aria-pressed={group === "day"} onClick={() => { onGroupChange("day"); setActive(null); }}>Ngày</CmsButton>
      <CmsButton type="button" size="sm" variant={group === "month" ? "default" : "outline"} aria-pressed={group === "month"} onClick={() => { onGroupChange("month"); setActive(null); }}>Tháng</CmsButton>
    </div></header>
    {!points.length ? <CollectionState kind="empty">Chưa có dữ liệu doanh thu.</CollectionState> : <>
      <div className={styles.chart} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Doanh thu theo ${group === "day" ? "ngày" : "tháng"}, đơn vị VND`}>
          <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--cms-primary)" stopOpacity=".25"/><stop offset="100%" stopColor="var(--cms-primary)" stopOpacity=".02"/></linearGradient></defs>
          {[0, 1, 2, 3, 4].map(tick => { const value = peak * tick / 4; return <g key={tick}><line x1={LEFT} x2={WIDTH - RIGHT} y1={y(value)} y2={y(value)} className={styles.axis}/><text x={LEFT - 8} y={y(value) + 4} textAnchor="end" className={styles.axisLabel}>{compact.format(value)}</text></g>; })}
          {area ? <path d={area} fill={`url(#${gradient})`}/> : null}
          <path d={line} fill="none" stroke="var(--cms-primary)" strokeWidth="2.5" strokeLinejoin="round"/>
          {points.map((point, index) => <g key={point.period}>
            {index % tickStep === 0 || index === points.length - 1 ? <text x={x(index)} y={HEIGHT - 10} textAnchor="middle" className={styles.axisLabel}>{formatPeriod(point.period)}</text> : null}
            {points.length <= 31 || active === point.period ? <circle cx={x(index)} cy={y(Number(point.revenue))} r={active === point.period ? 5 : 3} fill="var(--cms-primary)"/> : null}
            <rect x={Math.max(LEFT, x(index) - innerWidth / Math.max(2, points.length - 1) / 2)} y={TOP} width={Math.min(innerWidth / Math.max(1, points.length - 1), WIDTH - RIGHT - Math.max(LEFT, x(index) - innerWidth / Math.max(2, points.length - 1) / 2))} height={innerHeight} fill="transparent" onPointerEnter={() => setActive(point.period)} onClick={() => setActive(point.period)}><title>{point.period}: {formatVnd(point.revenue)} · {point.orders} đơn</title></rect>
          </g>)}
        </svg>
      </div>
      <p className={styles.readout} aria-live="polite">{selected ? `${selected.period}: ${formatVnd(selected.revenue)} · ${selected.orders} đơn` : "Chạm hoặc di chuột vào biểu đồ để xem chi tiết."}</p>
      <details className={styles.details}><summary>Dữ liệu biểu đồ</summary><div className={styles.dataList}>{points.map(point => <div key={point.period}><span>{point.period}</span><strong>{formatVnd(point.revenue)}</strong><span>{point.orders} đơn</span></div>)}</div></details>
    </>}
  </section>;
}
