import type { Category, CategoryList } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

export function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && value.id.length > 0 && optionalString(value.parentId) &&
    typeof value.name === "string" && typeof value.slug === "string" && optionalString(value.description) &&
    optionalString(value.imageUrl) && (value.status === "VISIBLE" || value.status === "HIDDEN") &&
    typeof value.sortOrder === "number" && Number.isFinite(value.sortOrder) && optionalString(value.seoTitle) &&
    optionalString(value.seoDescription) && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isCategoryList(value: unknown): value is CategoryList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isCategory) || !isRecord(value.pagination)) return false;
  const meta = value.pagination;
  return [meta.page, meta.limit, meta.total, meta.totalPages].every((item) => typeof item === "number" && Number.isFinite(item));
}

export function isDeletedCategory(value: unknown): value is { id: string } {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0;
}

export function isUploadResult(value: unknown): value is Array<{ url: string }> {
  return Array.isArray(value) && value.length > 0 && value.every((item) => isRecord(item) && typeof item.url === "string" && /^https?:\/\//i.test(item.url));
}

export function backendFieldErrors(data: unknown) {
  if (!isRecord(data) || !Array.isArray(data.errors)) return undefined;
  const fields: Record<string, string> = {};
  for (const item of data.errors) {
    if (isRecord(item) && typeof item.field === "string" && typeof item.message === "string") fields[item.field] = item.message;
  }
  return Object.keys(fields).length ? fields : undefined;
}
