"use client";

import { blockingMutationOptions } from "@/cms/lib/blocking-mutation-options";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/cms/lib/notifications";
import { activateTheme } from "../api/themes.client";
import { themeQueryKeys } from "../lib/theme-query-keys";

export function useThemeActivation() {
  const client = useQueryClient();
  return useMutation({ ...blockingMutationOptions,
    mutationFn: activateTheme,
    retry: false,
    onSettled: async () => {
      await client.invalidateQueries({ queryKey: themeQueryKeys.all });
    },
    onSuccess: (result) => {
      if (result.cacheSync === "pending") notify.info("Theme đã active nhưng cache Landing chưa đồng bộ. Có thể thử đồng bộ lại.");
      else notify.success("Theme đã được kích hoạt. Tải lại Landing để nhận giao diện mới.");
    },
  });
}
