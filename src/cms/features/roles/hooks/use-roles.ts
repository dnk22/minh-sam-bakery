"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getPermissions, getRole, getRolePermissions, getRoles } from "../api/roles.client";
import { roleQueryKeys } from "../lib/role-query-keys";
import type { RoleListParams } from "../types";

export function useRoles(params: RoleListParams) {
  return useQuery({ queryKey: roleQueryKeys.list(params), queryFn: ({ signal }) => getRoles(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
}

export function useRoleDetail(id?: string) {
  return useQuery({ queryKey: roleQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getRole(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
}

export function useRolePermissions(id?: string) {
  return useQuery({ queryKey: roleQueryKeys.permissions(id ?? ""), queryFn: ({ signal }) => getRolePermissions(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
}

export function usePermissionCatalog(enabled = true) {
  return useQuery({ queryKey: roleQueryKeys.catalog(), queryFn: ({ signal }) => getPermissions(signal), enabled, staleTime: 60_000, retry: 1 });
}
