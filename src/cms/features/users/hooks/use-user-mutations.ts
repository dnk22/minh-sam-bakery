"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/cms/features/auth/api/auth.client";

import { assignUserRole, createUser, deleteUser, lockUser, unlockUser, updateUser } from "../api/users.client";
import { userQueryKeys } from "../lib/user-query-keys";
import type { CreateUserInput, UpdateUserInput } from "../types";

export function useUserMutations(currentUserId: string) {
  const client = useQueryClient();
  const router = useRouter();
  const invalidate = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: userQueryKeys.lists() }),
      id ? client.invalidateQueries({ queryKey: userQueryKeys.detail(id) }) : Promise.resolve(),
    ]);
  };
  const refreshSelf = (id: string) => {
    if (id !== currentUserId) return;
    void authApi.me().then(() => router.refresh(), () => router.refresh());
  };
  return {
    create: useMutation({ mutationFn: (input: CreateUserInput) => createUser(input), onSuccess: (user) => invalidate(user.id) }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => updateUser(id, input), onSuccess: async (user) => { await invalidate(user.id); refreshSelf(user.id); } }),
    assignRole: useMutation({ mutationFn: ({ id, roleId }: { id: string; roleId: string }) => assignUserRole(id, roleId), onSuccess: async (user) => { await invalidate(user.id); refreshSelf(user.id); } }),
    lock: useMutation({ mutationFn: lockUser, onSuccess: (user) => invalidate(user.id) }),
    unlock: useMutation({ mutationFn: unlockUser, onSuccess: (user) => invalidate(user.id) }),
    remove: useMutation({ mutationFn: deleteUser, onSuccess: (result) => invalidate(result.id) }),
  };
}
