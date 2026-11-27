"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard.client";
import { dashboardQueryKeys } from "../lib/dashboard-query-keys";
import type { DashboardParams } from "../types";

export function useDashboard(params: DashboardParams) {
  return useQuery({ queryKey: dashboardQueryKeys.report(params), queryFn: ({ signal }) => getDashboard(params, signal), retry: false, staleTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false, refetchInterval: false });
}
