import type { DashboardParams, DashboardPreset, RevenueGroup } from "../types.ts";

const DAY_MS = 86_400_000;
export function isDashboardDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function bakeryToday(now = new Date()) {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
export function getDashboardRange(preset: Exclude<DashboardPreset, "custom">, now = new Date()) {
  const today = bakeryToday(now);
  const date = new Date(today + "T00:00:00Z");
  const shift = (days: number) => new Date(date.getTime() + days * DAY_MS).toISOString().slice(0, 10);
  const monthStart = today.slice(0, 7) + "-01";
  switch (preset) {
    case "today": return { from: today, to: today };
    case "yesterday": return { from: shift(-1), to: shift(-1) };
    case "last7": return { from: shift(-6), to: today };
    case "last30": return { from: shift(-29), to: today };
    case "year": return { from: today.slice(0, 4) + "-01-01", to: today };
    case "previousMonth": {
      const end = new Date(Date.parse(monthStart + "T00:00:00Z") - DAY_MS).toISOString().slice(0, 10);
      return { from: end.slice(0, 7) + "-01", to: end };
    }
    default: return { from: monthStart, to: today };
  }
}

/** Choose the chart granularity from the applied preset and inclusive calendar range. */
export function getDefaultRevenueGroup(preset: DashboardPreset, range: Pick<DashboardParams, "from" | "to">): RevenueGroup {
  if (preset === "year") return "month";
  if (preset !== "custom") return "day";
  if (!isDashboardDate(range.from) || !isDashboardDate(range.to) || range.from > range.to) return "day";
  const days = (Date.parse(range.to + "T00:00:00Z") - Date.parse(range.from + "T00:00:00Z")) / DAY_MS + 1;
  return days > 31 ? "month" : "day";
}
