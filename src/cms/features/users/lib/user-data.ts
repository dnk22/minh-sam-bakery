import type { CmsUser, UserList } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCmsUser(value: unknown): value is CmsUser {
  if (!isRecord(value) || !isRecord(value.role)) return false;
  return typeof value.id === "string" && value.id.length > 0 &&
    typeof value.email === "string" && typeof value.fullName === "string" &&
    (value.status === "ACTIVE" || value.status === "LOCKED") &&
    typeof value.role.id === "string" && typeof value.role.code === "string" && typeof value.role.name === "string" &&
    typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isUserList(value: unknown): value is UserList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isCmsUser) || !isRecord(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages]
    .every((item) => typeof item === "number" && Number.isFinite(item));
}

export function isDeletedUser(value: unknown): value is { id: string } {
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
