import type { RoleListParams } from "../types";

export const roleQueryKeys = {
  all: ["cms", "roles"] as const,
  lists: () => ["cms", "roles", "list"] as const,
  list: (params: RoleListParams) => ["cms", "roles", "list", params] as const,
  details: () => ["cms", "roles", "detail"] as const,
  detail: (id: string) => ["cms", "roles", "detail", id] as const,
  permissions: (id: string) => ["cms", "roles", "permissions", id] as const,
  catalog: () => ["cms", "permissions", "catalog"] as const,
};
