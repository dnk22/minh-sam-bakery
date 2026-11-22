import type { BannerPosition } from "./positions";

export const LANDING_BANNERS_CACHE_TAG = "landing-banners";
export const LANDING_BANNERS_REVALIDATE_SECONDS = 60;

export function landingBannerPositionCacheTag(position: BannerPosition) {
  return `${LANDING_BANNERS_CACHE_TAG}:${position}`;
}

export function landingBannerCacheTags(position: BannerPosition) {
  return [LANDING_BANNERS_CACHE_TAG, landingBannerPositionCacheTag(position)] as const;
}
