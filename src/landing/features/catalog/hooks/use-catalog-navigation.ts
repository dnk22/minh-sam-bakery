"use client";

import { useRouter } from "next/navigation";

import { catalogQueryToSearchParams, updateCatalogQuery, type CatalogQuery } from "../query";

/** URL is the authoritative state for category search and pagination. */
export function useCatalogNavigation(basePath: string, query: CatalogQuery, anchor = "") {
  const router = useRouter();

  const navigate = (next: CatalogQuery) => {
    const params = catalogQueryToSearchParams(next);
    router.push(`${basePath}${params.size ? `?${params}` : ""}${anchor}`, { scroll: false });
  };

  return {
    change: (patch: Partial<CatalogQuery>) => navigate(updateCatalogQuery(query, patch)),
    reset: () => navigate({ q: "", page: 1 }),
    retry: () => router.refresh(),
  };
}
