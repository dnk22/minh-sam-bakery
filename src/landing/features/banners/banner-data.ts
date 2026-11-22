import { isBannerPosition, type BannerPosition } from "../../../lib/banner/positions.ts";

import type { BannerRenderMode, LandingBanner } from "./types.ts";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isOptionalString = (value: unknown) =>
  value === undefined || value === null || typeof value === "string";

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isBannerResponseArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

const hasUnsafeUrlCharacters = (value: string) => /[\\\u0000-\u001f\u007f]/.test(value);

export function resolvePublicBannerImageUrl(value: unknown, backendBaseUrl: string) {
  if (!nonEmptyString(value)) return null;
  const candidate = value.trim();
  if (hasUnsafeUrlCharacters(candidate) || candidate.startsWith("//")) return null;
  if (candidate.startsWith("/")) {
    if (!candidate.startsWith("/uploads/")) return null;
    try {
      const backend = new URL(backendBaseUrl);
      const url = new URL(candidate, backend);
      // Reject URL-parser normalization that escapes the public uploads directory.
      return url.origin === backend.origin && url.pathname.startsWith("/uploads/")
        ? url.toString()
        : null;
    } catch {
      return null;
    }
  }
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function resolveSafeBannerLink(value: unknown) {
  if (!nonEmptyString(value)) return null;
  const candidate = value.trim();
  // Backslashes can be interpreted as slashes by browsers, turning an apparently
  // internal path ("/\\evil.example") into a cross-origin navigation.
  if (hasUnsafeUrlCharacters(candidate) || candidate.startsWith("//")) return null;
  try {
    if (candidate.startsWith("/")) {
      const siteOrigin = "https://minh-sam.invalid";
      const url = new URL(candidate, siteOrigin);
      if (url.origin !== siteOrigin) return null;
      return `${url.pathname}${url.search}${url.hash}`;
    }
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeLandingBanner(
  value: unknown,
  backendBaseUrl: string,
  expectedPosition?: BannerPosition,
): LandingBanner | null {
  if (
    !isRecord(value) ||
    !nonEmptyString(value.id) ||
    !nonEmptyString(value.title) ||
    !isBannerPosition(value.position) ||
    (expectedPosition !== undefined && value.position !== expectedPosition) ||
    typeof value.sortOrder !== "number" ||
    !Number.isFinite(value.sortOrder) ||
    typeof value.isActive !== "boolean" ||
    !nonEmptyString(value.createdAt) ||
    !nonEmptyString(value.updatedAt) ||
    !isOptionalString(value.mobileImageUrl) ||
    !isOptionalString(value.link) ||
    !isOptionalString(value.startsAt) ||
    !isOptionalString(value.endsAt)
  ) return null;

  const desktopImageUrl = resolvePublicBannerImageUrl(value.desktopImageUrl, backendBaseUrl);
  if (
    !desktopImageUrl ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    !Number.isFinite(Date.parse(value.updatedAt))
  ) return null;

  return {
    id: value.id.trim(),
    title: value.title.trim(),
    desktopImageUrl,
    mobileImageUrl: resolvePublicBannerImageUrl(value.mobileImageUrl, backendBaseUrl),
    link: resolveSafeBannerLink(value.link),
    position: value.position,
    sortOrder: value.sortOrder,
    startsAt: typeof value.startsAt === "string" && value.startsAt.trim() ? value.startsAt : null,
    endsAt: typeof value.endsAt === "string" && value.endsAt.trim() ? value.endsAt : null,
    isActive: value.isActive,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function validBoundary(value: string | null) {
  if (value === null) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function isLandingBannerEligible(banner: LandingBanner, now: Date | number = Date.now()) {
  if (!banner.isActive) return false;
  const timestamp = typeof now === "number" ? now : now.getTime();
  const startsAt = validBoundary(banner.startsAt);
  const endsAt = validBoundary(banner.endsAt);
  if (Number.isNaN(startsAt) || Number.isNaN(endsAt)) return false;
  return (startsAt === null || startsAt <= timestamp) && (endsAt === null || timestamp < endsAt);
}

export function selectLandingBanners(banners: LandingBanner[], now: Date | number = Date.now()) {
  const eligible = banners.filter((banner) => isLandingBannerEligible(banner, now));
  eligible.sort((left, right) =>
    left.sortOrder - right.sortOrder ||
    Date.parse(left.createdAt) - Date.parse(right.createdAt) ||
    left.id.localeCompare(right.id),
  );
  const unique = new Map<string, LandingBanner>();
  for (const banner of eligible) if (!unique.has(banner.id)) unique.set(banner.id, banner);
  return [...unique.values()];
}

/** Keep a selected banner stable by ID even when the list is reordered or shortened. */
export function activeBannerIndex(
  banners: ReadonlyArray<Pick<LandingBanner, "id">>,
  selectedId: string | null,
) {
  const index = selectedId === null ? -1 : banners.findIndex((banner) => banner.id === selectedId);
  return index < 0 ? 0 : index;
}

export function adjacentBannerId(
  banners: ReadonlyArray<Pick<LandingBanner, "id">>,
  selectedId: string | null,
  direction: number,
): string | null {
  if (!banners.length) return null;
  const index = activeBannerIndex(banners, selectedId);
  return banners[((index + direction) % banners.length + banners.length) % banners.length].id;
}

export function bannerRenderMode(count: number): BannerRenderMode {
  return count === 0 ? "fallback" : count === 1 ? "single" : "carousel";
}
