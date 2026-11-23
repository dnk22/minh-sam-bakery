import { existsSync, readFileSync } from "node:fs";

import { routes } from "../src/landing/lib/routes.ts";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const productRoutePath = "src/app/(landing)/danh-muc/[categorySlug]/[productSlug]/page.tsx";
const productRoute = readFileSync(productRoutePath, "utf8");
const adapter = readFileSync("src/landing/features/catalog/adapters.ts", "utf8");
const productTypes = readFileSync("src/landing/features/product/types.ts", "utf8");
const catalogTypes = readFileSync("src/landing/features/catalog/types.ts", "utf8");
const productCard = readFileSync("src/landing/features/catalog/components/product-card.tsx", "utf8");

assert(routes.category("qua-tang") === "/danh-muc/qua-tang", "Category route helper is inconsistent");
assert(routes.categories === "/danh-muc", "Categories route helper is inconsistent");
assert(routes.product("banh-ngot", "sample") === "/danh-muc/banh-ngot/sample", "Product route helper is inconsistent");
assert(routes.article("sample") === "/tin-tuc/sample", "Article route helper is inconsistent");
assert(routes.about === "/ve-minh-sam", "About route helper is inconsistent");
assert(routes.search === "/tim-kiem", "Search route helper is inconsistent");

assert(productRoute.includes("getCatalogProduct") && productRoute.includes("FixedPriceProductPage"), "Product detail must use Backend data and priced product page");
assert(!/QuotationProduct|findEditorialQuotation/.test(productRoute), "Quotation route fallback must not exist");
assert(!/quotationProfile|mode:\s*["']quote["']/.test(adapter + productTypes + catalogTypes + productCard), "Catalog must not contain quotation pricing");
assert(!existsSync("src/landing/features/quotation"), "Landing quotation module must be removed");
assert(!existsSync("src/landing/features/product/components/quotation-product-page.tsx"), "Quotation product page must be removed");
assert(!existsSync("src/landing/features/catalog/data.ts"), "Legacy catalog mock fixtures must be removed");

console.log("Navigation and priced product contracts validated.");
