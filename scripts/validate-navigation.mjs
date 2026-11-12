import { catalogCategories, catalogProducts, featuredCategorySlugs } from "../src/landing/features/catalog/data.ts";
import { routes } from "../src/landing/lib/routes.ts";

const expectedCategories = [
  "banh-trung-thu",
  "san-pham-truyen-thong",
  "san-pham-moi",
  "banh-cookie",
  "sinh-nhat-su-kien",
  "banh-hat",
  "qua-tang",
];
const implementedProductDetails = new Set([
  "banh-cookie-bo-hat-dinh-duong",
  "bo-hop-doanh-nghiep-son-mai-tri-an",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const categorySlugs = catalogCategories.map(({ slug }) => slug);
assert(new Set(categorySlugs).size === categorySlugs.length, "Category slugs must be unique");
assert(expectedCategories.every((slug) => categorySlugs.includes(slug)), "Canonical category taxonomy is incomplete");
assert(featuredCategorySlugs.length === 6, "Visible category grids must keep exactly six categories");
assert(!featuredCategorySlugs.includes("qua-tang"), "Quà tặng belongs to the domain but not the six-card featured grid");

for (const product of catalogProducts) {
  assert(categorySlugs.includes(product.categorySlug), `Unknown category for product ${product.id}`);
  if (product.pricing.mode === "fixed") assert(product.pricing.amount > 0, `Invalid fixed price for ${product.id}`);
  if (product.slug) assert(implementedProductDetails.has(product.slug), `Product card points to a missing detail route: ${product.slug}`);
}

const corporateGift = catalogProducts.find(({ id }) => id === "corporate-lacquer-gratitude-box");
assert(corporateGift?.categorySlug === "qua-tang", "Corporate gift must belong to qua-tang");
assert(routes.category("qua-tang") === "/danh-muc/qua-tang", "Category route helper is inconsistent");
assert(routes.product("sample") === "/san-pham/sample", "Product route helper is inconsistent");
assert(routes.article("sample") === "/tin-tuc/sample", "Article route helper is inconsistent");

console.log(`Navigation validation passed: ${catalogCategories.length} categories, ${catalogProducts.length} products, ${implementedProductDetails.size} product details.`);
