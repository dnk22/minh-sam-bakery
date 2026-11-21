import type { PaginatedResponse, PaginationMetaDto, PublicPostResponseDto } from "../../../lib/api/types.ts";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nullableString = (value: unknown): value is string | null | undefined => value === undefined || value === null || typeof value === "string";
const dateTime = (value: unknown) => typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));

export function isPublicPost(value: unknown): value is PublicPostResponseDto {
  if (!isRecord(value) || !isRecord(value.author)) return false;
  return ["id", "title", "slug", "content", "createdAt", "updatedAt"].every((key) => typeof value[key] === "string")
    && nullableString(value.thumbnailUrl)
    && nullableString(value.excerpt)
    && (value.status === "DRAFT" || value.status === "PUBLISHED")
    && typeof value.showOnLanding === "boolean"
    && nullableString(value.publishedAt)
    && nullableString(value.seoTitle)
    && nullableString(value.seoDescription)
    && typeof value.author.id === "string"
    && typeof value.author.fullName === "string"
    && dateTime(value.createdAt)
    && dateTime(value.updatedAt);
}

export function isPagination(value: unknown): value is PaginationMetaDto {
  return isRecord(value)
    && ["page", "limit", "total", "totalPages"].every((key) => Number.isSafeInteger(value[key]) && Number(value[key]) >= 0)
    && Number(value.page) >= 1
    && Number(value.limit) >= 1;
}

export function isPublicPostPage(value: unknown): value is PaginatedResponse<PublicPostResponseDto> {
  return isRecord(value) && Array.isArray(value.items) && value.items.every(isPublicPost) && isPagination(value.pagination);
}
