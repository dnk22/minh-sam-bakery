import type { UserListParams } from "../types";

export const userQueryKeys = {
  all: ["cms", "users"] as const,
  lists: () => ["cms", "users", "list"] as const,
  list: (params: UserListParams) => ["cms", "users", "list", params] as const,
  details: () => ["cms", "users", "detail"] as const,
  detail: (id: string) => ["cms", "users", "detail", id] as const,
};
