"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/cms/lib/notifications";
import { createTheme, deleteTheme, updateTheme } from "../api/themes.client";
import { themeQueryKeys } from "../lib/theme-query-keys";
import type { ThemePatchInput } from "../types";

export function useThemeMutations() {
  const client = useQueryClient();
  const refresh = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: themeQueryKeys.lists() }),
      id ? client.invalidateQueries({ queryKey: themeQueryKeys.detail(id) }) : Promise.resolve(),
    ]);
  };
  return {
    create: useMutation({
      mutationFn: createTheme,
      onSuccess: async (theme) => { await refresh(theme.id); notify.success("Đã tạo theme nháp."); },
      onError: () => notify.error("Không thể tạo theme. Vui lòng kiểm tra thông tin."),
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: ThemePatchInput }) => updateTheme(id, input),
      onSuccess: async (theme) => { await refresh(theme.id); notify.success("Đã cập nhật theme."); },
      onError: () => notify.error("Không thể cập nhật theme."),
    }),
    remove: useMutation({
      mutationFn: deleteTheme,
      onSuccess: async (result) => { await refresh(result.id); notify.success("Đã xóa theme."); },
      onError: () => notify.error("Không thể xóa theme."),
    }),
  };
}
