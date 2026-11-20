import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isCmsUser, isDeletedUser, isUserList } from "../lib/user-data";
import type { CmsUser, CreateUserInput, UpdateUserInput, UserList, UserListParams } from "../types";

export async function backendUserList(accessToken: string, params: UserListParams, signal?: AbortSignal): Promise<UserList> {
  return (await backendRequest({ path: "/api/v1/users", query: params, accessToken, cache: "no-store", signal, validate: isUserList })).data;
}
export async function backendUserDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<CmsUser> {
  return (await backendRequest({ path: `/api/v1/users/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isCmsUser })).data;
}
export async function backendCreateUser(accessToken: string, input: CreateUserInput): Promise<CmsUser> {
  return (await backendRequest({ path: "/api/v1/users", method: "POST", body: input, accessToken, cache: "no-store", validate: isCmsUser })).data;
}
export async function backendUpdateUser(accessToken: string, id: string, input: UpdateUserInput): Promise<CmsUser> {
  return (await backendRequest({ path: `/api/v1/users/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isCmsUser })).data;
}
export async function backendAssignUserRole(accessToken: string, id: string, roleId: string): Promise<CmsUser> {
  return (await backendRequest({ path: `/api/v1/users/${encodeURIComponent(id)}/role`, method: "PATCH", body: { roleId }, accessToken, cache: "no-store", validate: isCmsUser })).data;
}
export async function backendChangeUserLock(accessToken: string, id: string, action: "lock" | "unlock"): Promise<CmsUser> {
  return (await backendRequest({ path: `/api/v1/users/${encodeURIComponent(id)}/${action}`, method: "PATCH", accessToken, cache: "no-store", validate: isCmsUser })).data;
}
export async function backendDeleteUser(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/users/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedUser })).data;
}
