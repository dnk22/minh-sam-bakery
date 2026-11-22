import "server-only";

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
import type { CatalogCategory, CatalogProduct } from "./types";

export async function getCatalogCategories() {
  return (await fetchCategories())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(adaptCategory);
}

export async function getCatalogCategory(slug: string) {
  const categories = await getCatalogCategories();
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

export async function getFeaturedCatalogProducts() {
  const response = await fetchProductPage({ page: 1, limit: 4, isFeatured: true });
  return response.items.map(adaptProduct);
}

export async function resolveProductBySlug(slug: string) {
  const index = await fetchProductPage({ search: slug, page: 1, limit: 100 });
  const match = index.items.find((item) => item.slug === slug);
  if (!match) return {};
  const dto = await fetchProduct(match.categorySlug, match.slug);
  return { product: adaptProduct(dto), dto };
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
