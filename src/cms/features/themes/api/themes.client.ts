import { cmsApiClient } from "@/cms/lib/api/client";

import { buildThemeListQuery } from "../lib/theme-data";
import type { CmsTheme, ThemeCreateInput, ThemeList, ThemeListParams, ThemePatchInput } from "../types";

export function getThemes(params: ThemeListParams, signal?: AbortSignal) {
  return cmsApiClient.get<ThemeList>("/themes?" + buildThemeListQuery(params), { signal });
}

export function getTheme(id: string, signal?: AbortSignal) {
  return cmsApiClient.get<CmsTheme>("/themes/" + encodeURIComponent(id), { signal });
}

export const createTheme = (input: ThemeCreateInput) => cmsApiClient.post<CmsTheme>("/themes", input);
export const updateTheme = (id: string, input: ThemePatchInput) =>
  cmsApiClient.patch<CmsTheme>("/themes/" + encodeURIComponent(id), input);
export const deleteTheme = (id: string) => cmsApiClient.delete<{ id: string }>("/themes/" + encodeURIComponent(id));
