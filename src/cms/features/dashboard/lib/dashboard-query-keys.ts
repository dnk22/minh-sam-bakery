import type { DashboardParams } from "../types.ts";

export const dashboardQueryKeys = {
  all: ["cms", "dashboard"] as const,
  report: (params: DashboardParams) => [...dashboardQueryKeys.all, params] as const,
};
