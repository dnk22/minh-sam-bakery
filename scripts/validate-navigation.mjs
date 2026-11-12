import { catalogCategories, catalogProducts, featuredCategorySlugs } from "../src/landing/features/catalog/data.ts";
import { merchandising } from "../src/landing/features/catalog/merchandising.ts";
import { productDetails } from "../src/landing/features/product/data.ts";
import { articles } from "../src/landing/features/journal/data.ts";
import { routes } from "../src/landing/lib/routes.ts";

const expectedCategories = ["banh-trung-thu", "san-pham-truyen-thong", "san-pham-moi", "banh-cookie", "sinh-nhat-su-kien", "banh-hat", "qua-tang"];
const validQuotationProfiles = new Set(["corporate-gift", "custom-event"]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(values, label) {
  assert(new Set(values).size === values.length, `${label} must be unique`);
}

const categorySlugs = catalogCategories.map(({ slug }) => slug);
const categorySet = new Set(categorySlugs);
assertUnique(categorySlugs, "Category slugs");
assert(expectedCategories.every((slug) => categorySet.has(slug)), "Canonical category taxonomy is incomplete");
assert(featuredCategorySlugs.length === 6, "Visible category grids must keep exactly six categories");
assert(!featuredCategorySlugs.includes("qua-tang"), "Quà tặng must remain outside the six-card featured grid");

const published = catalogProducts.filter((product) => product.status === "published");
assertUnique(catalogProducts.map(({ id }) => id), "Product IDs");
assertUnique(published.map(({ slug }) => slug), "Published product slugs");

for (const product of published) {
  assert(product.slug.trim(), `Published product ${product.id} has no slug`);
  assert(categorySet.has(product.categorySlug), `Unknown primary category for ${product.id}: ${product.categorySlug}`);
  assert(product.categorySlugs.includes(product.categorySlug), `Primary category missing from memberships for ${product.id}`);
  product.categorySlugs.forEach((slug) => assert(categorySet.has(slug), `Unknown category membership ${slug} for ${product.id}`));
  if (product.pricing.mode === "fixed") {
    assert(product.pricing.variants.length > 0, `Fixed product ${product.id} has no variants`);
    assertUnique(product.pricing.variants.map(({ id }) => id), `Variant IDs for ${product.id}`);
    product.pricing.variants.forEach((variant) => assert(variant.amount > 0 && variant.currency === "VND", `Invalid variant ${variant.id} for ${product.id}`));
    assert(product.pricing.amount === product.pricing.variants[0].amount, `Catalog/default variant price mismatch for ${product.id}`);
  } else {
    assert(validQuotationProfiles.has(product.pricing.quotationProfile), `Invalid quotation profile for ${product.id}`);
    assert(!("amount" in product.pricing), `Quote product ${product.id} must not have a numeric price`);
  }
}

for (const slug of expectedCategories) {
  const count = published.filter((product) => product.categorySlugs.includes(slug)).length;
  assert(count >= 2, `Category ${slug} needs at least two published products; found ${count}`);
}

assertUnique(productDetails.map(({ catalog }) => catalog.id), "Product detail product IDs");
assert(productDetails.length === published.length, `Every published product needs one detail record: ${productDetails.length}/${published.length}`);
const productById = new Map(published.map((product) => [product.id, product]));
for (const detail of productDetails) {
  const product = productById.get(detail.catalog.id);
  assert(product, `Detail references missing product ${detail.catalog.id}`);
  assert(detail.gallery.length === 5, `Detail gallery for ${detail.catalog.id} must preserve five slots`);
  assert(detail.pricing.mode === product.pricing.mode, `Detail pricing mode mismatch for ${detail.catalog.id}`);
  const references = detail.pricing.mode === "quote" ? detail.alternatives : detail.relatedProducts;
  const referenceIds = references.map(({ productId }) => productId).filter(Boolean);
  assertUnique(referenceIds, `Recommendations for ${detail.catalog.id}`);
  referenceIds.forEach((id) => {
    assert(id !== detail.catalog.id, `Self recommendation on ${detail.catalog.id}`);
    assert(productById.has(id), `Missing recommendation ${id} on ${detail.catalog.id}`);
  });
  if (product.pricing.mode === "quote") assert(detail.presentation.quotationProfile === product.pricing.quotationProfile, `Quotation profile mismatch for ${product.id}`);
}

const merchandisingIds = [merchandising.seasonalFeaturedProductId, ...merchandising.supportingProductIds, ...merchandising.relatedFixedProductIds, ...merchandising.alternativeGiftProductIds];
merchandisingIds.forEach((id) => assert(productById.has(id), `Missing merchandising product ${id}`));
articles.forEach((article) => {
  if (article.recommendedProductId) assert(productById.has(article.recommendedProductId), `Article ${article.id} references missing product ${article.recommendedProductId}`);
});
for (const promotion of merchandising.promotions) {
  if (promotion.target.type === "product") assert(productById.has(promotion.target.productId), `Promotion ${promotion.id} references missing product`);
  if (promotion.target.type === "category") assert(categorySet.has(promotion.target.slug), `Promotion ${promotion.id} references missing category`);
}

assert(routes.category("qua-tang") === "/danh-muc/qua-tang", "Category route helper is inconsistent");
assert(routes.product("sample") === "/san-pham/sample", "Product route helper is inconsistent");
assert(routes.article("sample") === "/tin-tuc/sample", "Article route helper is inconsistent");
assert(routes.about === "/ve-minh-sam", "About route helper is inconsistent");

console.log(`Navigation validation passed: ${catalogCategories.length} categories, ${published.length} published products, ${productDetails.length} product details.`);
