import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { bakeryToday, getDashboardRange, getDefaultRevenueGroup } from "../src/cms/features/dashboard/lib/dashboard-date-range.ts";
import { parseDashboardQuery, serializeDashboardQuery } from "../src/cms/features/dashboard/lib/dashboard-query.ts";
import { isDashboardReport } from "../src/cms/features/dashboard/lib/dashboard-schema.ts";
import { revenuePoints, statusSegments } from "../src/cms/features/dashboard/lib/dashboard-chart-data.ts";

test("presets use inclusive UTC+7 dates across month and year boundaries", () => {
  const now = new Date("2026-12-31T18:00:00Z");
  assert.equal(bakeryToday(now), "2027-01-01");
  assert.deepEqual(getDashboardRange("month", now), { from: "2027-01-01", to: "2027-01-01" });
  assert.deepEqual(getDashboardRange("previousMonth", now), { from: "2026-12-01", to: "2026-12-31" });
  assert.deepEqual(getDashboardRange("last7", now), { from: "2026-12-26", to: "2027-01-01" });
  assert.deepEqual(getDashboardRange("last30", now), { from: "2026-12-03", to: "2027-01-01" });
  assert.deepEqual(getDashboardRange("yesterday", now), { from: "2026-12-31", to: "2026-12-31" });
  assert.deepEqual(getDashboardRange("year", now), { from: "2027-01-01", to: "2027-01-01" });
});
test("query accepts long custom periods and rejects invalid dates and limits", () => {
  const params = { from: "2025-01-01", to: "2026-11-27", topLimit: 50 };
  assert.deepEqual(parseDashboardQuery(serializeDashboardQuery(params)), params);
  for (const query of ["from=2026-02-30&to=2026-03-01", "from=2026-11-28&to=2026-11-27", "from=2026-01-01&to=2026-11-27&topLimit=51", "from=2026-01-01&to=2026-11-27&topLimit=1.5", "from=2026-01-01&from=2026-02-01&to=2026-11-27"]) assert.equal(parseDashboardQuery(new URLSearchParams(query)), null);
});
const report = { summary: { totalRevenue: "1500000.00", totalOrders: 2, completedOrders: 1, averageOrderValue: "1500000.00" }, ordersByStatus: [{ status: "COMPLETED" as const, count: 1 }, { status: "REJECTED" as const, count: 1 }], revenueByDay: [{ date: "2026-11-24", revenue: "1500000.00", orders: 1 }], revenueByMonth: [{ month: "2026-11", revenue: "1500000.00", orders: 1 }], topProducts: [] };
test("schema validates backend report and charts use supplied series only", () => {
  assert.equal(isDashboardReport(report), true);
  assert.equal(isDashboardReport({ ...report, summary: { ...report.summary, totalRevenue: 1500000 } }), false);
  const range = { from: "2026-11-01", to: "2026-11-30", topLimit: 10 };
  assert.equal(revenuePoints(report, "day", range).length, 1);
  assert.equal(revenuePoints(report, "month", range)[0].period, "2026-11");
  assert.deepEqual(statusSegments(report.ordersByStatus).map(item => item.percent), [50, 50]);
});
test("reports use authenticated BFF and explicit apply without polling", () => {
  const root = "src/cms/features/dashboard/";
  assert.match(readFileSync("src/app/api/cms/reports/dashboard/route.ts", "utf8"), /requireDashboardAccess\(\)/);
  assert.match(readFileSync(root + "hooks/use-dashboard.ts", "utf8"), /refetchInterval: false/);
  assert.match(readFileSync(root + "components/dashboard-page/dashboard-page.tsx", "utf8"), /useDashboard\(filters.applied\)/);
  assert.doesNotMatch(readFileSync(root + "components/top-products-table/top-products-table.tsx", "utf8"), /\.sort\(|\.slice\(/);
});

test("revenue granularity uses applied presets and inclusive custom date boundaries", () => {
  const range = { from: "2026-01-01", to: "2026-01-31" };
  for (const preset of ["today", "yesterday", "last7", "last30", "month", "previousMonth"] as const) {
    assert.equal(getDefaultRevenueGroup(preset, range), "day");
  }
  assert.equal(getDefaultRevenueGroup("year", { from: "2026-01-01", to: "2026-01-01" }), "month");
  assert.equal(getDefaultRevenueGroup("custom", range), "day");
  assert.equal(getDefaultRevenueGroup("custom", { ...range, to: "2026-02-01" }), "month");
  assert.equal(getDefaultRevenueGroup("custom", { from: "2026-12-31", to: "2027-01-30" }), "day");
  assert.equal(getDefaultRevenueGroup("custom", { from: "2026-02-30", to: "2026-03-31" }), "day");
});
test("dashboard controls align right and auto-group only on an applied date change", () => {
  const root = "src/cms/features/dashboard/";
  const page = readFileSync(root + "components/dashboard-page/dashboard-page.tsx", "utf8");
  assert.match(page, /filters\.preset !== filters\.appliedPreset/);
  assert.match(page, /setGroup\(getDefaultRevenueGroup\(filters\.preset, filters\.draft\)\)/);
  assert.match(readFileSync(root + "components/dashboard-page/dashboard-page.module.css", "utf8"), /\.refresh \{[^}]*margin-inline-start: auto/);
  assert.match(readFileSync(root + "components/dashboard-charts.module.css", "utf8"), /\.switch \{[^}]*margin-inline-start: auto/);
});
