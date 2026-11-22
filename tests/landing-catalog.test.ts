import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { categorySlugFromPathname, isProductsPath } from "../src/landing/components/layout/landing-header-routing.ts";
import { collectCrossCategoryProducts, selectCrossCategorySlugs } from "../src/landing/features/catalog/cross-category.ts";
import { isCategory, isProduct, isPublicFilterResponse, normalizePublicFilterRequest } from "../src/landing/features/catalog/public-filter-data.ts";
import { boundedPagination, catalogPriceBounds, catalogQueryToFilterRequest, catalogQueryToSearchParams, catalogSortFields, isCatalogQueryCanonical, parseCatalogQuery, updateCatalogQuery } from "../src/landing/features/catalog/query.ts";
import type { CatalogCategory, CatalogProduct } from "../src/landing/features/catalog/types.ts";
import { routes } from "../src/landing/lib/routes.ts";
import { isApiEnvelope } from "../src/lib/api/transport.ts";

const category = { id: "category-1", parentId: null, name: "Bánh ngọt", slug: "banh-ngot", description: null, imageUrl: null, status: "VISIBLE", sortOrder: 1, seoTitle: null, seoDescription: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const product = { id: "product-1", categoryId: category.id, categorySlug: category.slug, categoryName: category.name, sku: "SWEET-1", name: "Bánh su kem", slug: "banh-su-kem", shortDescription: null, description: null, price: "200000.00", salePrice: null, status: "PUBLISHED", isFeatured: false, isBestSeller: false, seoTitle: null, seoDescription: null, images: [], variants: [], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const post = { id: "post-1", title: "Câu chuyện bánh", slug: "cau-chuyen-banh", content: "<p>Nội dung</p>", status: "PUBLISHED", showOnLanding: true, author: { id: "user-1", fullName: "Minh Sâm" }, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const filterResponse = { search: null, products: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 }, categories: [category], posts: [post], suggestions: [{ type: "product", id: product.id, label: product.name, slug: `${category.slug}/${product.slug}` }] };

test("validates documented public filter records and pagination", () => {
  assert.equal(isApiEnvelope({ code: 200, message: "OK", data: filterResponse }), true);
  assert.equal(isPublicFilterResponse(filterResponse), true);
  assert.equal(isPublicFilterResponse({ ...filterResponse, pagination: { page: 0, limit: 9, total: 1, totalPages: 1 } }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, products: [{ ...product, price: 200000 }] }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, categories: [{}] }), false);
});

test("accepts omitted optional DTO fields while enforcing required fields", () => {
  const minimalCategory = { id: "category-min", name: "Cookie", slug: "cookie", status: "VISIBLE", sortOrder: 1, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
  const minimalProduct = { id: "product-min", categoryId: minimalCategory.id, categorySlug: minimalCategory.slug, categoryName: minimalCategory.name, sku: "COOKIE-1", name: "Cookie bơ", slug: "cookie-bo", price: "120000.00", status: "PUBLISHED", isFeatured: false, isBestSeller: false, images: [{ id: "image-1", url: "/uploads/cookie.jpg", sortOrder: 0, isCover: true }], variants: [{ id: "variant-1", sku: "COOKIE-1-BOX", size: "Hộp", style: "Bơ", price: "120000.00", status: "ACTIVE", sortOrder: 0 }], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
  assert.equal(isCategory(minimalCategory), true);
  assert.equal(isProduct(minimalProduct), true);
  assert.equal(isProduct({ ...minimalProduct, images: [{ ...minimalProduct.images[0], alt: null }], salePrice: null }), true);
  assert.equal(isProduct({ ...minimalProduct, slug: undefined }), false);
  assert.equal(isCategory({ ...minimalCategory, status: undefined }), false);
});

test("normalizes only supported public filter request fields", () => {
  assert.deepEqual(normalizePublicFilterRequest({ search: "bánh", page: 2, limit: 9, categoryId: undefined, sortBy: "price", sort: "asc" }), { search: "bánh", page: 2, limit: 9, sortBy: "price", sort: "asc" });
});

test("route category owns URL state and scopes Backend filtering", () => {
  const query = parseCatalogQuery({ category: "banh-mi", type: "banh-mi", q: "  vani  ", price: "200-500", sort: "price-asc", page: "2" }, { allowedCategories: ["banh-mi", "banh-kem"], routeCategory: "banh-kem" });
  assert.deepEqual(query, { q: "vani", category: "banh-kem", price: "200-500", sort: "price-asc", page: 2 });
  assert.equal(catalogQueryToSearchParams(query, { includeCategory: false }).toString(), "q=vani&price=200-500&sort=price-asc&page=2");
  assert.equal(isCatalogQueryCanonical({ q: "vani", price: "200-500", sort: "price-asc", page: "2" }, query, { includeCategory: false }), true);
  assert.deepEqual(catalogQueryToFilterRequest(query, category.id), { search: "vani", page: 2, limit: 9, categoryId: category.id, minPrice: 200000, maxPrice: 500000, sortBy: "price", sort: "asc" });
});

test("filter changes reset pagination while page navigation preserves filters", () => {
  const query = { q: "bánh", category: "banh-kem", price: "all" as const, sort: "default" as const, page: 5 };
  assert.equal(updateCatalogQuery(query, { q: "bơ" }).page, 1);
  assert.equal(updateCatalogQuery(query, { price: "200-500" }).page, 1);
  assert.equal(updateCatalogQuery(query, { sort: "price-desc" }).page, 1);
  assert.deepEqual(updateCatalogQuery(query, { page: 3 }), { ...query, page: 3 });
  assert.deepEqual(boundedPagination(50, 100), [1, "ellipsis-start", 49, 50, 51, "ellipsis-end", 100]);
});

test("price ranges and truthful Backend sort mapping do not overlap", () => {
  assert.deepEqual(catalogPriceBounds("under-200"), { maxPrice: 199_999.99 });
  assert.deepEqual(catalogPriceBounds("200-500"), { minPrice: 200_000, maxPrice: 500_000 });
  assert.deepEqual(catalogPriceBounds("over-500"), { minPrice: 500_000.01 });
  assert.deepEqual(catalogSortFields("default"), { sortBy: "createdAt", sort: "desc" });
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
  assert.equal(categorySlugFromPathname("/danh-muc"), null);
});

test("cross-category discovery is deterministic, bounded, deduplicated and excludes the active category", () => {
  const categories = [catalogCategory("banh-kem"), catalogCategory("banh-mi"), catalogCategory("banh-ngot"), catalogCategory("qua-tang")];
  assert.deepEqual(selectCrossCategorySlugs(categories, "banh-kem"), ["banh-mi", "banh-ngot"]);
  const groups = [[catalogProduct("one", "banh-mi"), catalogProduct("duplicate", "banh-mi")], [catalogProduct("duplicate", "banh-ngot"), catalogProduct("excluded", "banh-kem"), catalogProduct("two", "banh-ngot")]];
  assert.deepEqual(collectCrossCategoryProducts(groups, "banh-kem", 2).map(({ id }) => id), ["one", "duplicate"]);
  assert.deepEqual(collectCrossCategoryProducts(groups, "banh-kem", 4).map(({ id }) => id), ["one", "duplicate", "two"]);
});

test("filesystem exposes only the category-driven public catalog routes", () => {
  assert.equal(existsSync("src/app/(landing)/san-pham"), false);
  assert.equal(existsSync("src/app/(landing)/danh-muc/page.tsx"), true);
  assert.equal(existsSync("src/app/(landing)/danh-muc/[categorySlug]/page.tsx"), true);
  assert.equal(existsSync("src/app/(landing)/danh-muc/[categorySlug]/[productSlug]/page.tsx"), true);
});

test("category storefront keeps one listing and removes obsolete promotional sections", () => {
  const storefront = readFileSync("src/landing/features/catalog/storefront-page.tsx", "utf8");
  const categoryRoute = readFileSync("src/app/(landing)/danh-muc/[categorySlug]/page.tsx", "utf8");
  const detailRoute = readFileSync("src/app/(landing)/danh-muc/[categorySlug]/[productSlug]/page.tsx", "utf8");
  const browser = readFileSync("src/landing/features/catalog/catalog-browser.tsx", "utf8");
  assert.match(storefront, /Khám phá \$\{category\.name\}/);
  assert.match(storefront, /<CatalogBrowser/);
  assert.match(storefront, /Khám phá thêm hương vị/);
  assert.doesNotMatch(storefront, /Tết trọn vị|Ưu đãi đang diễn ra|Chọn bánh cho từng dịp|BannerMedia/);
  assert.doesNotMatch(browser, /onCategoryChange|Tất cả loại bánh|\.slice\(/);
  assert.match(categoryRoute, /loadCatalogPage\(query, category\.id\)/);
  assert.match(detailRoute, /getCatalogProduct\(categorySlug, productSlug\)/);
  assert.doesNotMatch(detailRoute, /resolveProductBySlug|fetchPublicFilter/);
});

test("header and repositories use Backend categories with bounded product requests", () => {
  const layout = readFileSync("src/app/(landing)/layout.tsx", "utf8");
  const header = readFileSync("src/landing/components/layout/landing-header.tsx", "utf8");
  const repository = readFileSync("src/landing/features/catalog/repository.ts", "utf8");
  assert.match(layout, /getCatalogCategories\(\)\.catch\(\(\) => \[\]\)/);
  assert.match(header, /onMouseEnter|onFocus|Escape|isMobileProductsOpen/);
  assert.match(repository, /selectCrossCategorySlugs/);
  assert.match(repository, /page: 1, limit: perCategoryLimit/);
  assert.doesNotMatch(repository, /resolveProductBySlug|findExactSlugAcrossSearchPages/);
});

function catalogCategory(slug: string): CatalogCategory {
  return { id: slug, slug, name: slug, description: "", image: "", imageAlt: slug, badge: "", badgeClassName: "", number: "01", label: "" };
}

function catalogProduct(id: string, categorySlug: string): CatalogProduct {
  return { id, slug: id, status: "published", categorySlug, categorySlugs: [categorySlug], name: id, description: "", image: "", imageAlt: id, pricing: { mode: "fixed", amount: 100000, price: "100.000 ₫", unit: "Giá niêm yết", variants: [] } };
}
