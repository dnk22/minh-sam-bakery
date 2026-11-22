import "server-only";

import { adaptCategory, adaptProduct } from "@/landing/features/catalog/adapters";
import type { CatalogCategory, CatalogPage } from "@/landing/features/catalog/types";
import type { PublicFilterRequest } from "./query";
import { fetchGlobalSearchResults } from "./api";

export type GlobalSearchResults = {
  page: CatalogPage;
  matchedCategories: CatalogCategory[];
};

export async function getGlobalSearchResults(filters: PublicFilterRequest): Promise<GlobalSearchResults> {
  const response = await fetchGlobalSearchResults(filters);
  return {
    page: {
      search: response.search ?? null,
      products: response.products.map(adaptProduct),
      pagination: response.pagination,
    },
    // Posts and suggestions are intentionally excluded from this product-only UI.
    matchedCategories: response.categories
      .filter((category) => category.status === "VISIBLE")
      .map(adaptCategory),
  };
}
