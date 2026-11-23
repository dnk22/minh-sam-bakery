import type { CatalogProduct } from "../types.ts";

export function normalizeCrossCategoryProducts(
  candidates: CatalogProduct[],
  excludedCategorySlug: string,
  limit = 4,
) {
  const seen = new Set<string>();
  const products: CatalogProduct[] = [];
  for (const product of candidates) {
    if (product.categorySlug === excludedCategorySlug || seen.has(product.id)) continue;
    seen.add(product.id);
    products.push(product);
    if (products.length >= limit) break;
  }
  return products;
}
