import "server-only";

import { revalidateTag } from "next/cache";

export const LANDING_ACTIVE_THEME_CACHE_TAG = "landing-active-theme";
export const LANDING_ACTIVE_THEME_REVALIDATE_SECONDS = 60;
export const LANDING_ACTIVE_THEME_EXPIRE_SECONDS = 5 * 60;

/** Reserved for authenticated CMS activation in a later phase. */
export function revalidateLandingActiveTheme() {
  revalidateTag(LANDING_ACTIVE_THEME_CACHE_TAG, { expire: 0 });
}
