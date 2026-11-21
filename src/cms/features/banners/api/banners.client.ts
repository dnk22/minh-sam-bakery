import { cmsApiClient } from "@/cms/lib/api/client";
import { buildBannerListQuery } from "../lib/banner-data";
import type { Banner, BannerList, BannerListParams, CreateBannerInput, UpdateBannerInput } from "../types";
export const getBanners = (params: BannerListParams, signal?: AbortSignal) => cmsApiClient.get<BannerList>(`/banners?${buildBannerListQuery(params)}`, { signal });
export const getBanner = (id: string, signal?: AbortSignal) => cmsApiClient.get<Banner>(`/banners/${encodeURIComponent(id)}`, { signal });
export const createBanner = (input: CreateBannerInput) => cmsApiClient.post<Banner>("/banners", input);
export const updateBanner = (id: string, input: UpdateBannerInput) => cmsApiClient.patch<Banner>(`/banners/${encodeURIComponent(id)}`, input);
export const deleteBanner = (id: string) => cmsApiClient.delete<{ id: string }>(`/banners/${encodeURIComponent(id)}`);
