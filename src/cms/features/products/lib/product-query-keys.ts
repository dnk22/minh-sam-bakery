import type { ProductListParams } from "../types";

export const productQueryKeys = {
  all: ["cms", "products"] as const,
  lists: () => ["cms", "products", "list"] as const,
  list: (params: ProductListParams) => ["cms", "products", "list", params] as const,
  details: () => ["cms", "products", "detail"] as const,
  detail: (id: string) => ["cms", "products", "detail", id] as const,
};
