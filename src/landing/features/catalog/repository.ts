import "server-only";

import { cache } from "react";
import type { ProductResponseDto } from "@/lib/api/types";

import { adaptCategory, adaptProduct } from "./adapters";
import {
  fetchCategories,
  fetchCategoryProducts,
  fetchProduct,
  fetchRelatedProducts,
  fetchRelatedOtherCategoryProducts,
} from "./api";
import { categoryProductsRequest, type CatalogQuery } from "./query";
import { normalizeCrossCategoryProducts } from "./cross-category";
import type { CatalogCategory, CatalogProduct } from "./types";

export const getCatalogCategories = cache(async () => {
  return (await fetchCategories())
    .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug, "vi"))
    .map(adaptCategory);
});

export async function getCatalogCategory(slug: string, knownCategories?: CatalogCategory[]) {
  const categories = knownCategories ?? await getCatalogCategories();
  return findCategory(categories, slug);
}

export async function getCatalogPage(categorySlug: string, query: CatalogQuery) {
  const response = await fetchCategoryProducts(categorySlug, categoryProductsRequest(query));
  return {
    search: query.q || null,
    products: response.items.map(adaptProduct),
    pagination: response.pagination,
  };
}

export const getCatalogProduct = cache(async (categorySlug: string, productSlug: string) =>
  fetchProduct(categorySlug, productSlug),
);

export async function getCrossCategoryProducts(categorySlug: string, limit = 4) {
  if (limit <= 0) return [];
  const response = await fetchRelatedOtherCategoryProducts(categorySlug);
  return normalizeCrossCategoryProducts(
    response.items.map(adaptProduct),
    categorySlug,
    Math.min(limit, 4),
  );
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
