"use client";

import { useListNavigation } from "@/landing/hooks/use-list-navigation";
import { useRouter } from "next/navigation";

import { catalogQueryToSearchParams, updateCatalogQuery, type CatalogQuery } from "../query";

/** URL is the authoritative state for category search and pagination. */
export function useCatalogNavigation(basePath: string, query: CatalogQuery, anchor = "") {
  const router = useRouter();
  const { pending, run } = useListNavigation();

  const navigate = (next: CatalogQuery) => {
    const params = catalogQueryToSearchParams(next);
    if (params.toString() === catalogQueryToSearchParams(query).toString()) return;
    run(() => router.push(`${basePath}${params.size ? `?${params}` : ""}${anchor}`, { scroll: false }));
  };

  return {
    pending,
    change: (patch: Partial<CatalogQuery>) => navigate(updateCatalogQuery(query, patch)),
    reset: () => navigate({ q: "", page: 1 }),
    retry: () => run(() => router.refresh()),
  };
}
