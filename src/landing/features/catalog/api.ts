import "server-only";

import { apiGet, isRecord } from "@/lib/api/client";
import type { CategoryResponseDto, PaginatedResponse, PaginationMetaDto, ProductResponseDto } from "@/lib/api/types";

const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

export async function fetchCategories() {
  const categories = await fetchAllPages<CategoryResponseDto>("/api/v1/public/categories", isCategory, "catalog-categories");
  return categories.filter((category) => category.status === "VISIBLE");
}

export async function fetchCategoryById(id: string) {
  const response = await apiGet(`/api/v1/public/categories/${encodeURIComponent(id)}`, isCategory, {
    tags: ["catalog-categories", `catalog-category-${id}`],
  });
  return response.data;
}

export async function fetchProducts(filters: { search?: string; categorySlug?: string; isFeatured?: boolean; isBestSeller?: boolean } = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  if (filters.categorySlug) query.set("categorySlug", filters.categorySlug);
  if (filters.isFeatured !== undefined) query.set("isFeatured", String(filters.isFeatured));
  if (filters.isBestSeller !== undefined) query.set("isBestSeller", String(filters.isBestSeller));
  return fetchAllPages<ProductResponseDto>(`/api/v1/public/products${query.size ? `?${query}` : ""}`, isProduct, "catalog-products");
}

export async function fetchProduct(categorySlug: string, productSlug: string) {
  const response = await apiGet(
    `/api/v1/public/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}`,
    isProduct,
    { tags: ["catalog-products", `catalog-product-${productSlug}`] },
  );
  return response.data;
}

export async function fetchRelatedProducts(categorySlug: string, productSlug: string) {
  const response = await apiGet(
    `/api/v1/public/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}/related?limit=4`,
    (value): value is PaginatedResponse<ProductResponseDto> => isPaginated(value, isProduct),
    { tags: ["catalog-products", `catalog-related-${productSlug}`] },
  );
  return response.data.items;
}

async function fetchAllPages<T>(path: string, itemGuard: (value: unknown) => value is T, tag: string) {
  const separator = path.includes("?") ? "&" : "?";
  const first = await apiGet(
    `${path}${separator}page=1&limit=${PAGE_LIMIT}`,
    (value): value is PaginatedResponse<T> => isPaginated(value, itemGuard),
    { tags: [tag] },
  );
  if (first.data.pagination.totalPages > MAX_PAGES) {
    throw new Error(`Catalog exceeds the safe aggregation limit of ${MAX_PAGES * PAGE_LIMIT} records`);
  }
  if (first.data.pagination.totalPages <= 1) {
    if (first.data.items.length !== first.data.pagination.total) throw new Error("Backend pagination item count is inconsistent");
    return first.data.items;
  }
  const pages = await Promise.all(
    Array.from({ length: first.data.pagination.totalPages - 1 }, (_, index) => index + 2).map((page) =>
      apiGet(
        `${path}${separator}page=${page}&limit=${PAGE_LIMIT}`,
        (value): value is PaginatedResponse<T> => isPaginated(value, itemGuard),
        { tags: [tag] },
      ),
    ),
  );
  pages.forEach((response, index) => {
    const pagination = response.data.pagination;
    if (pagination.page !== index + 2 || pagination.total !== first.data.pagination.total || pagination.totalPages !== first.data.pagination.totalPages) {
      throw new Error("Backend pagination changed or is inconsistent while aggregating the catalog");
    }
  });
  const items = [first, ...pages].flatMap((response) => response.data.items);
  if (items.length !== first.data.pagination.total) {
    throw new Error(`Backend pagination returned ${items.length} items but declared ${first.data.pagination.total}`);
  }
  return items;
}

function isPaginated<T>(value: unknown, itemGuard: (item: unknown) => item is T): value is PaginatedResponse<T> {
  return isRecord(value) && Array.isArray(value.items) && value.items.every(itemGuard) && isPagination(value.pagination);
}

function isPagination(value: unknown): value is PaginationMetaDto {
  return isRecord(value) && ["page", "limit", "total", "totalPages"].every((key) => typeof value[key] === "number");
}

function isCategory(value: unknown): value is CategoryResponseDto {
  return isRecord(value) &&
    typeof value.id === "string" && nullableString(value.parentId) && typeof value.name === "string" && typeof value.slug === "string" &&
    nullableString(value.description) && nullableString(value.imageUrl) && (value.status === "VISIBLE" || value.status === "HIDDEN") && typeof value.sortOrder === "number" &&
    nullableString(value.seoTitle) && nullableString(value.seoDescription) && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

function isProduct(value: unknown): value is ProductResponseDto {
  return isRecord(value) &&
    ["id", "categoryId", "categorySlug", "categoryName", "sku", "name", "slug", "price", "createdAt", "updatedAt"].every((key) => typeof value[key] === "string") &&
    nullableString(value.shortDescription) && nullableString(value.description) && nullableString(value.salePrice) && value.status === "PUBLISHED" &&
    typeof value.isFeatured === "boolean" && typeof value.isBestSeller === "boolean" && nullableString(value.seoTitle) && nullableString(value.seoDescription) &&
    Array.isArray(value.images) && value.images.every(isProductImage) && Array.isArray(value.variants) && value.variants.every(isProductVariant);
}

function isProductImage(value: unknown) {
  return isRecord(value) && typeof value.id === "string" && typeof value.url === "string" && nullableString(value.alt) && typeof value.sortOrder === "number" && typeof value.isCover === "boolean";
}

function isProductVariant(value: unknown) {
  return isRecord(value) && ["id", "sku", "size", "style", "price"].every((key) => typeof value[key] === "string") && nullableString(value.salePrice) && (value.status === "ACTIVE" || value.status === "INACTIVE") && typeof value.sortOrder === "number";
}

function nullableString(value: unknown) {
  return value === null || typeof value === "string";
}
