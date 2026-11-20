import type { Product, ProductImage, ProductList, ProductListParams, ProductStatus, ProductVariant } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

export function isProductImage(value: unknown): value is ProductImage {
  return isRecord(value) && typeof value.id === "string" && typeof value.url === "string" && optionalString(value.alt) &&
    typeof value.sortOrder === "number" && Number.isFinite(value.sortOrder) && typeof value.isCover === "boolean";
}

export function isProductVariant(value: unknown): value is ProductVariant {
  return isRecord(value) && typeof value.id === "string" && typeof value.sku === "string" && typeof value.size === "string" &&
    typeof value.style === "string" && typeof value.price === "string" && optionalString(value.salePrice) &&
    (value.status === "ACTIVE" || value.status === "INACTIVE") && typeof value.sortOrder === "number" && Number.isFinite(value.sortOrder);
}

export function isProduct(value: unknown): value is Product {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 && typeof value.categoryId === "string" &&
    typeof value.categorySlug === "string" && typeof value.categoryName === "string" && typeof value.sku === "string" &&
    typeof value.name === "string" && typeof value.slug === "string" && optionalString(value.shortDescription) &&
    optionalString(value.description) && typeof value.price === "string" && optionalString(value.salePrice) &&
    (value.status === "DRAFT" || value.status === "PUBLISHED" || value.status === "HIDDEN") &&
    typeof value.isFeatured === "boolean" && typeof value.isBestSeller === "boolean" && optionalString(value.seoTitle) &&
    optionalString(value.seoDescription) && Array.isArray(value.images) && value.images.every(isProductImage) &&
    Array.isArray(value.variants) && value.variants.every(isProductVariant) && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isProductList(value: unknown): value is ProductList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isProduct) || !isRecord(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages]
    .every((item) => typeof item === "number" && Number.isFinite(item));
}

export function parseProductStatus(value: string | null): ProductStatus | undefined {
  return value === "DRAFT" || value === "PUBLISHED" || value === "HIDDEN" ? value : undefined;
}

export function parseOptionalBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function parseProductPage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseProductListQuery(query: URLSearchParams): { ok: true; data: ProductListParams } | { ok: false } {
  const rawPage = query.get("page");
  const rawLimit = query.get("limit");
  const rawStatus = query.get("status");
  const rawFeatured = query.get("isFeatured");
  const rawBestSeller = query.get("isBestSeller");
  const page = Number(rawPage ?? 1);
  const limit = Number(rawLimit ?? 20);
  const status = parseProductStatus(rawStatus);
  const isFeatured = parseOptionalBoolean(rawFeatured);
  const isBestSeller = parseOptionalBoolean(rawBestSeller);
  const search = query.get("search")?.trim() || undefined;
  const categoryId = query.get("categoryId")?.trim() || undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
    (rawStatus && !status) || (rawFeatured && isFeatured === undefined) || (rawBestSeller && isBestSeller === undefined) ||
    (search && search.length > 200) || (categoryId && categoryId.length > 200)) return { ok: false };
  return { ok: true, data: { page, limit, search, status, categoryId, isFeatured, isBestSeller } };
}
