import "server-only";

import { cache } from "react";
import type { ProductResponseDto } from "@/lib/api/types";

import { adaptCategory, adaptProduct } from "./adapters";
import {
  fetchCategories,
  fetchCategoryById,
  fetchProduct,
  fetchProductPage,
  fetchPublicFilter,
  fetchRelatedProducts,
} from "./api";
import { catalogQueryToFilterRequest, type CatalogQuery } from "./query";
import { collectCrossCategoryProducts, selectCrossCategorySlugs } from "./cross-category";
import type { CatalogCategory, CatalogProduct } from "./types";

export async function getCatalogCategories() {
  return (await fetchCategories())
    .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug, "vi"))
    .map(adaptCategory);
}

export async function getCatalogCategory(slug: string, knownCategories?: CatalogCategory[]) {
  const categories = knownCategories ?? await getCatalogCategories();
  const summary = findCategory(categories, slug);
  if (!summary || !summary.id) return summary;
  return adaptCategory(await fetchCategoryById(summary.id));
}

export async function getCatalogPage(query: CatalogQuery, categoryId?: string) {
  const response = await fetchPublicFilter(catalogQueryToFilterRequest(query, categoryId));
  return {
    search: response.search ?? null,
    products: response.products.map(adaptProduct),
    pagination: response.pagination,
  };
}

export const getCatalogProduct = cache(async (categorySlug: string, productSlug: string) =>
  fetchProduct(categorySlug, productSlug),
);

export async function getCrossCategoryProducts({
  excludedCategorySlug,
  limit = 4,
  categories,
}: {
  excludedCategorySlug: string;
  limit?: number;
  categories?: CatalogCategory[];
}) {
  const availableCategories = categories ?? await getCatalogCategories();
  const categorySlugs = selectCrossCategorySlugs(availableCategories, excludedCategorySlug);
  if (categorySlugs.length === 0 || limit <= 0) return [];
  const perCategoryLimit = Math.ceil(limit / categorySlugs.length);
  const groups = await Promise.all(
    categorySlugs.map(async (categorySlug) => {
      const response = await fetchProductPage({ categorySlug, page: 1, limit: perCategoryLimit }).catch(() => null);
      return response ? response.items.map(adaptProduct) : [];
    }),
  );
  return collectCrossCategoryProducts(groups, excludedCategorySlug, limit);
}

export async function getRelatedCatalogProducts(dto: ProductResponseDto) {
  return (await fetchRelatedProducts(dto.categorySlug, dto.slug)).map(
    adaptProduct,
  );
}

export function findCategory(categories: CatalogCategory[], slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function findProduct(products: CatalogProduct[], slug: string) {
  return products.find((product) => product.slug === slug);
}
