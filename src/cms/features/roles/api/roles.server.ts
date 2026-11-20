import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isDeletedRole, isPermissionCatalog, isRole, isRoleDetail, isRoleList, isRolePermissions } from "../lib/role-data";
import type { CreateRoleInput, Permission, Role, RoleDetail, RoleList, RoleListParams, RolePermissions, UpdateRoleInput } from "../types";

export async function backendRoleList(accessToken: string, params: RoleListParams, signal?: AbortSignal): Promise<RoleList> {
  return (await backendRequest({ path: "/api/v1/roles", query: params, accessToken, cache: "no-store", signal, validate: isRoleList })).data;
}

export async function backendRoleDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<RoleDetail> {
  return (await backendRequest({ path: `/api/v1/roles/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isRoleDetail })).data;
}

export async function backendRolePermissions(accessToken: string, id: string, signal?: AbortSignal): Promise<RolePermissions> {
  return (await backendRequest({ path: `/api/v1/roles/${encodeURIComponent(id)}/permissions`, accessToken, cache: "no-store", signal, validate: isRolePermissions })).data;
}

export async function backendPermissionCatalog(accessToken: string, signal?: AbortSignal): Promise<Permission[]> {
  return (await backendRequest({ path: "/api/v1/permissions", accessToken, cache: "no-store", signal, validate: isPermissionCatalog })).data;
}

export async function backendCreateRole(accessToken: string, input: CreateRoleInput): Promise<RoleDetail> {
  return (await backendRequest({ path: "/api/v1/roles", method: "POST", body: input, accessToken, cache: "no-store", validate: isRoleDetail })).data;
}

export async function backendUpdateRole(accessToken: string, id: string, input: UpdateRoleInput): Promise<Role> {
  return (await backendRequest({ path: `/api/v1/roles/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isRole })).data;
}

export async function backendReplaceRolePermissions(accessToken: string, id: string, permissionIds: string[]): Promise<RolePermissions> {
  return (await backendRequest({ path: `/api/v1/roles/${encodeURIComponent(id)}/permissions`, method: "PATCH", body: { permissionIds }, accessToken, cache: "no-store", validate: isRolePermissions })).data;
}

export async function backendDeleteRole(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/roles/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedRole })).data;
}
