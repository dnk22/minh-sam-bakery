"use client";

import { useRouter } from "next/navigation";

import { routes } from "@/landing/lib/routes";

import {
  searchQueryToSearchParams,
  updateSearchQuery,
  type SearchQuery,
} from "../query";

/** Search filters live in the URL; only the mobile drawer needs local UI state. */
export function useSearchNavigation(query: SearchQuery) {
  const router = useRouter();

  const navigate = (next: SearchQuery) => {
    const params = searchQueryToSearchParams(next);
    router.push(routes.search + (params.size ? "?" + params.toString() : ""), {
      scroll: false,
    });
  };

  return {
    change: (patch: Partial<SearchQuery>) => navigate(updateSearchQuery(query, patch)),
    reset: () => navigate({ q: "", category: null, price: "all", sort: "recent", page: 1 }),
    retry: () => router.refresh(),
  };
}
