import type { CatalogCategory, CatalogProduct } from "./types.ts";

export function selectCrossCategorySlugs(
  categories: CatalogCategory[],
  excludedCategorySlug: string,
  maximumCategories = 2,
) {
  return categories
    .filter((category) => category.slug !== excludedCategorySlug)
    .slice(0, Math.max(0, maximumCategories))
    .map((category) => category.slug);
}

export function collectCrossCategoryProducts(
  productGroups: CatalogProduct[][],
  excludedCategorySlug: string,
  limit: number,
) {
  const seen = new Set<string>();
  const products: CatalogProduct[] = [];
  for (const product of productGroups.flat()) {
    if (product.categorySlug === excludedCategorySlug || seen.has(product.id)) continue;
    seen.add(product.id);
    products.push(product);
    if (products.length >= limit) break;
  }
  return products;
}
