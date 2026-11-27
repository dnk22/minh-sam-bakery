import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");
const checkout = "src/landing/features/checkout/";
const catalog = "src/landing/features/catalog/";

test("only checkout network operations opt in to the shared blocking loader", () => {
  assert.match(read("src/app/(landing)/layout.tsx"), /<LandingPageLoading \/>/);
  assert.match(read("src/landing/components/loading/landing-page-loading.tsx"), /<PageLoading open=\{open\}/);
  const qr = read(checkout + "hooks/use-payment-qr.ts");
  assert.match(qr, /if \(!enabled \|\| !sessionId\) return;[\s\S]*pageLoading.begin\(\)/);
  assert.match(qr, /\.finally\(release\)/);
  assert.match(qr, /controller.abort\(\); release\(\)/);
  const order = read(checkout + "hooks/use-create-order.ts");
  assert.match(order, /markCheckoutSessionPending[\s\S]*withPageLoading\(\(\) => createOrder\(input\)\)/);
  assert.doesNotMatch(read(checkout + "hooks/use-payment-upload.ts"), /withPageLoading|pageLoading.begin/);
  assert.doesNotMatch(read(checkout + "components/checkout-payment-section.tsx"), /LoaderCircle/);
});

test("catalog and search share one pending transition per page and reuse skeletons", () => {
  assert.match(read(catalog + "storefront-page.tsx"), /pending=\{navigation.pending\}/);
  assert.match(read(catalog + "storefront-page.tsx"), /<CatalogBrowser navigation=\{navigation\}/);
  assert.match(read(catalog + "catalog-browser.tsx"), /<ProductListGrid products=\{page.products\} pending=\{navigation.pending\}/);
  assert.match(read("src/landing/features/search/components/search-results.tsx"), /<ProductListGrid products=\{products\} pending=\{pending\}/);
  assert.match(read("src/landing/components/ui/search-form.tsx"), /disabled=\{pending\}/);
  assert.match(read("src/landing/components/ui/search-form.tsx"), /pending \? <LoaderCircle/);
  assert.match(read(catalog + "components/product/product-list-grid.tsx"), /invisible h-full/);
  assert.match(read(catalog + "components/product/product-card-skeleton.tsx"), /aspect-\[4\/3\]/);
  assert.match(read("src/app/(landing)/tim-kiem/loading.tsx"), /<ProductGridSkeleton/);
  assert.match(read(catalog + "catalog-loading.tsx"), /<ProductGridSkeleton/);
  assert.doesNotMatch(read(catalog + "hooks/use-product-actions.ts"), /withPageLoading|pageLoading.begin/);
});
