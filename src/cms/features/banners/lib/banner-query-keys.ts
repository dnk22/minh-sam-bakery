import type { BannerListParams } from "../types";
export const bannerQueryKeys = { all: ["cms", "banners"] as const, lists: () => ["cms", "banners", "list"] as const, list: (params: BannerListParams) => ["cms", "banners", "list", params] as const, detail: (id: string) => ["cms", "banners", "detail", id] as const };
