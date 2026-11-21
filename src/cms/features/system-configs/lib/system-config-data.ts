import type { SystemConfig, SystemConfigList } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSystemConfig(value: unknown): value is SystemConfig {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 &&
    typeof value.key === "string" && typeof value.value === "string" &&
    (value.description === null || typeof value.description === "string") &&
    typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isSystemConfigList(value: unknown): value is SystemConfigList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isSystemConfig) || !isRecord(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages]
    .every((item) => typeof item === "number" && Number.isFinite(item));
}

export function isDeletedSystemConfig(value: unknown): value is { id: string } {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0;
}

export function backendFieldErrors(data: unknown) {
  if (!isRecord(data) || !Array.isArray(data.errors)) return undefined;
  const fields: Record<string, string> = {};
  for (const item of data.errors) {
    if (isRecord(item) && typeof item.field === "string" && typeof item.message === "string") fields[item.field] = item.message;
  }
  return Object.keys(fields).length ? fields : undefined;
}

export function parseSystemConfigPage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function buildSystemConfigListQuery(params: { page: number; limit: number; search?: string }) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  return query.toString();
}
