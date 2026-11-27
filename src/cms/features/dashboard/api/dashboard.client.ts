import { cmsApiClient } from "@/cms/lib/api/client";
import { serializeDashboardQuery } from "../lib/dashboard-query";
import type { DashboardReport } from "../lib/dashboard-schema";
import type { DashboardParams } from "../types";

export function getDashboard(params: DashboardParams, signal?: AbortSignal) {
  return cmsApiClient.get<DashboardReport>(`/reports/dashboard?${serializeDashboardQuery(params)}`, { signal });
}
