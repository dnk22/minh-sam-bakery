import type { DashboardReport } from "./dashboard-schema.ts";
import type { DashboardParams, RevenueGroup } from "../types.ts";

/** Missing buckets are not silently treated as reported zero revenue. */
export function revenuePoints(report: DashboardReport, group: RevenueGroup, range: DashboardParams) {
  const source = group === "day"
    ? report.revenueByDay.map(item => ({ period: item.date, revenue: item.revenue, orders: item.orders }))
    : report.revenueByMonth.map(item => ({ period: item.month, revenue: item.revenue, orders: item.orders }));
  const from = group === "day" ? range.from : range.from.slice(0, 7);
  const to = group === "day" ? range.to : range.to.slice(0, 7);
  return source.filter(item => item.period >= from && item.period <= to).sort((a, b) => a.period.localeCompare(b.period));
}

export function statusSegments(items: DashboardReport["ordersByStatus"]) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let offset = 0;
  return items.map(item => {
    const percent = total ? item.count / total * 100 : 0;
    const segment = { ...item, percent, offset };
    offset += percent;
    return segment;
  });
}
