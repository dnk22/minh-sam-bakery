import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { isProduct } from "../src/landing/features/catalog/response-data.ts";
import { routes } from "../src/landing/lib/routes.ts";

const product = {
  id: "prod-1", categoryId: "cat-1", categorySlug: "qua-tang", categoryName: "Quà tặng",
  sku: "GIFT-1", name: "Hộp quà cao cấp", slug: "hop-qua-cao-cap",
  price: "350000.00", salePrice: "320000.00", status: "PUBLISHED",
  isFeatured: false, isBestSeller: false, images: [], variants: [],
  createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
};

test("public products require a priced Backend DTO, including gift products", () => {
  assert.equal(isProduct(product), true);
  assert.equal(isProduct({ ...product, price: undefined }), false);
  assert.equal(isProduct({ ...product, price: null }), false);
  assert.equal(routes.product(product.categorySlug, product.slug), "/danh-muc/qua-tang/hop-qua-cao-cap");
});

test("all public product routes use priced API detail without editorial fallback", () => {
  const route = readFileSync("src/app/(landing)/danh-muc/[categorySlug]/[productSlug]/page.tsx", "utf8");
  const detailAdapter = readFileSync("src/landing/features/product/api-adapter.ts", "utf8");
  assert.match(route, /return <FixedPriceProductPage product=\{product\} \/>/);
  assert.doesNotMatch(route, /findEditorialQuotation|QuotationProductPage|isQuotationProductDetail/);
  assert.match(detailAdapter, /checkoutAvailable: false/);
  assert.doesNotMatch(detailAdapter, /Liên hệ tư vấn|pricing\.mode/);
});

test("Landing has no quotation feature, quote card branch, or mock product dataset", () => {
  const removed = [
    "src/landing/features/quotation",
    "src/landing/features/product/components/quotation-product-page.tsx",
    "src/landing/features/product/components/quotation-action-button.tsx",
    "src/landing/features/product/data.ts",
    "src/landing/features/catalog/data.ts",
    "src/landing/features/catalog/merchandising.ts",
    "src/landing/features/catalog/selectors.ts",
  ];
  for (const path of removed) assert.equal(existsSync(path), false, path);
  const catalog = readFileSync("src/landing/features/catalog/types.ts", "utf8");
  const cards = readFileSync("src/landing/features/catalog/catalog-browser.tsx", "utf8");
  const storefront = readFileSync("src/landing/features/catalog/storefront-page.tsx", "utf8");
  assert.doesNotMatch(catalog + cards + storefront, /quotationProfile|mode: "quote"|Liên hệ tư vấn/);
  assert.match(cards, /product\.pricing\.price/);
  assert.match(storefront, /return product\.pricing\.price/);
});

test("product purchase keeps checkout disabled until real order integration", () => {
  const purchase = readFileSync("src/landing/features/product/components/fixed-price-purchase-experience.tsx", "utf8");
  const adapter = readFileSync("src/landing/features/product/api-adapter.ts", "utf8");
  assert.match(adapter, /checkoutAvailable: false/);
  assert.match(purchase, /disabled=\{!checkoutAvailable\}/);
  assert.doesNotMatch(purchase, /handleAddToCart|THÊM VÀO GIỎ/);
});
