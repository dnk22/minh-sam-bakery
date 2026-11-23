export const SEARCH_PAGE_SIZE = 9;
export const SEARCH_MAX_PAGE = 10_000;
export const SEARCH_MAX_LENGTH = 100;

export type SearchPrice = "all" | "under-200" | "200-500" | "over-500";
export type SearchSort = "recent" | "price-asc" | "price-desc";

export type SearchQuery = {
  q: string;
  category: string | null;
  price: SearchPrice;
  sort: SearchSort;
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type PublicFilterRequest = {
  search?: string;
  page: number;
  limit: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "createdAt" | "price";
  sort: "asc" | "desc";
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSearchQuery(params: RawSearchParams): SearchQuery {
  const rawPage = first(params.page);
  const parsedPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const q = (first(params.q) ?? "").trim().replace(/\s+/g, " ").slice(0, SEARCH_MAX_LENGTH);
  const category = (first(params.category) ?? "").trim().slice(0, SEARCH_MAX_LENGTH);
  const price = first(params.price);
  const sort = first(params.sort);

  return {
    q,
    category: category || null,
    price: price === "under-200" || price === "200-500" || price === "over-500" ? price : "all",
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "recent",
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, SEARCH_MAX_PAGE)
      : 1,
  };
}

export function searchQueryToSearchParams(query: SearchQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.price !== "all") params.set("price", query.price);
  if (query.sort !== "recent") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function isSearchQueryCanonical(raw: RawSearchParams, query: SearchQuery) {
  const current = new URLSearchParams();
  for (const key of Object.keys(raw).sort()) {
    const value = raw[key];
    const values = Array.isArray(value) ? value : value === undefined ? [] : [value];
    for (const part of values) current.append(key, part);
  }
  current.sort();
  const expected = searchQueryToSearchParams(query);
  expected.sort();
  return current.toString() === expected.toString();
}

export function updateSearchQuery(query: SearchQuery, patch: Partial<SearchQuery>): SearchQuery {
  return { ...query, ...patch, page: patch.page ?? 1 };
}

export function searchFilterRequest(
  query: SearchQuery,
  categories: ReadonlyArray<{ slug: string; id?: string }>,
): PublicFilterRequest {
  const activeCategory = categories.find((category) => category.slug === query.category);
  const priceRange = query.price === "under-200"
    ? { maxPrice: 199999.99 }
    : query.price === "200-500"
      ? { minPrice: 200000, maxPrice: 500000 }
      : query.price === "over-500"
        ? { minPrice: 500000.01 }
        : {};

  return {
    ...(query.q ? { search: query.q } : {}),
    page: query.page,
    limit: SEARCH_PAGE_SIZE,
    ...(activeCategory?.id ? { categoryId: activeCategory.id } : {}),
    ...priceRange,
    sortBy: query.sort === "recent" ? "createdAt" : "price",
    sort: query.sort === "price-asc" ? "asc" : "desc",
  };
}
