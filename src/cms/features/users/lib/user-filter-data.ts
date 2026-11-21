import type { UserStatus } from "../types";

export function parseUserPage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseUserStatus(value: string | null): UserStatus | undefined {
  return value === "ACTIVE" || value === "LOCKED" ? value : undefined;
}

export function countUserAdvancedFilters(status?: UserStatus, roleId?: string) {
  return Number(status !== undefined) + Number(Boolean(roleId));
}

export function clearUserAdvancedFilterQuery(query: URLSearchParams) {
  ["status", "roleId", "page"].forEach((key) => query.delete(key));
  return query;
}
