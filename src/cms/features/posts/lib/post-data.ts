import type { Post, PostList, PostListParams, PostStatus } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function nullableString(value: unknown): value is string | null | undefined { return value === undefined || value === null || typeof value === "string"; }
function dateTime(value: unknown) { return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value)); }

export function isPost(value: unknown): value is Post {
  if (!isRecord(value) || !isRecord(value.author)) return false;
  return typeof value.id === "string" && value.id.length > 0 && typeof value.title === "string" && typeof value.slug === "string" &&
    nullableString(value.thumbnailUrl) && typeof value.content === "string" && nullableString(value.excerpt) &&
    (value.status === "DRAFT" || value.status === "PUBLISHED") && typeof value.showOnLanding === "boolean" &&
    nullableString(value.publishedAt) && (value.publishedAt == null || dateTime(value.publishedAt)) &&
    nullableString(value.seoTitle) && nullableString(value.seoDescription) && typeof value.author.id === "string" &&
    typeof value.author.fullName === "string" && dateTime(value.createdAt) && dateTime(value.updatedAt);
}

export function isPostList(value: unknown): value is PostList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isPost) || !isRecord(value.pagination)) return false;
  const { page, limit, total, totalPages } = value.pagination;
  return typeof page === "number" && Number.isSafeInteger(page) && page >= 1 && typeof limit === "number" && Number.isSafeInteger(limit) && limit >= 1 &&
    typeof total === "number" && Number.isSafeInteger(total) && total >= 0 && typeof totalPages === "number" && Number.isSafeInteger(totalPages) && totalPages >= 0;
}

export function isDeletedPost(value: unknown): value is { id: string } { return isRecord(value) && typeof value.id === "string" && value.id.length > 0; }
export function validPostId(id: string) { return id.trim() === id && id.length > 0 && id.length <= 200 && !id.includes("/") && !id.includes("\\"); }
export function parsePostStatus(value: string | null): PostStatus | undefined { return value === "DRAFT" || value === "PUBLISHED" ? value : undefined; }
export function parsePostBoolean(value: string | null): boolean | undefined { return value === "true" ? true : value === "false" ? false : undefined; }
export function parsePostPage(value: string | null) { const page = Number(value ?? 1); return Number.isSafeInteger(page) && page > 0 ? page : 1; }

export function parsePostListQuery(query: URLSearchParams): { ok: true; data: PostListParams } | { ok: false } {
  const rawPage = query.get("page"); const rawLimit = query.get("limit"); const rawStatus = query.get("status"); const rawLanding = query.get("showOnLanding");
  const page = Number(rawPage ?? 1); const limit = Number(rawLimit ?? 10); const status = parsePostStatus(rawStatus); const showOnLanding = parsePostBoolean(rawLanding);
  const search = query.get("search")?.trim() || undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
    (rawStatus !== null && status === undefined) || (rawLanding !== null && showOnLanding === undefined) || (search && search.length > 200)) return { ok: false };
  return { ok: true, data: { page, limit, search, status, showOnLanding } };
}

export function countPostAdvancedFilters(filters: Pick<PostListParams, "status" | "showOnLanding">) {
  return Number(filters.status !== undefined) + Number(filters.showOnLanding !== undefined);
}
export function clearPostAdvancedFilterQuery(query: URLSearchParams) { ["status", "showOnLanding", "page"].forEach((key) => query.delete(key)); return query; }
export function postPublishRequest(id: string) { return { method: "PATCH" as const, path: `/posts/${encodeURIComponent(id)}/publish`, body: undefined }; }
export function postDeleteRequest(id: string) { return { method: "DELETE" as const, path: `/posts/${encodeURIComponent(id)}` }; }

export function backendPostFieldErrors(data: unknown) {
  if (!isRecord(data) || !Array.isArray(data.errors)) return undefined;
  const fields: Record<string, string> = {};
  for (const item of data.errors) if (isRecord(item) && typeof item.field === "string" && typeof item.message === "string") fields[item.field] = item.message;
  return Object.keys(fields).length ? fields : undefined;
}
