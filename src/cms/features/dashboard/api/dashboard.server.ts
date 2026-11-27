import "server-only";
import { backendRequest } from "@/lib/api/backend-client";
import { isDashboardReport } from "../lib/dashboard-schema";
import type { DashboardParams } from "../types";

export async function backendDashboard(accessToken: string, params: DashboardParams, signal?: AbortSignal) {
  return (await backendRequest({ path: "/api/v1/reports/dashboard", query: params, accessToken, cache: "no-store", signal, validate: isDashboardReport })).data;
}
