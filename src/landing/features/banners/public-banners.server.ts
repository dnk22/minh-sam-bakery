import "server-only";

import { connection } from "next/server";

import { backendBaseUrl, backendRequest } from "@/lib/api/backend-client";
import {
  landingBannerCacheTags,
  LANDING_BANNERS_REVALIDATE_SECONDS,
} from "@/lib/banner/cache";
import type { BannerPosition } from "@/lib/banner/positions";

import {
  isBannerResponseArray,
  normalizeLandingBanner,
  selectLandingBanners,
} from "./banner-data";

export async function getPublicLandingBanners(position: BannerPosition) {
  let response;
  try {
    response = await backendRequest({
      path: "/api/v1/public/banners",
      query: { position },
      cache: "force-cache",
      next: {
        revalidate: LANDING_BANNERS_REVALIDATE_SECONDS,
        tags: [...landingBannerCacheTags(position)],
      },
      validate: isBannerResponseArray,
    });
  } catch (error) {
    await connection();
    throw error;
  }
  const baseUrl = backendBaseUrl();
  const normalized = response.data.flatMap((item) => {
    const banner = normalizeLandingBanner(item, baseUrl, position);
    return banner ? [banner] : [];
  });
  await connection();
  return selectLandingBanners(normalized);
}
