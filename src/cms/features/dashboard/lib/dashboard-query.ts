import type { DashboardParams } from "../types.ts";
import { isDashboardDate } from "./dashboard-date-range.ts";

export function validDashboardParams(params: DashboardParams) {
  return isDashboardDate(params.from) && isDashboardDate(params.to) && params.from <= params.to &&
    Number.isInteger(params.topLimit) && params.topLimit >= 1 && params.topLimit <= 50;
}
export function parseDashboardQuery(query: URLSearchParams): DashboardParams | null {
  if (["from", "to"].some(key => query.getAll(key).length !== 1) || query.getAll("topLimit").length > 1) return null;
  const raw = query.get("topLimit") ?? "10";
  if (!/^\d+$/.test(raw)) return null;
  const params = { from: query.get("from") ?? "", to: query.get("to") ?? "", topLimit: Number(raw) };
  return validDashboardParams(params) ? params : null;
}
export function serializeDashboardQuery(params: DashboardParams) {
  return new URLSearchParams({ from: params.from, to: params.to, topLimit: String(params.topLimit) });
}
