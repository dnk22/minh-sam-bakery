import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { isApiEnvelope } from "../src/lib/api/transport.ts";
import {
  isCategory,
  isProduct,
  isPublicFilterResponse,
  normalizePublicFilterRequest,
} from "../src/landing/features/catalog/public-filter-data.ts";
import {
  boundedPagination,
  catalogPriceBounds,
  catalogQueryToFilterRequest,
  catalogQueryToSearchParams,
  catalogSortFields,
  isCatalogQueryCanonical,
  isStorefrontCategoryQueryCanonical,
  parseCatalogQuery,
  parseStorefrontCategoryQuery,
  storefrontCategoryQueryToSearchParams,
  storefrontCategoryRequestSearchParams,
  updateCatalogQuery,
} from "../src/landing/features/catalog/query.ts";
import { findExactSlugAcrossSearchPages } from "../src/landing/features/catalog/product-lookup.ts";

const category = {
  id: "category-1", parentId: null, name: "Bánh ngọt", slug: "banh-ngot", description: null,
  imageUrl: null, status: "VISIBLE", sortOrder: 1, seoTitle: null, seoDescription: null,
  createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
};
const product = {
  id: "product-1", categoryId: category.id, categorySlug: category.slug, categoryName: category.name,
  sku: "SWEET-1", name: "Bánh su kem", slug: "banh-su-kem", shortDescription: null,
  description: null, price: "200000.00", salePrice: null, status: "PUBLISHED", isFeatured: false,
  isBestSeller: false, seoTitle: null, seoDescription: null, images: [], variants: [],
  createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
};
const post = {
  id: "post-1", title: "Câu chuyện bánh", slug: "cau-chuyen-banh", content: "<p>Nội dung</p>",
  status: "PUBLISHED", showOnLanding: true, author: { id: "user-1", fullName: "Minh Sâm" },
  createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
};
const filterResponse = {
  search: null,
  products: [product],
  pagination: { page: 1, limit: 9, total: 1, totalPages: 1 },
  categories: [category],
  posts: [post],
  suggestions: [{ type: "product", id: product.id, label: product.name, slug: `${category.slug}/${product.slug}` }],
};

test("validates the documented filter data and rejects invalid envelopes or records", () => {
  assert.equal(isApiEnvelope({ code: 200, message: "OK", data: filterResponse }), true);
  assert.equal(isApiEnvelope({ message: "OK", data: filterResponse }), false);
  assert.equal(isPublicFilterResponse(filterResponse), true);
  assert.equal(isPublicFilterResponse({ ...filterResponse, search: undefined, suggestions: [{ type: "product", id: "1", label: "Bánh" }] }), true);
  assert.equal(isPublicFilterResponse({ ...filterResponse, pagination: { page: 0, limit: 9, total: 1, totalPages: 1 } }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, pagination: { page: 1, limit: 0, total: 1, totalPages: 1 } }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, products: [{ ...product, price: 200000 }] }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, categories: [{}] }), false);
});

test("accepts omitted optional DTO fields while enforcing required fields", () => {
  const minimalCategory = {
    id: "category-min", name: "Cookie", slug: "cookie", status: "VISIBLE", sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  };
  const minimalProduct = {
    id: "product-min", categoryId: minimalCategory.id, categorySlug: minimalCategory.slug,
    categoryName: minimalCategory.name, sku: "COOKIE-1", name: "Cookie bơ", slug: "cookie-bo",
    price: "120000.00", status: "PUBLISHED", isFeatured: false, isBestSeller: false,
    images: [{ id: "image-1", url: "/uploads/cookie.jpg", sortOrder: 0, isCover: true }],
    variants: [{ id: "variant-1", sku: "COOKIE-1-BOX", size: "Hộp", style: "Bơ", price: "120000.00", status: "ACTIVE", sortOrder: 0 }],
    createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  };
  assert.equal(isCategory(minimalCategory), true);
  assert.equal(isProduct(minimalProduct), true);
  assert.equal(isProduct({ ...minimalProduct, images: [{ ...minimalProduct.images[0], alt: null }], salePrice: null }), true);
  assert.equal(isProduct({ ...minimalProduct, slug: undefined }), false);
  assert.equal(isCategory({ ...minimalCategory, status: undefined }), false);
  assert.equal(isPublicFilterResponse({ ...filterResponse, products: [minimalProduct], categories: [minimalCategory] }), true);
});

test("normalizes public filter requests without inventing unsupported fields", () => {
  assert.deepEqual(normalizePublicFilterRequest({ search: "bánh", page: 2, limit: 9, categoryId: undefined, sortBy: "price", sort: "asc" }), {
    search: "bánh", page: 2, limit: 9, sortBy: "price", sort: "asc",
  });
});

test("parses canonical URL state, legacy categories, duplicates and invalid values", () => {
  const allowedCategories = ["banh-ngot", "banh-mi"];
  assert.deepEqual(parseCatalogQuery({}, { allowedCategories }), { q: "", category: null, price: "all", sort: "default", page: 1 });
  const parsed = parseCatalogQuery({ q: ["  bánh   su  ", "ignored"], category: ["banh-ngot", "banh-mi"], price: "200-500", sort: "price-asc", page: "2" }, { allowedCategories });
  assert.deepEqual(parsed, { q: "bánh su", category: "banh-ngot", price: "200-500", sort: "price-asc", page: 2 });
  assert.equal(isCatalogQueryCanonical({ q: ["bánh su", "ignored"], category: "banh-ngot" }, { ...parsed, price: "all", sort: "default", page: 1 }), false);
  assert.equal(parseCatalogQuery({ type: "banh-mi", mode: "quote" }, { allowedCategories }).category, "banh-mi");
  assert.deepEqual(parseCatalogQuery({ category: "unknown", price: "bad", sort: "bad", page: "-2" }, { allowedCategories }), { q: "", category: null, price: "all", sort: "default", page: 1 });
  assert.equal(parseCatalogQuery({ page: "999999999" }).page, 10_000);
});

test("category route takes precedence and serialization is deterministic", () => {
  const query = parseCatalogQuery({ category: "banh-mi", type: "banh-mi", q: "bơ" }, { allowedCategories: ["banh-mi", "banh-ngot"], routeCategory: "banh-ngot" });
  assert.equal(query.category, "banh-ngot");
  assert.equal(catalogQueryToSearchParams(query, { includeCategory: false }).toString(), "q=b%C6%A1");
  assert.equal(catalogQueryToSearchParams({ ...query, category: "banh-mi", price: "under-200", sort: "price-desc", page: 3 }).toString(), "q=b%C6%A1&category=banh-mi&price=under-200&sort=price-desc&page=3");
});

test("storefront category query keeps only canonical search state", () => {
  const parsed = parseStorefrontCategoryQuery({ q: ["  trung   thu ", "ignored"], page: "2", price: "under-200", mode: "quote", category: "banh-cookie" });
  assert.deepEqual(parsed, { q: "trung thu", page: 2 });
  assert.equal(storefrontCategoryQueryToSearchParams(parsed).toString(), "q=trung+thu&page=2");
  assert.equal(isStorefrontCategoryQueryCanonical({ q: "trung thu", page: "2" }, parsed), true);
  assert.equal(isStorefrontCategoryQueryCanonical({ q: "trung thu", page: "2", price: "under-200" }, parsed), false);
  assert.deepEqual(parseStorefrontCategoryQuery({ q: "   ", page: "-1" }), { q: "", page: 1 });
  assert.equal(storefrontCategoryRequestSearchParams({ search: "cookie", page: 3, limit: 12 }).toString(), "page=3&limit=12&search=cookie");
  assert.equal(storefrontCategoryRequestSearchParams().toString(), "page=1&limit=12");
});

test("maps exact non-overlapping inclusive price boundaries and Backend sorting", () => {
  assert.deepEqual(catalogPriceBounds("all"), {});
  assert.deepEqual(catalogPriceBounds("under-200"), { maxPrice: 199_999.99 });
  assert.deepEqual(catalogPriceBounds("200-500"), { minPrice: 200_000, maxPrice: 500_000 });
  assert.deepEqual(catalogPriceBounds("over-500"), { minPrice: 500_000.01 });
  assert.deepEqual(catalogSortFields("default"), { sortBy: "createdAt", sort: "desc" });
  assert.deepEqual(catalogSortFields("price-asc"), { sortBy: "price", sort: "asc" });
  assert.deepEqual(catalogSortFields("price-desc"), { sortBy: "price", sort: "desc" });
  assert.deepEqual(catalogQueryToFilterRequest({ q: "bánh", category: "banh-ngot", price: "under-200", sort: "price-asc", page: 2 }, category.id), {
    search: "bánh", page: 2, limit: 9, categoryId: category.id, maxPrice: 199_999.99, sortBy: "price", sort: "asc",
  });
});

test("resets page for filter changes, preserves it for pagination and bounds page controls", () => {
  const query = { q: "bánh", category: null, price: "all" as const, sort: "default" as const, page: 5 };
  assert.equal(updateCatalogQuery(query, { q: "bơ" }).page, 1);
  assert.equal(updateCatalogQuery(query, { category: "banh-ngot" }).page, 1);
  assert.equal(updateCatalogQuery(query, { price: "200-500" }).page, 1);
  assert.equal(updateCatalogQuery(query, { sort: "price-desc" }).page, 1);
  assert.equal(updateCatalogQuery(query, { page: 3 }).page, 3);
  assert.deepEqual(boundedPagination(1, 1), [1]);
  assert.deepEqual(boundedPagination(4, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(boundedPagination(50, 100), [1, "ellipsis-start", 49, 50, 51, "ellipsis-end", 100]);
  assert.deepEqual(boundedPagination(1, 0), []);
});

test("finds an exact product slug beyond the first search page without a fixed cutoff", async () => {
  const calls: number[] = [];
  const match = await findExactSlugAcrossSearchPages("target", async (page) => {
    calls.push(page);
    return {
      items: page === 2 ? [{ slug: "target", categorySlug: "cookie" }] : [{ slug: `other-${page}`, categorySlug: "other" }],
      pagination: { page, limit: 1, total: 3, totalPages: 3 },
    };
  });
  assert.equal(match?.slug, "target");
  assert.deepEqual(calls, [1, 2]);
  const missing = await findExactSlugAcrossSearchPages("missing", async (page) => ({ items: [{ slug: `other-${page}` }], pagination: { page, limit: 1, total: 2, totalPages: 2 } }));
  assert.equal(missing, undefined);
});

test("keeps storefront category discovery separate from category product listing", () => {
  const api = readFileSync("src/landing/features/catalog/api.ts", "utf8");
  const repository = readFileSync("src/landing/features/catalog/repository.ts", "utf8");
  const browser = readFileSync("src/landing/features/catalog/catalog-browser.tsx", "utf8");
  const controls = readFileSync("src/landing/features/catalog/catalog-controls.tsx", "utf8");
  const storefront = readFileSync("src/landing/features/catalog/storefront-page.tsx", "utf8");
  const productsRoute = readFileSync("src/app/(landing)/san-pham/page.tsx", "utf8");
  const categoryRoute = readFileSync("src/app/(landing)/danh-muc/[slug]/page.tsx", "utf8");
  assert.match(api, /method: "POST"/);
  assert.match(api, /cache: "no-store"/);
  assert.match(api, /\/api\/v1\/public\/filter/);
  assert.doesNotMatch(repository, /getCatalogSnapshot|fetchProducts/);
  assert.doesNotMatch(browser, /\.slice\(/);
  assert.doesNotMatch(controls, /Hình Thức Mua|facet|count=/);
  assert.match(controls, /Mới đăng/);
  assert.doesNotMatch(storefront, /CatalogBrowser|Sản phẩm đang phục vụ|san-pham-truc-tuyen/);
  assert.match(storefront, /<CatalogSearchForm[^>]*onSearch=\{searchCatalog\}/);
  assert.ok(storefront.indexOf("Khám phá các dòng bánh") < storefront.indexOf("<CatalogSearchForm"));
  assert.match(storefront, /routes\.category\(category\.slug\)/);
  assert.match(storefront, /<FeaturedSeason products=\{featuredProducts\}/);
  assert.match(storefront, /BannerMedia/);
  assert.match(storefront, /Không tìm thấy dòng bánh phù hợp/);
  assert.match(storefront, /Chưa thể tải các dòng bánh/);
  assert.match(productsRoute, /getStorefrontCategories/);
  assert.doesNotMatch(productsRoute, /getCatalogPage|fetchPublicFilter/);
  assert.match(api, /\/api\/v1\/public\/categories\?\$\{query\}/);
  assert.match(categoryRoute, /getCatalogPage/);
  assert.match(repository, /findExactSlugAcrossSearchPages/);
  assert.match(repository, /fetchProduct\(match\.categorySlug, match\.slug\)/);
  assert.match(browser, /routes\.products\}#danh-muc/);
});
