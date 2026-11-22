import "server-only";

import { cache } from "react";
import type { ProductResponseDto } from "@/lib/api/types";

import { adaptCategory, adaptProduct } from "./adapters";
import {
  fetchCategories,
  fetchCategoryPage,
  fetchCategoryById,
  fetchProduct,
  fetchProductPage,
  fetchPublicFilter,
  fetchRelatedProducts,
} from "./api";
import { catalogQueryToFilterRequest, type CatalogQuery } from "./query";
import { STOREFRONT_CATEGORY_PAGE_SIZE } from "./query";
import { findExactSlugAcrossSearchPages } from "./product-lookup";
import type { CatalogCategory, CatalogProduct, StorefrontCategoryPage } from "./types";

export async function getCatalogCategories() {
  return (await fetchCategories())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(adaptCategory);
}

export async function getCatalogCategory(slug: string, knownCategories?: CatalogCategory[]) {
  const categories = knownCategories ?? await getCatalogCategories();
  const summary = findCategory(categories, slug);
  if (!summary || !summary.id) return summary;
  return adaptCategory(await fetchCategoryById(summary.id));
}

export async function getStorefrontCategories({ search, page = 1, limit = STOREFRONT_CATEGORY_PAGE_SIZE }: { search?: string; page?: number; limit?: number } = {}): Promise<StorefrontCategoryPage> {
  const response = await fetchCategoryPage({ search, page, limit });
  return {
    categories: response.items.filter((item) => item.status === "VISIBLE").map(adaptCategory),
    pagination: response.pagination,
  };
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

export const resolveProductBySlug = cache(async (slug: string) => {
  const match = await findExactSlugAcrossSearchPages(slug, async (page) => {
    const response = await fetchPublicFilter({ search: slug, page, limit: 100 });
    return { items: response.products, pagination: response.pagination };
  });
  if (!match) return {};
  const dto = await fetchProduct(match.categorySlug, match.slug);
  return { product: adaptProduct(dto), dto };
});

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
