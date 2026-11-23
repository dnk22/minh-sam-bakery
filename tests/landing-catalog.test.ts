import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { categorySlugFromPathname, isProductsPath } from "../src/landing/components/layout/landing-header-routing.ts";
import { normalizeCrossCategoryProducts } from "../src/landing/features/catalog/cross-category.ts";
import { categoryProductsEndpoint, relatedOtherEndpoint } from "../src/landing/features/catalog/endpoints.ts";
import { catalogRedirectPage, loadCatalogPageOnce } from "../src/landing/features/catalog/page-policy.ts";
import { isCategory, isPaginated, isProduct, visibleCategories } from "../src/landing/features/catalog/response-data.ts";
import { boundedPagination, categoryProductsRequest, catalogQueryToSearchParams, isCatalogQueryCanonical, parseCatalogQuery, updateCatalogQuery } from "../src/landing/features/catalog/query.ts";
import type { CatalogProduct } from "../src/landing/features/catalog/types.ts";
import { routes } from "../src/landing/lib/routes.ts";
import { BackendRequestError } from "../src/lib/api/errors.ts";
import { isApiEnvelope, requestApiEnvelope } from "../src/lib/api/transport.ts";
import type { CategoryResponseDto, ProductResponseDto } from "../src/lib/api/types.ts";

const category: CategoryResponseDto = { id: "category-1", parentId: null, name: "Bánh ngọt", slug: "banh-ngot", description: null, imageUrl: null, status: "VISIBLE", sortOrder: 1, seoTitle: null, seoDescription: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const product: ProductResponseDto = { id: "product-1", categoryId: category.id, categorySlug: category.slug, categoryName: category.name, sku: "SWEET-1", name: "Bánh su kem", slug: "banh-su-kem", shortDescription: null, description: null, price: "200000.00", salePrice: null, status: "PUBLISHED", isFeatured: false, isBestSeller: false, seoTitle: null, seoDescription: null, images: [], variants: [], createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };

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

test("category API accepts empty lists and excludes hidden categories", async () => {
  const hidden: CategoryResponseDto = { ...category, id: "category-hidden", slug: "an", status: "HIDDEN" };
  const data = { items: [category, hidden], pagination: { page: 1, limit: 100, total: 2, totalPages: 1 } };
  const response = await mockedApiRequest(
    "/api/v1/public/categories?page=1&limit=100",
    data,
    (value): value is typeof data => isPaginated(value, isCategory),
  );
  assert.deepEqual(visibleCategories(response.data.items).map(({ slug }) => slug), ["banh-ngot"]);
  assert.deepEqual(visibleCategories([]), []);
  await assert.rejects(
    requestApiEnvelope({
      baseUrl: "https://backend.test",
      path: "/api/v1/public/categories?page=1&limit=100",
      validate: (value): value is typeof data => isPaginated(value, isCategory),
      fetchImpl: (async () => jsonResponse({ code: 500, message: "Lỗi hệ thống", data: null }, 500)) as typeof fetch,
    }),
    (error) => error instanceof BackendRequestError && error.kind === "http" && error.status === 500,
  );
});

test("category products API sends encoded slug and documented server-side parameters", async () => {
  const endpoint = categoryProductsEndpoint("bánh kem", { page: 1, limit: 9, search: "vani bơ" });
  assert.equal(endpoint, "/api/v1/public/categories/b%C3%A1nh%20kem/products?page=1&limit=9&search=vani+b%C6%A1");
  const data = { items: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 } };
  let requestedUrl = "";
  const response = await requestApiEnvelope({
    baseUrl: "https://backend.test",
    path: endpoint,
    validate: (value): value is typeof data => isPaginated(value, isProduct),
    fetchImpl: (async (input) => {
      requestedUrl = String(input);
      return jsonResponse({ code: 200, message: "OK", data });
    }) as typeof fetch,
  });
  assert.equal(requestedUrl, `https://backend.test${endpoint}`);
  assert.deepEqual(response.data.pagination, data.pagination);
  assert.equal(categoryProductsEndpoint("banh-kem"), "/api/v1/public/categories/banh-kem/products?page=1&limit=9");
});

test("category products API distinguishes HTTP, timeout and invalid DTO failures", async () => {
  const endpoint = categoryProductsEndpoint("khong-ton-tai");
  await assert.rejects(
    requestApiEnvelope({
      baseUrl: "https://backend.test",
      path: endpoint,
      validate: (value): value is never => isPaginated(value, isProduct),
      fetchImpl: (async () => jsonResponse({ code: 404, message: "Không tìm thấy dữ liệu", data: null }, 404)) as typeof fetch,
    }),
    (error) => error instanceof BackendRequestError && error.kind === "http" && error.status === 404,
  );
  const keepEventLoopAlive = setInterval(() => undefined, 10);
  try {
    await assert.rejects(
      requestApiEnvelope({
        baseUrl: "https://backend.test",
        path: categoryProductsEndpoint("banh-kem", { page: 2 }),
        timeoutMs: 1,
        validate: (value): value is never => isPaginated(value, isProduct),
        fetchImpl: abortingFetch,
      }),
      (error) => error instanceof BackendRequestError && error.kind === "timeout",
    );
  } finally {
    clearInterval(keepEventLoopAlive);
  }
  await assert.rejects(
    mockedApiRequest(
      categoryProductsEndpoint("banh-kem"),
      { items: [{ ...product, price: 200000 }], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 } },
      (value): value is { items: Array<typeof product> } => isPaginated(value, isProduct),
    ),
    (error) => error instanceof BackendRequestError && error.kind === "invalid_data",
  );
});

test("related-other endpoint has no query parameters and validates empty results", async () => {
  const endpoint = relatedOtherEndpoint("banh-kem");
  assert.equal(endpoint, "/api/v1/public/products/banh-kem/related-other");
  assert.equal(endpoint.includes("?"), false);
  const data = { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  const response = await mockedApiRequest(
    endpoint,
    data,
    (value): value is typeof data => isPaginated(value, isProduct),
  );
  assert.deepEqual(response.data.items, []);
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

test("pagination redirects only from valid Backend metadata", async () => {
  const pagination = { page: 2, limit: 9, total: 11, totalPages: 2 };
  assert.equal(catalogRedirectPage(2, pagination), null);
  assert.equal(catalogRedirectPage(3, pagination), 2);
  assert.equal(catalogRedirectPage(4, { page: 1, limit: 9, total: 0, totalPages: 0 }), 1);

  for (const error of [
    new BackendRequestError("http", { status: 500 }),
    new BackendRequestError("timeout"),
    new BackendRequestError("invalid_data"),
  ]) {
    let calls = 0;
    let captured: unknown;
    const page = await loadCatalogPageOnce(
      async () => {
        calls += 1;
        throw error;
      },
      (current) => { captured = current; },
    );
    assert.equal(page, null);
    assert.equal(calls, 1);
    assert.equal(captured, error);
  }
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
  assert.match(api, /categoryProductsEndpoint\(categorySlug, filters\)/);
  assert.match(api, /relatedOtherEndpoint\(categorySlug\)/);
  assert.doesNotMatch(api, /public\/filter|public\/products\?\$\{query\}/);
  assert.match(repository, /fetchCategoryProducts/);
  assert.match(repository, /fetchRelatedOtherCategoryProducts/);
  assert.match(repository, /cache\(async/);
  assert.doesNotMatch(repository, /fetchProductPage|selectCrossCategorySlugs/);
  assert.match(route, /loadCatalogPage\(categorySlug, query\)/);
  assert.match(route, /if \(!category\) notFound\(\)/);
  assert.match(route, /getCrossCategoryProducts\(categorySlug\)\.catch/);
  assert.doesNotMatch(route, /getCatalogPage\(categorySlug, \{ \.\.\.query, page: 1 \}\)/);
  assert.match(route, /catalogRedirectPage\(query\.page, catalogPage\.pagination\)/);
  assert.doesNotMatch(browser, /CatalogFilterForm|catalog-sort|query\.price|query\.sort/);
  assert.match(readFileSync("src/landing/features/catalog/storefront-page.tsx", "utf8"), /#danh-muc/);
  assert.doesNotMatch(readFileSync("src/landing/features/catalog/storefront-page.tsx", "utf8"), /#san-pham|id="san-pham"/);
});

function catalogProduct(id: string, categorySlug: string): CatalogProduct {
  return { id, slug: id, status: "published", categorySlug, categorySlugs: [categorySlug], name: id, description: "", image: "", imageAlt: id, pricing: { amount: 100000, price: "100.000 ₫", unit: "Giá bán", originalPrice: 100000, salePrice: null, effectivePrice: 100000, hasDiscount: false, discountPercent: null, isFrom: false, available: true, variants: [] } };
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockedApiRequest<T>(
  path: string,
  data: unknown,
  validate: (value: unknown) => value is T,
) {
  return requestApiEnvelope({
    baseUrl: "https://backend.test",
    path,
    validate,
    fetchImpl: (async () => jsonResponse({ code: 200, message: "OK", data })) as typeof fetch,
  });
}

const abortingFetch = (async (_input: RequestInfo | URL, init?: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  })) as typeof fetch;

test("catalog presentation splits page composition, navigation and purchase dialog without changing routes", () => {
  const base = "src/landing/features/catalog";
  const browser = readFileSync(`${base}/catalog-browser.tsx`, "utf8");
  const controls = readFileSync(`${base}/catalog-controls.tsx`, "utf8");
  const storefront = readFileSync(`${base}/storefront-page.tsx`, "utf8");
  const navigate = readFileSync(`${base}/hooks/use-catalog-navigation.ts`, "utf8");
  const purchaseHook = readFileSync(`${base}/hooks/use-product-actions.ts`, "utf8");
  const modal = readFileSync(`${base}/components/product/product-variant-dialog.tsx`, "utf8");
  assert.ok(browser.split("\n").length < 100);
  assert.ok(storefront.split("\n").length < 110);
  assert.match(browser, /export \{ CatalogPagination \}/);
  assert.match(browser, /export \{ ProductCard \}/);
  assert.match(controls, /export \{ CatalogSearchForm \}/);
  assert.match(controls, /export \{ CatalogToolbar \}/);
  assert.match(navigate, /catalogQueryToSearchParams/);
  assert.match(navigate, /updateCatalogQuery/);
  assert.match(navigate, /scroll: false/);
  assert.match(storefront, /#danh-muc/);
  assert.match(storefront, /CrossCategoryDiscovery/);
  assert.match(purchaseHook, /saveBuyNowIntent/);
  assert.match(purchaseHook, /addItem\(line\)/);
  assert.match(purchaseHook, /variants.length === 1/);
  assert.match(modal, /Dialog.Root/);
});

test("Catalog modules are grouped and shared primitives do not import feature code", () => {
  const base = "src/landing/features/catalog";
  const pagination = readFileSync("src/landing/components/ui/pagination.tsx", "utf8");
  const searchForm = readFileSync("src/landing/components/ui/search-form.tsx", "utf8");
  const browser = readFileSync(`${base}/catalog-browser.tsx`, "utf8");
  const controls = readFileSync(`${base}/catalog-controls.tsx`, "utf8");
  assert.match(browser, /Pagination as CatalogPagination/);
  assert.match(browser, /components\/product\/product-card/);
  assert.match(controls, /SearchForm as CatalogSearchForm/);
  assert.match(pagination, /function Pagination/);
  assert.match(searchForm, /function SearchForm/);
  assert.doesNotMatch(pagination + searchForm, /features\/catalog|features\/search/);
  for (const name of ["listing/catalog-toolbar", "product/product-card", "discovery/cross-category-discovery"]) {
    assert.equal(existsSync(`${base}/components/${name}.tsx`), true, name);
  }
  assert.equal(existsSync(`${base}/utils/query.ts`), true);
  assert.equal(existsSync(`${base}/utils/pricing.ts`), true);
});
