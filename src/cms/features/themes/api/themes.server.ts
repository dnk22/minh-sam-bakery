import "server-only";

import { backendRequest } from "@/lib/api/backend-client";
import { isDeletedTheme, isTheme, isThemeList } from "../lib/theme-data";
import type { CmsTheme, ThemeCreateInput, ThemeList, ThemeListParams, ThemePatchInput } from "../types";

export async function backendThemeList(token: string, params: ThemeListParams, signal?: AbortSignal): Promise<ThemeList> {
  return (await backendRequest({
    path: "/api/v1/themes", query: params, accessToken: token,
    cache: "no-store", signal, validate: isThemeList,
  })).data;
}

export async function backendThemeDetail(token: string, id: string, signal?: AbortSignal): Promise<CmsTheme> {
  return (await backendRequest({
    path: "/api/v1/themes/" + encodeURIComponent(id), accessToken: token,
    cache: "no-store", signal, validate: isTheme,
  })).data;
}

export async function backendCreateTheme(token: string, input: ThemeCreateInput): Promise<CmsTheme> {
  return (await backendRequest({
    path: "/api/v1/themes", method: "POST", accessToken: token, body: input,
    cache: "no-store", validate: isTheme,
  })).data;
}

export async function backendUpdateTheme(token: string, id: string, input: ThemePatchInput): Promise<CmsTheme> {
  return (await backendRequest({
    path: "/api/v1/themes/" + encodeURIComponent(id), method: "PATCH",
    accessToken: token, body: input, cache: "no-store", validate: isTheme,
  })).data;
}

export async function backendDeleteTheme(token: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({
    path: "/api/v1/themes/" + encodeURIComponent(id), method: "DELETE",
    accessToken: token, cache: "no-store", validate: isDeletedTheme,
  })).data;
}

/** A separate mutation: normal theme PATCH must remain draft-only. */
export async function backendActivateTheme(token: string, id: string): Promise<CmsTheme> {
  return (await backendRequest({
    path: "/api/v1/themes/" + encodeURIComponent(id),
    method: "PATCH", accessToken: token, body: { isActive: true },
    cache: "no-store", validate: isTheme,
  })).data;
}
