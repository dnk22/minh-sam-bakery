"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/cms/features/auth/api/auth.client";
import { notify } from "@/cms/lib/notifications";

import { createRole, deleteRole, replaceRolePermissions, updateRole } from "../api/roles.client";
import { roleQueryKeys } from "../lib/role-query-keys";
import type { CreateRoleInput, UpdateRoleInput } from "../types";

export function useRoleMutations() {
  const client = useQueryClient();
  const router = useRouter();
  const invalidate = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: roleQueryKeys.lists() }),
      client.invalidateQueries({ queryKey: roleQueryKeys.selector() }),
      id ? client.invalidateQueries({ queryKey: roleQueryKeys.detail(id) }) : Promise.resolve(),
      id ? client.invalidateQueries({ queryKey: roleQueryKeys.permissions(id) }) : Promise.resolve(),
    ]);
  };
  return {
    create: useMutation({ meta: { pageLoading: true }, mutationFn: (input: CreateRoleInput) => createRole(input), onSuccess: async (role) => { await invalidate(role.id); notify.success("Đã tạo vai trò.", "role-save"); }, onError: () => notify.error("Không thể tạo vai trò. Vui lòng thử lại.", "role-save") }),
    update: useMutation({ meta: { pageLoading: true }, mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) => updateRole(id, input), onSuccess: async (role) => { await invalidate(role.id); notify.success("Đã cập nhật vai trò.", "role-save"); }, onError: () => notify.error("Không thể cập nhật vai trò. Vui lòng thử lại.", "role-save") }),
    permissions: useMutation({ meta: { pageLoading: true },
      mutationFn: ({ id, permissionIds }: { id: string; permissionIds: string[] }) => replaceRolePermissions(id, permissionIds),
      onSuccess: async (_, variables) => {
        await invalidate(variables.id);
        // The client intentionally does not retain the current user's permission
        // set. Re-check the session after every replacement so a self-affecting
        // change cannot leave stale authorization assumptions in the CMS shell.
        void authApi.me().then(
          () => router.refresh(),
          () => router.refresh(),
        );
        notify.success("Đã cập nhật phân quyền.", "role-save");
      },
      onError: () => notify.error("Không thể cập nhật phân quyền. Vui lòng thử lại.", "role-save"),
    }),
    remove: useMutation({ meta: { pageLoading: true }, mutationFn: deleteRole, onSuccess: async (result) => { await invalidate(result.id); notify.success("Đã xóa vai trò."); }, onError: () => notify.error("Không thể xóa vai trò. Vui lòng thử lại.") }),
  };
}
