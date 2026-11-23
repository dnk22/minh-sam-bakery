import type { CmsTheme, ThemeList, ThemeListParams } from "../types.ts";

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const optionalText = (value: unknown) =>
  value === undefined || value === null || typeof value === "string";
const dateTime = (value: unknown) =>
  typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));

export function isTheme(value: unknown): value is CmsTheme {
  if (!record(value)) return false;
  return typeof value.id === "string" && value.id.length > 0 &&
    typeof value.name === "string" && typeof value.code === "string" &&
    optionalText(value.description) && "config" in value &&
    typeof value.isActive === "boolean" && dateTime(value.createdAt) && dateTime(value.updatedAt);
}

export function isThemeList(value: unknown): value is ThemeList {
  if (!record(value) || !Array.isArray(value.items) || !value.items.every(isTheme) || !record(value.pagination)) return false;
  const pagination = value.pagination;
  const page = pagination.page;
  const limit = pagination.limit;
  return [page, limit, pagination.total, pagination.totalPages]
    .every((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0) &&
    typeof page === "number" && page >= 1 && typeof limit === "number" && limit >= 1;
}

export function isDeletedTheme(value: unknown): value is { id: string } {
  return record(value) && typeof value.id === "string" && value.id.length > 0;
}

export function backendThemeFieldErrors(data: unknown): Record<string, string> | undefined {
  if (!record(data) || !Array.isArray(data.errors)) return undefined;
  const errors: Record<string, string> = {};
  for (const entry of data.errors) {
    if (record(entry) && typeof entry.field === "string" && typeof entry.message === "string") {
      errors[entry.field] = entry.message;
    }
  }
  return Object.keys(errors).length ? errors : undefined;
}

export function buildThemeListQuery(params: ThemeListParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
  return query.toString();
}

export function parseThemePage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseThemeActive(value: string | null): boolean | undefined {
  return value === "true" ? true : value === "false" ? false : undefined;
}
