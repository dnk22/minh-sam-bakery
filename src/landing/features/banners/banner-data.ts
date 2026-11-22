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

export function resolvePublicBannerImageUrl(value: unknown, backendBaseUrl: string) {
  if (!nonEmptyString(value)) return null;
  const candidate = value.trim();
  if (candidate.startsWith("//")) return null;
  if (candidate.startsWith("/")) {
    if (!candidate.startsWith("/uploads/")) return null;
    try {
      return new URL(candidate, `${backendBaseUrl.replace(/\/$/, "")}/`).toString();
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
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  try {
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

export function bannerRenderMode(count: number): BannerRenderMode {
  return count === 0 ? "fallback" : count === 1 ? "single" : "carousel";
}
