import { cmsApiClient } from "@/cms/lib/api/client";

import type { CreateRoleInput, Permission, Role, RoleDetail, RoleList, RoleListParams, RolePermissions, UpdateRoleInput } from "../types";

export function getRoles(params: RoleListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  return cmsApiClient.get<RoleList>(`/roles?${query}`, { signal });
}

export const getRole = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<RoleDetail>(`/roles/${encodeURIComponent(id)}`, { signal });
export const getRolePermissions = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<RolePermissions>(`/roles/${encodeURIComponent(id)}/permissions`, { signal });
export const getPermissions = (signal?: AbortSignal) => cmsApiClient.get<Permission[]>("/permissions", { signal });
export const createRole = (input: CreateRoleInput) => cmsApiClient.post<RoleDetail>("/roles", input);
export const updateRole = (id: string, input: UpdateRoleInput) => cmsApiClient.patch<Role>(`/roles/${encodeURIComponent(id)}`, input);
export const replaceRolePermissions = (id: string, permissionIds: string[]) =>
  cmsApiClient.patch<RolePermissions>(`/roles/${encodeURIComponent(id)}/permissions`, { permissionIds });
export const deleteRole = (id: string) => cmsApiClient.delete<{ id: string }>(`/roles/${encodeURIComponent(id)}`);
