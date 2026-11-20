import { cmsApiClient } from "@/cms/lib/api/client";

import type { CmsUser, CreateUserInput, UpdateUserInput, UserList, UserListParams } from "../types";

export function getUsers(params: UserListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.roleId) query.set("roleId", params.roleId);
  return cmsApiClient.get<UserList>(`/users?${query}`, { signal });
}

export const getUser = (id: string, signal?: AbortSignal) => cmsApiClient.get<CmsUser>(`/users/${encodeURIComponent(id)}`, { signal });
export const createUser = (input: CreateUserInput) => cmsApiClient.post<CmsUser>("/users", input);
export const updateUser = (id: string, input: UpdateUserInput) => cmsApiClient.patch<CmsUser>(`/users/${encodeURIComponent(id)}`, input);
export const assignUserRole = (id: string, roleId: string) => cmsApiClient.patch<CmsUser>(`/users/${encodeURIComponent(id)}/role`, { roleId });
export const lockUser = (id: string) => cmsApiClient.patch<CmsUser>(`/users/${encodeURIComponent(id)}/lock`);
export const unlockUser = (id: string) => cmsApiClient.patch<CmsUser>(`/users/${encodeURIComponent(id)}/unlock`);
export const deleteUser = (id: string) => cmsApiClient.delete<{ id: string }>(`/users/${encodeURIComponent(id)}`);
