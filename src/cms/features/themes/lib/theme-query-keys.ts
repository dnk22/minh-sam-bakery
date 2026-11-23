import type { ThemeListParams } from "../types.ts";

export const themeQueryKeys = {
  all: ["cms", "themes"] as const,
  lists: () => ["cms", "themes", "list"] as const,
  list: (params: ThemeListParams) => ["cms", "themes", "list", params] as const,
  details: () => ["cms", "themes", "detail"] as const,
  detail: (id: string) => ["cms", "themes", "detail", id] as const,
};
