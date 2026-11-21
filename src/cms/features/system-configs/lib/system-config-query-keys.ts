import type { SystemConfigListParams } from "../types";

export const systemConfigQueryKeys = {
  all: ["cms", "system-configs"] as const,
  lists: () => ["cms", "system-configs", "list"] as const,
  list: (params: SystemConfigListParams) => ["cms", "system-configs", "list", params] as const,
  details: () => ["cms", "system-configs", "detail"] as const,
  detail: (id: string) => ["cms", "system-configs", "detail", id] as const,
};
