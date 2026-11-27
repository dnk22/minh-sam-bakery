import { z } from "zod";
import { isDashboardDate } from "./dashboard-date-range.ts";

const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const money = z.string().regex(/^\d+(?:\.\d+)?$/).refine(value => Number.isFinite(Number(value)));
export const dashboardSchema = z.object({
  summary: z.object({ totalRevenue: money, totalOrders: count, completedOrders: count, averageOrderValue: money }),
  ordersByStatus: z.array(z.object({ status: z.enum(["PENDING_CONFIRMATION", "REJECTED", "CONFIRMED", "NEED_CALLBACK", "COMPLETED"]), count })),
  revenueByDay: z.array(z.object({ date: z.string().refine(isDashboardDate), revenue: money, orders: count })),
  revenueByMonth: z.array(z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), revenue: money, orders: count })),
  topProducts: z.array(z.object({ productId: z.string(), productName: z.string(), productSku: z.string(), quantity: count, revenue: money })),
});
export type DashboardReport = z.infer<typeof dashboardSchema>;
export type TopProduct = DashboardReport["topProducts"][number];
export function isDashboardReport(value: unknown): value is DashboardReport {
  return dashboardSchema.safeParse(value).success;
}
