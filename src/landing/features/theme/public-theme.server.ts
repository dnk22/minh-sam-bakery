import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { backendBaseUrl } from "@/lib/api/backend-client";

import {
  resolveLandingThemeData,
  resolveLandingThemeFailure,
  requestPublicTheme,
  type ActiveLandingTheme,
} from "./theme-data";
import {
  LANDING_ACTIVE_THEME_CACHE_TAG,
  LANDING_ACTIVE_THEME_EXPIRE_SECONDS,
  LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
} from "./theme-cache";

async function getCachedActiveLandingTheme(): Promise<ActiveLandingTheme> {
  "use cache";
  cacheLife({
    stale: LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
    revalidate: LANDING_ACTIVE_THEME_REVALIDATE_SECONDS,
    expire: LANDING_ACTIVE_THEME_EXPIRE_SECONDS,
  });
  cacheTag(LANDING_ACTIVE_THEME_CACHE_TAG);
  try {
    return resolveLandingThemeData(await requestPublicTheme({ baseUrl: backendBaseUrl() }));
  } catch (error) {
    return resolveLandingThemeFailure(error);
  }
}

export async function getActiveLandingTheme(): Promise<ActiveLandingTheme> {
  try {
    return await getCachedActiveLandingTheme();
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
