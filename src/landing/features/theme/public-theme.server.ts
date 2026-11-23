import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { backendBaseUrl } from "@/lib/api/backend-client";

import {
  loadLandingThemeCacheRecord,
  resolveLandingThemeFailure,
  resolveLandingThemeFetchFailure,
  type ActiveLandingTheme,
  type LandingThemeCacheRecord,
} from "./theme-data";
import {
  LANDING_ACTIVE_THEME_CACHE_TAG,
  LANDING_ACTIVE_THEME_EXPIRE_SECONDS,
  LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
} from "./theme-cache";

async function getCachedActiveLandingTheme(): Promise<LandingThemeCacheRecord> {
  "use cache";
  cacheTag(LANDING_ACTIVE_THEME_CACHE_TAG);
  const record = await loadLandingThemeCacheRecord({ baseUrl: backendBaseUrl() });
  if (record.state === "fetch-error") {
    // Short-lived negative cache: keep prerender/build safe, retry promptly.
    // Never store the Classic fallback as an active theme result.
    cacheLife({ stale: 1, revalidate: 1, expire: 5 });
  } else {
    cacheLife({
      stale: LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
      revalidate: LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
      expire: LANDING_ACTIVE_THEME_EXPIRE_SECONDS,
    });
  }
  return record;
}

export async function getActiveLandingTheme(): Promise<ActiveLandingTheme> {
  try {
    const record = await getCachedActiveLandingTheme();
    return record.state === "resolved"
      ? record.value
      : resolveLandingThemeFetchFailure(record.failure);
  } catch (error) {
    // Cache/runtime failures are still isolated from Landing rendering.
    return resolveLandingThemeFailure(error);
  }
}

export function reportLandingThemeDiagnostics(result: ActiveLandingTheme) {
  if (result.fetchDiagnostic && result.source !== "classic-no-active") {
    console.warn("[landing-theme] Active theme fallback", {
      source: result.source,
      code: result.fetchDiagnostic.code,
      status: result.fetchDiagnostic.status,
    });
  }

  const schemaDiagnostics = result.theme.diagnostics
    .filter((item) => item.kind === "schema")
    .map((item) => item.code);
  const contrastWarnings = result.theme.diagnostics.flatMap((item) =>
    item.kind === "contrast" && !item.passed ? [item.id] : [],
  );
  if (schemaDiagnostics.length || contrastWarnings.length) {
    console.warn("[landing-theme] Theme diagnostics", {
      source: result.source,
      activeThemeId: result.activeThemeId,
      schemaDiagnostics,
      contrastWarnings,
    });
  }
}
