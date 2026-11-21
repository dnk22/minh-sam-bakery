import assert from "node:assert/strict";
import test from "node:test";

import { buildBannerListQuery, isBanner, isBannerList, isDeletedBanner, parseBannerActive, parseBannerPage } from "../src/cms/features/banners/lib/banner-data.ts";
import { bannerQueryKeys } from "../src/cms/features/banners/lib/banner-query-keys.ts";
import { bannerCreateSchema, bannerFormSchema, bannerPatchSchema, bannerToForm, formToBannerCreate, formToBannerPatch } from "../src/cms/features/banners/schemas/banner.schema.ts";
import type { Banner } from "../src/cms/features/banners/types.ts";
import { BANNER_POSITIONS, BANNER_POSITION_OPTIONS, getBannerPosition, getBannerPositionLabel, isBannerPosition } from "../src/lib/banner/positions.ts";
import { isAllowedCmsUploadFolder } from "../src/cms/lib/api/upload-validation.ts";

const banner: Banner = { id: "banner-1", title: "Mùa lễ hội", desktopImageUrl: "/uploads/desktop.jpg", mobileImageUrl: "/uploads/mobile.jpg", link: "/san-pham", position: "home_hero", sortOrder: 2, startsAt: "2026-12-01T00:00:00.000Z", endsAt: "2026-12-31T00:00:00.000Z", isActive: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z" };

test("exposes a stable independent banner position registry", () => {
  assert.deepEqual(BANNER_POSITIONS.map((item) => item.value), ["home_hero", "home_gifting", "products_hero", "about_hero"]);
  assert.equal(BANNER_POSITION_OPTIONS.length, 4);
  assert.equal(isBannerPosition("products_hero"), true);
  assert.equal(isBannerPosition("unknown"), false);
  assert.equal(getBannerPosition("about_hero")?.page, "/ve-minh-sam");
  assert.equal(getBannerPositionLabel("home_gifting"), "Quà tặng trang chủ");
  assert.equal(isAllowedCmsUploadFolder("banners"), true);
});

test("validates required fields, links, positions and schedule consistency", () => {
  assert.equal(bannerFormSchema.safeParse({ ...bannerToForm(), title: "", position: "bad" }).success, false);
  assert.equal(bannerFormSchema.safeParse({ ...bannerToForm(), title: "Hero", position: "home_hero", desktopImageUrl: "/uploads/a.jpg", link: "javascript:alert(1)" }).success, false);
  assert.equal(bannerFormSchema.safeParse({ ...bannerToForm(), title: "Hero", position: "home_hero", desktopImageUrl: "/uploads/a.jpg", startsAt: "2026-12-02T10:00", endsAt: "2026-12-01T10:00" }).success, false);
  assert.equal(bannerCreateSchema.safeParse({ title: "Hero", position: "home_hero", desktopImageUrl: "/uploads/a.jpg" }).success, true);
  assert.equal(bannerPatchSchema.safeParse({}).success, false);
  assert.equal(bannerPatchSchema.safeParse({ position: "unknown" }).success, false);
});

test("maps create and patch DTOs including explicit optional-field clearing", () => {
  const create = formToBannerCreate({ ...bannerToForm(), title: " Hero ", position: "home_hero", desktopImageUrl: " /uploads/a.jpg ", link: "", startsAt: "", endsAt: "" });
  assert.deepEqual(create, { title: "Hero", position: "home_hero", desktopImageUrl: "/uploads/a.jpg", sortOrder: 0, isActive: true });
  const patch = formToBannerPatch({ ...bannerToForm(banner), mobileImageUrl: "", link: "", startsAt: "", endsAt: "", title: "Mùa lễ hội mới" }, banner);
  assert.deepEqual(patch, { title: "Mùa lễ hội mới", mobileImageUrl: null, link: null, startsAt: null, endsAt: null });
});

test("validates API list, detail and delete response shapes", () => {
  assert.equal(isBanner(banner), true);
  assert.equal(isBanner({ ...banner, position: "unknown" }), false);
  assert.equal(isBanner({ ...banner, isActive: "true" }), false);
  assert.equal(isBannerList({ items: [banner], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isDeletedBanner({ id: "banner-1" }), true);
});

test("serializes search and server-side filters with one-based pagination", () => {
  assert.equal(buildBannerListQuery({ page: 2, limit: 20, search: "mùa hè", position: "home_hero", isActive: false }), "page=2&limit=20&search=m%C3%B9a+h%C3%A8&position=home_hero&isActive=false");
  assert.equal(parseBannerPage("0"), 1);
  assert.equal(parseBannerActive("true"), true);
  assert.equal(parseBannerActive("invalid"), undefined);
  assert.deepEqual(bannerQueryKeys.list({ page: 1, limit: 20 }), ["cms", "banners", "list", { page: 1, limit: 20 }]);
  assert.deepEqual(bannerQueryKeys.detail("banner-1"), ["cms", "banners", "detail", "banner-1"]);
});
