import type { CategoryResponseDto, PaginationMetaDto, ProductResponseDto } from "../../../lib/api/types.ts";
import { isCategory, isPaginated, isProduct } from "../catalog/response-data.ts";

export type PublicFilterResponse = {
  search?: string | null;
  products: ProductResponseDto[];
  pagination: PaginationMetaDto;
  categories: CategoryResponseDto[];
  posts: unknown[];
  suggestions: unknown[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPublicFilterResponse(value: unknown): value is PublicFilterResponse {
  return isRecord(value)
    && Array.isArray(value.products)
    && isPaginated({ items: value.products, pagination: value.pagination }, isProduct)
    && Array.isArray(value.categories)
    && value.categories.every(isCategory)
    && Array.isArray(value.posts)
    && Array.isArray(value.suggestions)
    && (value.search === undefined || value.search === null || typeof value.search === "string");
}
