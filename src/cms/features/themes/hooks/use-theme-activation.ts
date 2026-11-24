"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/cms/lib/notifications";
import { activateTheme } from "../api/themes.client";
import { themeQueryKeys } from "../lib/theme-query-keys";

export function useThemeActivation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: activateTheme,
    onSuccess: async (theme) => {
      await client.invalidateQueries({ queryKey: themeQueryKeys.lists() });
      await client.invalidateQueries({ queryKey: themeQueryKeys.detail(theme.id) });
      notify.success("Theme đã được kích hoạt. Tải lại Landing để nhận giao diện mới.");
    },
  });
}
