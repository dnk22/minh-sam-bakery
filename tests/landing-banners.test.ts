import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  activeBannerIndex,
  adjacentBannerId,
  bannerRenderMode,
  isBannerResponseArray,
  isLandingBannerEligible,
  normalizeLandingBanner,
  resolvePublicBannerImageUrl,
  resolveSafeBannerLink,
  selectLandingBanners,
} from "../src/landing/features/banners/banner-data.ts";
import type { LandingBanner } from "../src/landing/features/banners/types.ts";

const now = new Date("2026-11-22T06:00:00.000Z");
const rawBanner = {
  id: "banner-1", title: "Mùa đoàn viên", desktopImageUrl: "/uploads/banners/hero.jpg",
  mobileImageUrl: "/uploads/banners/hero-mobile.jpg", link: "/san-pham", position: "home_hero",
  sortOrder: 2, startsAt: "2026-11-01T00:00:00.000Z", endsAt: "2026-12-01T00:00:00.000Z",
  isActive: true, createdAt: "2026-01-02T00:00:00.000Z", updatedAt: "2026-01-03T00:00:00.000Z",
};

function banner(overrides: Partial<LandingBanner> = {}): LandingBanner {
  return {
    id: "banner-1", title: "Mùa đoàn viên", desktopImageUrl: "https://api.example.com/uploads/banners/hero.jpg",
    mobileImageUrl: null, link: null, position: "home_hero", sortOrder: 0, startsAt: null, endsAt: null,
    isActive: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", ...overrides,
  };
}

test("validates the public array and normalizes each API record independently", () => {
  assert.equal(isBannerResponseArray([rawBanner]), true);
  assert.equal(isBannerResponseArray({ items: [rawBanner] }), false);
  assert.deepEqual(normalizeLandingBanner(rawBanner, "https://api.example.com", "home_hero"), {
    ...rawBanner,
    desktopImageUrl: "https://api.example.com/uploads/banners/hero.jpg",
    mobileImageUrl: "https://api.example.com/uploads/banners/hero-mobile.jpg",
  });
  assert.equal(normalizeLandingBanner({ ...rawBanner, position: "about_hero" }, "https://api.example.com", "home_hero"), null);
  assert.equal(normalizeLandingBanner({ ...rawBanner, desktopImageUrl: "javascript:alert(1)" }, "https://api.example.com"), null);
});

test("applies active and half-open schedule eligibility", () => {
  assert.equal(isLandingBannerEligible(banner(), now), true);
  assert.equal(isLandingBannerEligible(banner({ isActive: false }), now), false);
  assert.equal(isLandingBannerEligible(banner({ startsAt: now.toISOString() }), now), true);
  assert.equal(isLandingBannerEligible(banner({ endsAt: now.toISOString() }), now), false);
  assert.equal(isLandingBannerEligible(banner({ startsAt: "invalid" }), now), false);
  assert.equal(isLandingBannerEligible(banner({ endsAt: "invalid" }), now), false);
});

test("deduplicates and sorts deterministically by order, creation time, then id", () => {
  const selected = selectLandingBanners([
    banner({ id: "c", sortOrder: 2 }),
    banner({ id: "b", sortOrder: 1, createdAt: "2026-01-02T00:00:00.000Z" }),
    banner({ id: "a", sortOrder: 1, createdAt: "2026-01-02T00:00:00.000Z" }),
    banner({ id: "a", sortOrder: -1 }),
  ], now);
  assert.deepEqual(selected.map((item) => item.id), ["a", "b", "c"]);
});

test("accepts only safe public image and navigation URLs", () => {
  assert.equal(resolvePublicBannerImageUrl("/uploads/a.jpg", "https://api.example.com"), "https://api.example.com/uploads/a.jpg");
  assert.equal(resolvePublicBannerImageUrl("https://cdn.example.com/a.jpg", "https://api.example.com"), "https://cdn.example.com/a.jpg");
  for (const unsafe of ["//evil.test/a.jpg", "/api/cms/uploads/a.jpg", "/uploads/../api/cms/private.jpg", "/uploads/\\\\evil.example/x.jpg", "data:image/png;base64,x", "blob:https://site.test/x", "javascript:alert(1)"]) assert.equal(resolvePublicBannerImageUrl(unsafe, "https://api.example.com"), null);
  assert.equal(resolveSafeBannerLink("/san-pham"), "/san-pham");
  assert.equal(resolveSafeBannerLink("\n/san-pham"), null);
  assert.equal(resolvePublicBannerImageUrl("\t/uploads/a.jpg", "https://api.example.com"), null);
  assert.equal(resolveSafeBannerLink("https://example.com/sale"), "https://example.com/sale");
  for (const unsafe of ["//evil.test", "/\\\\evil.test", "/a\\\\b", "/a\nLocation: https://evil.test", "javascript:alert(1)", "data:text/html,x", "san-pham"]) assert.equal(resolveSafeBannerLink(unsafe), null);
  assert.equal(resolveSafeBannerLink("/san-pham/../tin-tuc?sort=new#featured"), "/tin-tuc?sort=new#featured");
});

test("selects fallback, single and carousel rendering modes", () => {
  assert.equal(bannerRenderMode(0), "fallback");
  assert.equal(bannerRenderMode(1), "single");
  assert.equal(bannerRenderMode(2), "carousel");
});

test("keeps the active slide valid when banners change in place", () => {
  const initial = [banner({ id: "a" }), banner({ id: "b" }), banner({ id: "c" })];
  assert.equal(activeBannerIndex(initial, null), 0);
  assert.equal(activeBannerIndex(initial, "c"), 2);
  assert.equal(adjacentBannerId(initial, "c", 1), "a");
  assert.equal(adjacentBannerId(initial, "a", -1), "c");
  const shortened = initial.slice(0, 2);
  assert.equal(activeBannerIndex(shortened, "c"), 0);
  assert.equal(adjacentBannerId(shortened, "c", 1), "b");
  assert.equal(activeBannerIndex([initial[2], initial[0], initial[1]], "c"), 0);
  assert.equal(adjacentBannerId([], "c", 1), null);
});

test("keeps inactive carousel slides out of keyboard navigation and protects hero controls", () => {
  const media = readFileSync("src/landing/features/banners/components/banner-media/banner-media.tsx", "utf8");
  const styles = readFileSync("src/landing/features/banners/components/banner-media/banner-media.module.css", "utf8");
  const hero = readFileSync("src/landing/components/sections/hero-section.tsx", "utf8");
  assert.match(media, /inert=\{!isActive\}/);
  assert.match(media, /aria-hidden=\{!isActive\}/);
  assert.match(hero, /controlsPlacement="below-header"/);
  assert.match(styles, /\.controlsBelowHeader \.controls/);
  assert.match(styles, /var\(--landing-header-height\)/);
});

test("managed banner images use generic captions without changing fallback editorial copy", () => {
  const gifting = readFileSync("src/landing/components/sections/gifting-section.tsx", "utf8");
  const about = readFileSync("src/landing/features/about/components/about-hero-section.tsx", "utf8");
  assert.match(gifting, /hasManagedMedia/);
  assert.match(gifting, /Hộp Quà Di Sản Đoan Viên/);
  assert.match(about, /hasManagedMedia/);
  assert.match(about, /FIG\. 01 \/ BỘ SƯU TẬP TRĂNG RẰM/);
});

test("maps every registry position and configures bounded cache freshness", () => {
  const home = readFileSync("src/app/(landing)/page.tsx", "utf8");
  const products = readFileSync("src/app/(landing)/san-pham/page.tsx", "utf8");
  const about = readFileSync("src/app/(landing)/ve-minh-sam/page.tsx", "utf8");
  const api = readFileSync("src/landing/features/banners/public-banners.server.ts", "utf8");
  const cache = readFileSync("src/lib/banner/cache.ts", "utf8");
  const collectionRoute = readFileSync("src/app/api/cms/banners/route.ts", "utf8");
  const itemRoute = readFileSync("src/app/api/cms/banners/[id]/route.ts", "utf8");
  assert.match(home, /home_hero/); assert.match(home, /home_gifting/);
  assert.match(products, /products_hero/); assert.match(about, /about_hero/);
  assert.match(api, /\/api\/v1\/public\/banners/); assert.match(api, /landingBannerCacheTags/);
  assert.match(cache, /LANDING_BANNERS_REVALIDATE_SECONDS = 60/);
  assert.match(collectionRoute, /revalidateLandingBanners\(\)/);
  assert.equal((itemRoute.match(/revalidateLandingBanners\(\)/g) ?? []).length, 2);
});
