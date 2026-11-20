import type { Permission, PermissionGroup, Role, RoleDetail, RoleList, RolePermissions } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

export function isPermission(value: unknown): value is Permission {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 &&
    typeof value.code === "string" && typeof value.module === "string" &&
    typeof value.action === "string" && nullableString(value.description);
}

export function isRole(value: unknown): value is Role {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 &&
    typeof value.code === "string" && typeof value.name === "string" &&
    nullableString(value.description) && typeof value.isSystem === "boolean" &&
    typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}

export function isRoleDetail(value: unknown): value is RoleDetail {
  if (!isRole(value)) return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.permissions) && record.permissions.every(isPermission);
}

export function isRoleList(value: unknown): value is RoleList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isRole) || !isRecord(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages]
    .every((item) => typeof item === "number" && Number.isFinite(item));
}

export function isPermissionCatalog(value: unknown): value is Permission[] {
  return Array.isArray(value) && value.every(isPermission);
}

export function isRolePermissions(value: unknown): value is RolePermissions {
  return isRecord(value) && Array.isArray(value.permissions) && value.permissions.every(isPermission);
}

export function isDeletedRole(value: unknown): value is { id: string } {
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

export function groupPermissions(permissions: readonly Permission[]): PermissionGroup[] {
  const groups = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const entries = groups.get(permission.module) ?? [];
    entries.push(permission);
    groups.set(permission.module, entries);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "vi"))
    .map(([module, entries]) => ({
      module,
      permissions: entries.toSorted((left, right) =>
        left.action.localeCompare(right.action, "vi") || left.code.localeCompare(right.code, "vi")),
    }));
}

export function normalizePermissionIds(ids: readonly string[]) {
  return [...new Set(ids.filter((id) => id.length > 0))].toSorted();
}

export function samePermissionIds(left: readonly string[], right: readonly string[]) {
  const normalizedLeft = normalizePermissionIds(left);
  const normalizedRight = normalizePermissionIds(right);
  return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((id, index) => id === normalizedRight[index]);
}
