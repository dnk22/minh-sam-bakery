import "server-only";
import { backendRequest } from "@/lib/api/backend-client";
import { isBanner, isBannerList, isDeletedBanner } from "../lib/banner-data";
import type { Banner, BannerList, BannerListParams, CreateBannerInput, UpdateBannerInput } from "../types";
export async function backendBannerList(accessToken: string, params: BannerListParams, signal?: AbortSignal): Promise<BannerList> { return (await backendRequest({ path: "/api/v1/banners", query: params, accessToken, cache: "no-store", signal, validate: isBannerList })).data; }
export async function backendBannerDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Banner> { return (await backendRequest({ path: `/api/v1/banners/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isBanner })).data; }
export async function backendCreateBanner(accessToken: string, input: CreateBannerInput): Promise<Banner> { return (await backendRequest({ path: "/api/v1/banners", method: "POST", body: input, accessToken, cache: "no-store", validate: isBanner })).data; }
export async function backendUpdateBanner(accessToken: string, id: string, input: UpdateBannerInput): Promise<Banner> { return (await backendRequest({ path: `/api/v1/banners/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isBanner })).data; }
export async function backendDeleteBanner(accessToken: string, id: string): Promise<{ id: string }> { return (await backendRequest({ path: `/api/v1/banners/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedBanner })).data; }
