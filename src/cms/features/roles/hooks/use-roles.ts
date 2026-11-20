"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getPermissions, getRole, getRolePermissions, getRoles } from "../api/roles.client";
import { roleQueryKeys } from "../lib/role-query-keys";
import type { RoleListParams } from "../types";
import type { Role } from "../types";

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

export async function loadCompleteRoleCatalog(signal?: AbortSignal) {
  const first = await getRoles({ page: 1, limit: 100 }, signal);
  const roles: Role[] = [...first.items];
  for (let page = 2; page <= first.pagination.totalPages; page += 1) {
    const next = await getRoles({ page, limit: 100 }, signal);
    if (next.pagination.page !== page || next.pagination.total !== first.pagination.total || next.pagination.totalPages !== first.pagination.totalPages) {
      throw new Error("Danh sách vai trò đã thay đổi trong lúc tải. Vui lòng thử lại.");
    }
    roles.push(...next.items);
  }
  if (roles.length !== first.pagination.total || new Set(roles.map((role) => role.id)).size !== roles.length) {
    throw new Error("Không thể tải đầy đủ danh sách vai trò.");
  }
  return roles.toSorted((left, right) => left.name.localeCompare(right.name, "vi") || left.code.localeCompare(right.code, "vi"));
}

export function useRoleSelector(enabled = true) {
  return useQuery({ queryKey: roleQueryKeys.selector(), queryFn: ({ signal }) => loadCompleteRoleCatalog(signal), enabled, staleTime: 30_000, retry: 1 });
}
