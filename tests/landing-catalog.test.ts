import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { categorySlugFromPathname, isProductsPath } from "../src/landing/components/layout/landing-header-routing.ts";
import { normalizeCrossCategoryProducts } from "../src/landing/features/catalog/cross-category.ts";
import { isCategory, isPaginated, isProduct } from "../src/landing/features/catalog/response-data.ts";
import { boundedPagination, categoryProductsRequest, catalogQueryToSearchParams, isCatalogQueryCanonical, parseCatalogQuery, updateCatalogQuery } from "../src/landing/features/catalog/query.ts";
import type { CatalogProduct } from "../src/landing/features/catalog/types.ts";
import { routes } from "../src/landing/lib/routes.ts";
import { isApiEnvelope } from "../src/lib/api/transport.ts";

const category = { id: "category-1", parentId: null, name: "Bánh ngọt", slug: "banh-ngot", description: null, imageUrl: null, status: "VISIBLE", sortOrder: 1, seoTitle: null, seoDescription: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const product = { id: "product-1", categoryId: category.id, categorySlug: category.slug, categoryName: category.name, sku: "SWEET-1", name: "Bánh su kem", slug: "banh-su-kem", shortDescription: null, description: null, price: "200000.00", salePrice: null, status: "PUBLISHED", isFeatured: false, isBestSeller: false, seoTitle: null, seoDescription: null, images: [], variants: [], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };

test("validates documented category and paginated product responses", () => {
  const page = { items: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 } };
  assert.equal(isApiEnvelope({ code: 200, message: "OK", data: page }), true);
  assert.equal(isCategory(category), true);
  assert.equal(isProduct(product), true);
  assert.equal(isPaginated(page, isProduct), true);
  assert.equal(isPaginated({ items: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0 } }, isProduct), true);
  assert.equal(isPaginated({ ...page, pagination: { ...page.pagination, page: 0 } }, isProduct), false);
  assert.equal(isPaginated({ ...page, items: [{ ...product, price: 200000 }] }, isProduct), false);
});

test("accepts omitted optional DTO fields while enforcing required fields", () => {
  const minimalCategory = { id: "category-min", name: "Cookie", slug: "cookie", status: "VISIBLE", sortOrder: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
  const minimalProduct = { id: "product-min", categoryId: minimalCategory.id, categorySlug: minimalCategory.slug, categoryName: minimalCategory.name, sku: "COOKIE-1", name: "Cookie bơ", slug: "cookie-bo", price: "120000.00", status: "PUBLISHED", isFeatured: false, isBestSeller: false, images: [{ id: "image-1", url: "/uploads/cookie.jpg", sortOrder: 0, isCover: true }], variants: [{ id: "variant-1", sku: "COOKIE-1-BOX", size: "Hộp", style: "Bơ", price: "120000.00", status: "ACTIVE", sortOrder: 0 }], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
  assert.equal(isCategory(minimalCategory), true);
  assert.equal(isProduct(minimalProduct), true);
  assert.equal(isProduct({ ...minimalProduct, slug: undefined }), false);
});

test("category URL state keeps only normalized q and page", () => {
  const legacy = { category: "banh-mi", type: "banh-mi", mode: "grid", q: "  vani   bơ  ", price: "200-500", sort: "price-asc", page: "2" };
  const query = parseCatalogQuery(legacy);
  assert.deepEqual(query, { q: "vani bơ", page: 2 });
  assert.equal(catalogQueryToSearchParams(query).toString(), "q=vani+b%C6%A1&page=2");
  assert.equal(isCatalogQueryCanonical(legacy, query), false);
  assert.equal(isCatalogQueryCanonical({ q: "vani bơ", page: "2" }, query), true);
  assert.deepEqual(categoryProductsRequest(query), { page: 2, limit: 9, search: "vani bơ" });
  assert.deepEqual(categoryProductsRequest({ q: "", page: 1 }), { page: 1, limit: 9 });
});

test("search changes reset pagination while page navigation preserves search", () => {
  const query = { q: "bánh", page: 5 };
  assert.deepEqual(updateCatalogQuery(query, { q: "bơ" }), { q: "bơ", page: 1 });
  assert.deepEqual(updateCatalogQuery(query, { page: 3 }), { q: "bánh", page: 3 });
  assert.deepEqual(boundedPagination(50, 100), [1, "ellipsis-start", 49, 50, 51, "ellipsis-end", 100]);
});

test("category and product route helpers require the category slug", () => {
  assert.equal(routes.categories, "/danh-muc");
  assert.equal(routes.category("banh-kem"), "/danh-muc/banh-kem");
  assert.equal(routes.product("banh-kem", "vani"), "/danh-muc/banh-kem/vani");
});

test("header active-state helpers match only category-driven routes", () => {
  assert.equal(isProductsPath("/danh-muc"), true);
  assert.equal(isProductsPath("/danh-muc/banh-kem/vani"), true);
  assert.equal(isProductsPath("/tin-tuc/danh-muc"), false);
  assert.equal(categorySlugFromPathname("/danh-muc/banh-kem/vani"), "banh-kem");
});

test("related-other products are bounded, deduplicated and exclude the active category", () => {
  const candidates = [catalogProduct("one", "banh-mi"), catalogProduct("duplicate", "banh-mi"), catalogProduct("duplicate", "banh-ngot"), catalogProduct("excluded", "banh-kem"), catalogProduct("two", "banh-ngot"), catalogProduct("three", "qua-tang"), catalogProduct("four", "banh-mi")];
  assert.deepEqual(normalizeCrossCategoryProducts(candidates, "banh-kem", 4).map(({ id }) => id), ["one", "duplicate", "two", "three"]);
});

test("filesystem exposes only category-driven public catalog routes", () => {
  assert.equal(existsSync("src/app/(landing)/san-pham"), false);
  assert.equal(existsSync("src/app/(landing)/danh-muc/page.tsx"), true);
  assert.equal(existsSync("src/app/(landing)/danh-muc/[categorySlug]/page.tsx"), true);
  assert.equal(existsSync("src/app/(landing)/danh-muc/[categorySlug]/[productSlug]/page.tsx"), true);
});

test("category listing and related discovery use only their dedicated GET endpoints", () => {
  const api = readFileSync("src/landing/features/catalog/api.ts", "utf8");
  const route = readFileSync("src/app/(landing)/danh-muc/[categorySlug]/page.tsx", "utf8");
  const repository = readFileSync("src/landing/features/catalog/repository.ts", "utf8");
  const browser = readFileSync("src/landing/features/catalog/catalog-browser.tsx", "utf8");
  assert.match(api, /public\/categories\/\$\{encodeURIComponent\(categorySlug\)\}\/products\?\$\{query\}/);
  assert.match(api, /public\/products\/\$\{encodeURIComponent\(categorySlug\)\}\/related-other/);
  assert.doesNotMatch(api, /public\/filter|public\/products\?\$\{query\}/);
  assert.match(repository, /fetchCategoryProducts/);
  assert.match(repository, /fetchRelatedOtherCategoryProducts/);
  assert.doesNotMatch(repository, /fetchProductPage|selectCrossCategorySlugs/);
  assert.match(route, /loadCatalogPage\(categorySlug, query\)/);
  assert.match(route, /if \(!category\) notFound\(\)/);
  assert.match(route, /getCrossCategoryProducts\(categorySlug\)\.catch/);
  assert.match(route, /return \{ page: null, recovered: false \}/);
  assert.doesNotMatch(browser, /CatalogFilterForm|catalog-sort|query\.price|query\.sort/);
});

function catalogProduct(id: string, categorySlug: string): CatalogProduct {
  return { id, slug: id, status: "published", categorySlug, categorySlugs: [categorySlug], name: id, description: "", image: "", imageAlt: id, pricing: { mode: "fixed", amount: 100000, price: "100.000 ₫", unit: "Giá niêm yết", variants: [] } };
}
