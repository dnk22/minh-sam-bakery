"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBanner, getBanners } from "../api/banners.client";
import { bannerQueryKeys } from "../lib/banner-query-keys";
import type { BannerListParams } from "../types";
export const useBanners = (params: BannerListParams) => useQuery({ queryKey: bannerQueryKeys.list(params), queryFn: ({ signal }) => getBanners(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
export const useBannerDetail = (id?: string) => useQuery({ queryKey: bannerQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getBanner(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
