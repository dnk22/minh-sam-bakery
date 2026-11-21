import type { PostListParams } from "../types";
export const postQueryKeys = {
  all: ["cms", "posts"] as const,
  lists: () => ["cms", "posts", "list"] as const,
  list: (params: PostListParams) => ["cms", "posts", "list", params] as const,
  details: () => ["cms", "posts", "detail"] as const,
  detail: (id: string) => ["cms", "posts", "detail", id] as const,
};
