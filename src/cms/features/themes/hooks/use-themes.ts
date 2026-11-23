"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTheme, getThemes } from "../api/themes.client";
import { themeQueryKeys } from "../lib/theme-query-keys";
import type { ThemeListParams } from "../types";

export function useThemes(params: ThemeListParams) {
  return useQuery({
    queryKey: themeQueryKeys.list(params),
    queryFn: ({ signal }) => getThemes(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
  });
}

export function useThemeDetail(id?: string) {
  return useQuery({
    queryKey: themeQueryKeys.detail(id ?? ""),
    queryFn: ({ signal }) => getTheme(id ?? "", signal),
    enabled: Boolean(id),
    staleTime: 10_000,
    retry: false,
  });
}
