import type { PublicFilterRequest } from "./types.ts";

export const CATALOG_PAGE_SIZE = 9;
export const MAX_CATALOG_PAGE = 10_000;
export const MAX_CATALOG_SEARCH_LENGTH = 100;

export type CatalogSort = "default" | "price-asc" | "price-desc";
export type CatalogPrice = "all" | "under-200" | "200-500" | "over-500";

export type CatalogQuery = {
  q: string;
  category: string | null;
  price: CatalogPrice;
  sort: CatalogSort;
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

const validPrices = new Set<CatalogPrice>(["all", "under-200", "200-500", "over-500"]);
const validSorts = new Set<CatalogSort>(["default", "price-asc", "price-desc"]);

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function firstAllowed(values: string | string[] | undefined, allowed: Set<string>) {
  const candidates = Array.isArray(values) ? values : values ? [values] : [];
  return candidates.find((value) => allowed.has(value)) ?? null;
}

export function parseCatalogQuery(
  params: RawSearchParams,
  options: { allowedCategories?: Iterable<string>; routeCategory?: string } = {},
): CatalogQuery {
  const allowedCategories = new Set(options.allowedCategories ?? []);
  const explicitCategory = firstAllowed(params.category, allowedCategories);
  const legacyCategory = firstAllowed(params.type, allowedCategories);
  const rawPrice = first(params.price) as CatalogPrice | undefined;
  const rawSort = first(params.sort) as CatalogSort | undefined;
  const rawPage = first(params.page);
  const parsedPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const rawSearch = (first(params.q) ?? "").trim().replace(/\s+/g, " ");

  return {
    q: rawSearch.slice(0, MAX_CATALOG_SEARCH_LENGTH),
    category: options.routeCategory ?? explicitCategory ?? legacyCategory,
    price: rawPrice && validPrices.has(rawPrice) ? rawPrice : "all",
    sort: rawSort && validSorts.has(rawSort) ? rawSort : "default",
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, MAX_CATALOG_PAGE)
      : 1,
  };
}

export function catalogQueryToSearchParams(
  query: CatalogQuery,
  options: { includeCategory?: boolean } = {},
) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (options.includeCategory !== false && query.category) params.set("category", query.category);
  if (query.price !== "all") params.set("price", query.price);
  if (query.sort !== "default") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function isCatalogQueryCanonical(
  raw: RawSearchParams,
  query: CatalogQuery,
  options: { includeCategory?: boolean } = {},
) {
  const current = new URLSearchParams();
  for (const key of Object.keys(raw).sort()) {
    const values = Array.isArray(raw[key]) ? raw[key] : raw[key] === undefined ? [] : [raw[key]];
    for (const value of values) if (value !== undefined) current.append(key, value);
  }
  current.sort();
  const canonical = catalogQueryToSearchParams(query, options);
  canonical.sort();
  return current.toString() === canonical.toString();
}

/** Backend filters the regular `products.price` column with inclusive bounds. */
export function catalogPriceBounds(price: CatalogPrice): Pick<PublicFilterRequest, "minPrice" | "maxPrice"> {
  if (price === "under-200") return { maxPrice: 199_999.99 };
  if (price === "200-500") return { minPrice: 200_000, maxPrice: 500_000 };
  if (price === "over-500") return { minPrice: 500_000.01 };
  return {};
}

export function catalogSortFields(sort: CatalogSort): Pick<PublicFilterRequest, "sortBy" | "sort"> {
  if (sort === "price-asc") return { sortBy: "price", sort: "asc" };
  if (sort === "price-desc") return { sortBy: "price", sort: "desc" };
  return { sortBy: "createdAt", sort: "desc" };
}

export function catalogQueryToFilterRequest(query: CatalogQuery, categoryId?: string): PublicFilterRequest {
  return {
    ...(query.q ? { search: query.q } : {}),
    page: query.page,
    limit: CATALOG_PAGE_SIZE,
    ...(categoryId ? { categoryId } : {}),
    ...catalogPriceBounds(query.price),
    ...catalogSortFields(query.sort),
  };
}

export function updateCatalogQuery(query: CatalogQuery, patch: Partial<CatalogQuery>): CatalogQuery {
  return { ...query, ...patch, page: patch.page ?? 1 };
}

export type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

export function boundedPagination(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) items.push(previous === 1 ? "ellipsis-start" : "ellipsis-end");
    items.push(page);
  });
  return items;
}
