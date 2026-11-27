"use client";

import { blockingMutationOptions } from "@/cms/lib/blocking-mutation-options";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/cms/features/auth/api/auth.client";
import { notify } from "@/cms/lib/notifications";

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
    create: useMutation({ ...blockingMutationOptions, mutationFn: (input: CreateUserInput) => createUser(input), onSuccess: async (user) => { await invalidate(user.id); notify.success("Đã thêm tài khoản.", "user-save"); }, onError: () => notify.error("Không thể thêm tài khoản. Vui lòng thử lại.", "user-save") }),
    update: useMutation({ ...blockingMutationOptions, mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => updateUser(id, input), onSuccess: async (user) => { await invalidate(user.id); refreshSelf(user.id); notify.success("Đã cập nhật tài khoản.", "user-save"); }, onError: () => notify.error("Không thể cập nhật tài khoản. Vui lòng thử lại.", "user-save") }),
    assignRole: useMutation({ ...blockingMutationOptions, mutationFn: ({ id, roleId }: { id: string; roleId: string }) => assignUserRole(id, roleId), onSuccess: async (user) => { await invalidate(user.id); refreshSelf(user.id); notify.success("Đã cập nhật vai trò tài khoản.", "user-save"); }, onError: () => notify.error("Không thể cập nhật vai trò tài khoản. Vui lòng thử lại.", "user-save") }),
    lock: useMutation({ ...blockingMutationOptions, mutationFn: lockUser, onSuccess: async (user) => { await invalidate(user.id); notify.success("Đã khóa tài khoản."); }, onError: () => notify.error("Không thể khóa tài khoản. Vui lòng thử lại.") }),
    unlock: useMutation({ ...blockingMutationOptions, mutationFn: unlockUser, onSuccess: async (user) => { await invalidate(user.id); notify.success("Đã mở khóa tài khoản."); }, onError: () => notify.error("Không thể mở khóa tài khoản. Vui lòng thử lại.") }),
    remove: useMutation({ ...blockingMutationOptions, mutationFn: deleteUser, onSuccess: async (result) => { await invalidate(result.id); notify.success("Đã xóa tài khoản."); }, onError: () => notify.error("Không thể xóa tài khoản. Vui lòng thử lại.") }),
  };
}
