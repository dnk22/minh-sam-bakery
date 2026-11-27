import { Wallet, ShoppingBag, PackageCheck, ChartNoAxesCombined } from "lucide-react";
import { formatVnd } from "@/cms/lib/format-vnd";
import type { DashboardReport } from "../../lib/dashboard-schema";
import { DashboardStatCard } from "./dashboard-stat-card";
import styles from "./dashboard-summary.module.css";

export function DashboardSummary({ summary }: { summary: DashboardReport["summary"] }) {
  return <section aria-label="Chỉ số tổng quan" className={styles.grid}>
    <DashboardStatCard label="Tổng doanh thu" value={formatVnd(summary.totalRevenue)} note="Đơn hoàn thành" icon={Wallet} />
    <DashboardStatCard label="Tổng đơn hàng" value={summary.totalOrders.toLocaleString("vi-VN")} note="Tất cả trạng thái" icon={ShoppingBag} />
    <DashboardStatCard label="Đơn hoàn thành" value={summary.completedOrders.toLocaleString("vi-VN")} note="Trạng thái hoàn thành" icon={PackageCheck} />
    <DashboardStatCard label="Giá trị đơn trung bình" value={formatVnd(summary.averageOrderValue)} note="Trên mỗi đơn hoàn thành" icon={ChartNoAxesCombined} />
  </section>;
}
