import { cmsApiClient } from "@/cms/lib/api/client";

import { buildSystemConfigListQuery } from "../lib/system-config-data";
import type { CreateSystemConfigInput, SystemConfig, SystemConfigList, SystemConfigListParams, UpdateSystemConfigInput } from "../types";

export function systemConfigListPath(params: SystemConfigListParams) {
  return `/system-configs?${buildSystemConfigListQuery(params)}`;
}

export const getSystemConfigs = (params: SystemConfigListParams, signal?: AbortSignal) =>
  cmsApiClient.get<SystemConfigList>(systemConfigListPath(params), { signal });
export const getSystemConfig = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<SystemConfig>(`/system-configs/${encodeURIComponent(id)}`, { signal });
export const createSystemConfig = (input: CreateSystemConfigInput) =>
  cmsApiClient.post<SystemConfig>("/system-configs", input);
export const updateSystemConfig = (id: string, input: UpdateSystemConfigInput) =>
  cmsApiClient.patch<SystemConfig>(`/system-configs/${encodeURIComponent(id)}`, input);
export const deleteSystemConfig = (id: string) =>
  cmsApiClient.delete<{ id: string }>(`/system-configs/${encodeURIComponent(id)}`);
