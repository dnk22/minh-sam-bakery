"use client";
import { RefreshCw } from "lucide-react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { useDashboard } from "../../hooks/use-dashboard";
import { useDashboardFilters } from "../../hooks/use-dashboard-filters";
import type { DashboardParams } from "../../types";
import { DashboardToolbar } from "../dashboard-toolbar/dashboard-toolbar";
import { DashboardSummary } from "../dashboard-summary/dashboard-summary";
import { RevenueChart } from "../revenue-chart/revenue-chart";
import { OrderStatusChart } from "../order-status-chart/order-status-chart";
import { TopProductsTable } from "../top-products-table/top-products-table";
import { DashboardSkeleton } from "../dashboard-skeleton/dashboard-skeleton";
import styles from "./dashboard-page.module.css";

export function DashboardPage({ initial }: { initial: DashboardParams }) {
  const filters = useDashboardFilters(initial);
  const report = useDashboard(filters.applied);
  const apply = () => {
    if (!filters.valid || report.isFetching) return;
    if (JSON.stringify(filters.draft) === JSON.stringify(filters.applied)) void report.refetch();
    else filters.apply();
  };
  return <CmsMain className={styles.main}>
    <header className={styles.heading}><div><h1>Dashboard</h1><p>Theo dõi hoạt động kinh doanh của cửa hàng</p></div><CmsButton type="button" variant="outline" className="cms-page-header-action" disabled={report.isFetching} onClick={() => void report.refetch()}><RefreshCw size={17} aria-hidden="true"/> Làm mới</CmsButton></header>
    <DashboardToolbar filters={filters} fetching={report.isFetching} onApply={apply}/>
    <p className={styles.note}>Báo cáo từ {filters.applied.from} đến {filters.applied.to} (UTC+7), lọc theo ngày tạo đơn.</p>
    {report.isFetching ? <DashboardSkeleton/> : report.isError ? <CollectionState kind="error" onRetry={() => void report.refetch()}>{report.error.message}</CollectionState> : report.data ? <>
      <DashboardSummary summary={report.data.summary}/>
      <div className={styles.charts}><RevenueChart report={report.data} range={filters.applied}/><OrderStatusChart items={report.data.ordersByStatus}/></div>
      <section className={styles.products}><h2>Sản phẩm bán chạy</h2><TopProductsTable products={report.data.topProducts}/></section>
    </> : <DashboardSkeleton/>}
  </CmsMain>;
}
