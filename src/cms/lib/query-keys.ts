export type CmsQueryScope = readonly ["cms", ...ReadonlyArray<string | number>];

export const cmsQueryKeys = {
  all: ["cms"] as const,
  resource: (resource: string) => ["cms", resource] as const,
  list: (resource: string, params: Readonly<Record<string, unknown>>) =>
    ["cms", resource, "list", params] as const,
  detail: (resource: string, id: string | number) => ["cms", resource, "detail", id] as const,
};
