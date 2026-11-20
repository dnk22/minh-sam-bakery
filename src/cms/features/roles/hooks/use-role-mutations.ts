"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/cms/features/auth/api/auth.client";

import { createRole, deleteRole, replaceRolePermissions, updateRole } from "../api/roles.client";
import { roleQueryKeys } from "../lib/role-query-keys";
import type { CreateRoleInput, UpdateRoleInput } from "../types";

export function useRoleMutations() {
  const client = useQueryClient();
  const router = useRouter();
  const invalidate = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: roleQueryKeys.lists() }),
      id ? client.invalidateQueries({ queryKey: roleQueryKeys.detail(id) }) : Promise.resolve(),
      id ? client.invalidateQueries({ queryKey: roleQueryKeys.permissions(id) }) : Promise.resolve(),
    ]);
  };
  return {
    create: useMutation({ mutationFn: (input: CreateRoleInput) => createRole(input), onSuccess: (role) => invalidate(role.id) }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) => updateRole(id, input), onSuccess: (role) => invalidate(role.id) }),
    permissions: useMutation({
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
      },
    }),
    remove: useMutation({ mutationFn: deleteRole, onSuccess: (result) => invalidate(result.id) }),
  };
}
