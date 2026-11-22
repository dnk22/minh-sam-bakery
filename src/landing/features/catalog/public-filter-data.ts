import type {
  CategoryResponseDto,
  PaginatedResponse,
  PaginationMetaDto,
  ProductResponseDto,
  PublicPostResponseDto,
} from "../../../lib/api/types.ts";
import type {
  PublicFilterRequest,
  PublicFilterResponseDto,
  PublicFilterSuggestionDto,
} from "./types.ts";

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
    typeof value.id === "string" && nullableString(value.parentId) &&
    typeof value.name === "string" && typeof value.slug === "string" &&
    nullableString(value.description) && nullableString(value.imageUrl) &&
    (value.status === "VISIBLE" || value.status === "HIDDEN") &&
    typeof value.sortOrder === "number" && nullableString(value.seoTitle) &&
    nullableString(value.seoDescription) && typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string";
}

export function isProduct(value: unknown): value is ProductResponseDto {
  return isRecord(value) &&
    ["id", "categoryId", "categorySlug", "categoryName", "sku", "name", "slug", "price", "createdAt", "updatedAt"].every((key) => typeof value[key] === "string") &&
    nullableString(value.shortDescription) && nullableString(value.description) &&
    nullableString(value.salePrice) && value.status === "PUBLISHED" &&
    typeof value.isFeatured === "boolean" && typeof value.isBestSeller === "boolean" &&
    nullableString(value.seoTitle) && nullableString(value.seoDescription) &&
    Array.isArray(value.images) && value.images.every(isProductImage) &&
    Array.isArray(value.variants) && value.variants.every(isProductVariant);
}

function isProductImage(value: unknown) {
  return isRecord(value) && typeof value.id === "string" && typeof value.url === "string" &&
    nullableString(value.alt) && typeof value.sortOrder === "number" && typeof value.isCover === "boolean";
}

function isProductVariant(value: unknown) {
  return isRecord(value) && ["id", "sku", "size", "style", "price"].every((key) => typeof value[key] === "string") &&
    nullableString(value.salePrice) && (value.status === "ACTIVE" || value.status === "INACTIVE") &&
    typeof value.sortOrder === "number";
}

function isPostAuthor(value: unknown) {
  return isRecord(value) && typeof value.id === "string" && typeof value.fullName === "string";
}

function isPublicPost(value: unknown): value is PublicPostResponseDto {
  return isRecord(value) && typeof value.id === "string" && typeof value.title === "string" &&
    typeof value.slug === "string" && typeof value.content === "string" &&
    optionalNullableString(value.thumbnailUrl) && optionalNullableString(value.excerpt) &&
    (value.status === "DRAFT" || value.status === "PUBLISHED") &&
    typeof value.showOnLanding === "boolean" && optionalNullableString(value.publishedAt) &&
    optionalNullableString(value.seoTitle) && optionalNullableString(value.seoDescription) &&
    isPostAuthor(value.author) && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

function isSuggestion(value: unknown): value is PublicFilterSuggestionDto {
  return isRecord(value) && typeof value.type === "string" && typeof value.id === "string" &&
    typeof value.label === "string" && optionalNullableString(value.slug);
}

export function isPublicFilterResponse(value: unknown): value is PublicFilterResponseDto {
  return isRecord(value) && optionalNullableString(value.search) &&
    Array.isArray(value.products) && value.products.every(isProduct) &&
    isPagination(value.pagination) && value.products.length <= value.pagination.limit &&
    Array.isArray(value.categories) && value.categories.every(isCategory) &&
    Array.isArray(value.posts) && value.posts.every(isPublicPost) &&
    Array.isArray(value.suggestions) && value.suggestions.every(isSuggestion);
}

export function normalizePublicFilterRequest(input: PublicFilterRequest): PublicFilterRequest {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as PublicFilterRequest;
}
