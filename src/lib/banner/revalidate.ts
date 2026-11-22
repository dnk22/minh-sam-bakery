import "server-only";

import { revalidateTag } from "next/cache";

import { LANDING_BANNERS_CACHE_TAG } from "./cache";

export function revalidateLandingBanners() {
  revalidateTag(LANDING_BANNERS_CACHE_TAG, { expire: 0 });
}
