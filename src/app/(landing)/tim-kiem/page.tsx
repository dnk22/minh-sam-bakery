import { connection } from "next/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { catalogRedirectPage, loadCatalogPageOnce } from "@/landing/features/catalog/page-policy";
import { GlobalSearchPage } from "@/landing/features/search/search-page";
import { getGlobalSearchResults } from "@/landing/features/search/repository";
import {
  isSearchQueryCanonical,
  parseSearchQuery,
  searchFilterRequest,
  searchQueryToSearchParams,
  type RawSearchParams,
  type SearchQuery,
} from "@/landing/features/search/query";
import { routes } from "@/landing/lib/routes";
import { BackendRequestError } from "@/lib/api/errors";

export const instant = false;

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm | Minh Sâm Bakery",
  description: "Khám phá và lọc các dòng bánh Minh Sâm theo tên, danh mục và khoảng giá.",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.search },
};

type SearchPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  await connection();
  const [raw, categories] = await Promise.all([searchParams, getCatalogCategories()]);
  const parsed = parseSearchQuery(raw);
  const query = parsed.category && !categories.some((category) => category.slug === parsed.category)
    ? { ...parsed, category: null }
    : parsed;

  if (!isSearchQueryCanonical(raw, query)) redirectToSearch(query);

  const results = await loadCatalogPageOnce(
    () => getGlobalSearchResults(searchFilterRequest(query, categories)),
    (error) => {
      const detail = error instanceof BackendRequestError
        ? { kind: error.kind, status: error.status ?? null, code: error.code ?? null }
        : { kind: error instanceof Error ? error.name : "unknown" };
      console.error("[search] Public filter request failed", detail);
    },
  );

  const nextPage = results ? catalogRedirectPage(query.page, results.page.pagination) : null;
  if (nextPage !== null) redirectToSearch({ ...query, page: nextPage });

  return <GlobalSearchPage categories={categories} query={query} results={results} />;
}

function redirectToSearch(query: SearchQuery): never {
  const params = searchQueryToSearchParams(query);
  redirect(routes.search + (params.size ? "?" + params.toString() : ""));
}
