"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { useDashboard } from "../../hooks/use-dashboard";
import { useDashboardFilters } from "../../hooks/use-dashboard-filters";
import { getDefaultRevenueGroup } from "../../lib/dashboard-date-range";
import type { DashboardParams, RevenueGroup } from "../../types";
import { DashboardToolbar } from "../dashboard-toolbar/dashboard-toolbar";
import { DashboardSummary } from "../dashboard-summary/dashboard-summary";
import { RevenueChart } from "../revenue-chart/revenue-chart";
import { OrderStatusChart } from "../order-status-chart/order-status-chart";
import { TopProductsTable } from "../top-products-table/top-products-table";
import { DashboardSkeleton } from "../dashboard-skeleton/dashboard-skeleton";
import styles from "./dashboard-page.module.css";

export function DashboardPage({ initial }: { initial: DashboardParams }) {
  const [group, setGroup] = useState<RevenueGroup>(() => getDefaultRevenueGroup("month", initial));
  const filters = useDashboardFilters(initial);
  const report = useDashboard(filters.applied);
  const apply = () => {
    if (!filters.valid || report.isFetching) return;
    // Only a newly applied date selection resets the manual chart choice.
    if (filters.draft.from !== filters.applied.from || filters.draft.to !== filters.applied.to || filters.preset !== filters.appliedPreset) {
      setGroup(getDefaultRevenueGroup(filters.preset, filters.draft));
    }
    if (JSON.stringify(filters.draft) === JSON.stringify(filters.applied)) void report.refetch();
    filters.apply();
  };
  return <CmsMain className={styles.main}>
    <header className={styles.heading}><div><h1>Dashboard</h1><p>Theo dõi hoạt động kinh doanh của cửa hàng</p></div><CmsButton type="button" variant="outline" className={styles.refresh} disabled={report.isFetching} onClick={() => void report.refetch()}><RefreshCw size={17} aria-hidden="true"/> Làm mới</CmsButton></header>
    <DashboardToolbar filters={filters} fetching={report.isFetching} onApply={apply}/>
    <p className={styles.note}>Báo cáo từ {filters.applied.from} đến {filters.applied.to} (UTC+7), lọc theo ngày tạo đơn.</p>
    {report.isFetching ? <DashboardSkeleton/> : report.isError ? <CollectionState kind="error" onRetry={() => void report.refetch()}>{report.error.message}</CollectionState> : report.data ? <>
      <DashboardSummary summary={report.data.summary}/>
      <div className={styles.charts}><RevenueChart report={report.data} range={filters.applied} group={group} onGroupChange={setGroup}/><OrderStatusChart items={report.data.ordersByStatus}/></div>
      <section className={styles.products}><h2>Sản phẩm bán chạy</h2><TopProductsTable products={report.data.topProducts}/></section>
    </> : <DashboardSkeleton/>}
  </CmsMain>;
}
