"use client";

import { blockingMutationOptions } from "@/cms/lib/blocking-mutation-options";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/cms/lib/notifications";

import { createSystemConfig, deleteSystemConfig, updateSystemConfig } from "../api/system-configs.client";
import { systemConfigQueryKeys } from "../lib/system-config-query-keys";
import type { CreateSystemConfigInput, UpdateSystemConfigInput } from "../types";

export function useSystemConfigMutations() {
  const client = useQueryClient();
  const invalidate = async (id?: string) => Promise.all([
    client.invalidateQueries({ queryKey: systemConfigQueryKeys.lists() }),
    id ? client.invalidateQueries({ queryKey: systemConfigQueryKeys.detail(id) }) : Promise.resolve(),
  ]);
  return {
    create: useMutation({ ...blockingMutationOptions, mutationFn: (input: CreateSystemConfigInput) => createSystemConfig(input), onSuccess: async (config) => { await invalidate(config.id); notify.success("Đã thêm cấu hình hệ thống.", "system-config-save"); }, onError: () => notify.error("Không thể thêm cấu hình. Vui lòng thử lại.", "system-config-save") }),
    update: useMutation({ ...blockingMutationOptions, mutationFn: ({ id, input }: { id: string; input: UpdateSystemConfigInput }) => updateSystemConfig(id, input), onSuccess: async (config) => { await invalidate(config.id); notify.success("Đã cập nhật cấu hình hệ thống.", "system-config-save"); }, onError: () => notify.error("Không thể cập nhật cấu hình. Vui lòng thử lại.", "system-config-save") }),
    remove: useMutation({ ...blockingMutationOptions, mutationFn: deleteSystemConfig, onSuccess: async (result) => { await invalidate(result.id); client.removeQueries({ queryKey: systemConfigQueryKeys.detail(result.id) }); notify.success("Đã xóa cấu hình hệ thống.", "system-config-delete"); }, onError: () => notify.error("Không thể xóa cấu hình. Vui lòng thử lại.", "system-config-delete") }),
  };
}
