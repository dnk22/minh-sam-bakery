import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  isSearchQueryCanonical, parseSearchQuery, searchFilterRequest,
  searchQueryToSearchParams, updateSearchQuery,
} from "../src/landing/features/search/query.ts";
import { isPublicFilterResponse } from "../src/landing/features/search/response.ts";
import { requestApiEnvelope } from "../src/lib/api/transport.ts";
import { BackendRequestError } from "../src/lib/api/errors.ts";

const categories = [{ id: "category-1", slug: "banh-kem" }, { id: "category-2", slug: "cookie" }];

const product = {
  id: "product-1", categoryId: "category-1", categorySlug: "banh-kem", categoryName: "Bánh kem",
  sku: "BK-1", name: "Bánh kem vani", slug: "banh-kem-vani", price: "200000.00",
  status: "PUBLISHED", isFeatured: false, isBestSeller: false, images: [], variants: [],
  createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
};

const category = {
  id: "category-1", name: "Bánh kem", slug: "banh-kem", status: "VISIBLE", sortOrder: 1,
  createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
};

const result = {
  search: "vani", products: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 },
  categories: [category], posts: [{ title: "Ignored" }], suggestions: [],
};

test("search query normalizes URL state without losing filters", () => {
  const raw = { q: "  banh   kem  ", category: "banh-kem", sort: "price-asc", price: "200-500", page: "3", extra: "ignored" };
  const query = parseSearchQuery(raw);
  assert.deepEqual(query, { q: "banh kem", category: "banh-kem", sort: "price-asc", price: "200-500", page: 3 });
  assert.equal(isSearchQueryCanonical(raw, query), false);
  assert.equal(searchQueryToSearchParams(query).toString(), "q=banh+kem&category=banh-kem&price=200-500&sort=price-asc&page=3");
  assert.equal(isSearchQueryCanonical({ q: "banh kem", category: "banh-kem", price: "200-500", sort: "price-asc", page: "3" }, query), true);
  assert.deepEqual(updateSearchQuery(query, { q: "bơ" }), { ...query, q: "bơ", page: 1 });
  assert.deepEqual(updateSearchQuery(query, { category: "cookie" }), { ...query, category: "cookie", page: 1 });
  assert.deepEqual(updateSearchQuery(query, { page: 5 }), { ...query, page: 5 });
});

test("search query discards invalid sort/price/page and limits search input", () => {
  const query = parseSearchQuery({ q: "a".repeat(150), page: "-2", price: "secret", sort: "none" });
  assert.equal(query.q.length, 100);
  assert.equal(query.page, 1);
  assert.equal(query.price, "all");
  assert.equal(query.sort, "recent");
  assert.equal(searchQueryToSearchParams({ ...query, q: "", category: null }).toString(), "");
});

test("API request uses category UUID, server-side sorting and bounded price ranges", () => {
  const base = parseSearchQuery({ q: "kem", category: "banh-kem", page: "2", sort: "price-asc", price: "under-200" });
  assert.deepEqual(searchFilterRequest(base, categories), {
    search: "kem", categoryId: "category-1", page: 2, limit: 9, maxPrice: 199999.99, sortBy: "price", sort: "asc",
  });
  assert.deepEqual(searchFilterRequest({ ...base, q: "", category: null, price: "200-500", sort: "recent" }, categories), {
    page: 2, limit: 9, minPrice: 200000, maxPrice: 500000, sortBy: "createdAt", sort: "desc",
  });
  assert.deepEqual(searchFilterRequest({ ...base, price: "over-500", sort: "price-desc" }, categories), {
    search: "kem", categoryId: "category-1", page: 2, limit: 9, minPrice: 500000.01, sortBy: "price", sort: "desc",
  });
});

test("public filter validates categories and products, ignores unrelated posts in rendering", async () => {
  assert.equal(isPublicFilterResponse(result), true);
  assert.equal(isPublicFilterResponse({ ...result, products: [{ ...product, price: 200000 }] }), false);
  assert.equal(isPublicFilterResponse({ ...result, pagination: null }), false);
  assert.equal(isPublicFilterResponse({ ...result, posts: undefined }), false);

  let requestBody: unknown;
  const expected = searchFilterRequest(parseSearchQuery({ q: "vani" }), categories);
  const response = await requestApiEnvelope({
    baseUrl: "https://backend.test",
    path: "/api/v1/public/filter",
    method: "POST",
    body: expected,
    validate: isPublicFilterResponse,
    fetchImpl: (async (_url, options) => {
      assert.equal(options?.method, "POST");
      requestBody = JSON.parse(String(options?.body));
      return new Response(JSON.stringify({ code: 200, message: "OK", data: result }), { status: 200 });
    }) as typeof fetch,
  });
  assert.deepEqual(requestBody, expected);
  assert.equal(response.data.products.length, 1);
  assert.equal(response.data.categories.length, 1);
});

test("public filter distinguishes network errors and invalid Backend envelopes", async () => {
  await assert.rejects(requestApiEnvelope({
    baseUrl: "https://backend.test", path: "/api/v1/public/filter", method: "POST",
    validate: isPublicFilterResponse,
    fetchImpl: (async () => { throw new Error("offline"); }) as typeof fetch,
  }), (err) => err instanceof BackendRequestError && err.kind === "network");

  await assert.rejects(requestApiEnvelope({
    baseUrl: "https://backend.test", path: "/api/v1/public/filter", method: "POST",
    validate: isPublicFilterResponse,
    fetchImpl: (async () => new Response(JSON.stringify({ error: "bad" }), { status: 200 })) as typeof fetch,
  }), (err) => err instanceof BackendRequestError && err.kind === "invalid_envelope");
});

test("new search route and header link exist without reintroducing legacy routes", () => {
  assert.equal(existsSync("src/app/(landing)/tim-kiem/page.tsx"), true);
  assert.equal(existsSync("src/app/(landing)/san-pham"), false);
  const header = readFileSync("src/landing/components/layout/landing-header.tsx", "utf8");
  const route = readFileSync("src/app/(landing)/tim-kiem/page.tsx", "utf8");
  assert.match(header, /aria-label="Tìm kiếm sản phẩm"/);
  assert.match(route, /getGlobalSearchResults/);
});
