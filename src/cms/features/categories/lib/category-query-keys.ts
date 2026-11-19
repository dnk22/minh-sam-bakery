import type { CategoryListParams } from "../types";

export const categoryQueryKeys = {
  all: ["cms", "categories"] as const,
  lists: () => ["cms", "categories", "list"] as const,
  list: (params: CategoryListParams) => ["cms", "categories", "list", params] as const,
  details: () => ["cms", "categories", "detail"] as const,
  detail: (id: string) => ["cms", "categories", "detail", id] as const,
  tree: () => ["cms", "categories", "tree"] as const,
};
