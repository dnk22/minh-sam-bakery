import type {
  CategoryResponseDto,
  PaginatedResponse,
  PaginationMetaDto,
  ProductResponseDto,
} from "../../../lib/api/types.ts";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nullableString = (value: unknown) => value === null || typeof value === "string";
const optionalNullableString = (value: unknown) => value === undefined || nullableString(value);

export function isPaginated<T>(value: unknown, itemGuard: (item: unknown) => item is T): value is PaginatedResponse<T> {
  return isRecord(value) && Array.isArray(value.items) && value.items.every(itemGuard) && isPagination(value.pagination);
}

export function isPagination(value: unknown): value is PaginationMetaDto {
  return isRecord(value) &&
    typeof value.page === "number" && Number.isSafeInteger(value.page) && value.page >= 1 &&
    typeof value.limit === "number" && Number.isSafeInteger(value.limit) && value.limit >= 1 && value.limit <= 100 &&
    typeof value.total === "number" && Number.isSafeInteger(value.total) && value.total >= 0 &&
    typeof value.totalPages === "number" && Number.isSafeInteger(value.totalPages) && value.totalPages >= 0;
}

export function isCategory(value: unknown): value is CategoryResponseDto {
  return isRecord(value) &&
    typeof value.id === "string" && optionalNullableString(value.parentId) &&
    typeof value.name === "string" && typeof value.slug === "string" &&
    optionalNullableString(value.description) && optionalNullableString(value.imageUrl) &&
    (value.status === "VISIBLE" || value.status === "HIDDEN") &&
    typeof value.sortOrder === "number" && optionalNullableString(value.seoTitle) &&
    optionalNullableString(value.seoDescription) && typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string";
}

export function isProduct(value: unknown): value is ProductResponseDto {
  return isRecord(value) &&
    ["id", "categoryId", "categorySlug", "categoryName", "sku", "name", "slug", "price", "createdAt", "updatedAt"].every((key) => typeof value[key] === "string") &&
    optionalNullableString(value.shortDescription) && optionalNullableString(value.description) &&
    optionalNullableString(value.salePrice) && value.status === "PUBLISHED" &&
    typeof value.isFeatured === "boolean" && typeof value.isBestSeller === "boolean" &&
    optionalNullableString(value.seoTitle) && optionalNullableString(value.seoDescription) &&
    Array.isArray(value.images) && value.images.every(isProductImage) &&
    Array.isArray(value.variants) && value.variants.every(isProductVariant);
}

function isProductImage(value: unknown) {
  return isRecord(value) && typeof value.id === "string" && typeof value.url === "string" &&
    optionalNullableString(value.alt) && typeof value.sortOrder === "number" && typeof value.isCover === "boolean";
}

function isProductVariant(value: unknown) {
  return isRecord(value) && ["id", "sku", "size", "style", "price"].every((key) => typeof value[key] === "string") &&
    optionalNullableString(value.salePrice) && (value.status === "ACTIVE" || value.status === "INACTIVE") &&
    typeof value.sortOrder === "number";
}
