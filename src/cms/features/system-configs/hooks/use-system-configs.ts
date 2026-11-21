"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getSystemConfig, getSystemConfigs } from "../api/system-configs.client";
import { systemConfigQueryKeys } from "../lib/system-config-query-keys";
import type { SystemConfigListParams } from "../types";

export function useSystemConfigs(params: SystemConfigListParams) {
  return useQuery({ queryKey: systemConfigQueryKeys.list(params), queryFn: ({ signal }) => getSystemConfigs(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
}
export function useSystemConfigDetail(id?: string) {
  return useQuery({ queryKey: systemConfigQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getSystemConfig(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
}
