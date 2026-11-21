import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isDeletedSystemConfig, isSystemConfig, isSystemConfigList } from "../lib/system-config-data";
import type { CreateSystemConfigInput, SystemConfig, SystemConfigList, SystemConfigListParams, UpdateSystemConfigInput } from "../types";

export async function backendSystemConfigList(accessToken: string, params: SystemConfigListParams, signal?: AbortSignal): Promise<SystemConfigList> {
  return (await backendRequest({ path: "/api/v1/system-configs", query: params, accessToken, cache: "no-store", signal, validate: isSystemConfigList })).data;
}
export async function backendSystemConfigDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<SystemConfig> {
  return (await backendRequest({ path: `/api/v1/system-configs/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isSystemConfig })).data;
}
export async function backendCreateSystemConfig(accessToken: string, input: CreateSystemConfigInput): Promise<SystemConfig> {
  return (await backendRequest({ path: "/api/v1/system-configs", method: "POST", body: input, accessToken, cache: "no-store", validate: isSystemConfig })).data;
}
export async function backendUpdateSystemConfig(accessToken: string, id: string, input: UpdateSystemConfigInput): Promise<SystemConfig> {
  return (await backendRequest({ path: `/api/v1/system-configs/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isSystemConfig })).data;
}
export async function backendDeleteSystemConfig(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/system-configs/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedSystemConfig })).data;
}
