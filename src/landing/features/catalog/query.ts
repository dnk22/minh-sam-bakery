export const CATALOG_PAGE_SIZE = 9;
export const MAX_CATALOG_PAGE = 10_000;
export const MAX_CATALOG_SEARCH_LENGTH = 100;

export type CatalogQuery = {
  q: string;
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCatalogQuery(params: RawSearchParams): CatalogQuery {
  const rawPage = first(params.page);
  const parsedPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const rawSearch = (first(params.q) ?? "").trim().replace(/\s+/g, " ");

  return {
    q: rawSearch.slice(0, MAX_CATALOG_SEARCH_LENGTH),
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, MAX_CATALOG_PAGE)
      : 1,
  };
}

export function catalogQueryToSearchParams(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function isCatalogQueryCanonical(
  raw: RawSearchParams,
  query: CatalogQuery,
) {
  const current = new URLSearchParams();
  for (const key of Object.keys(raw).sort()) {
    const values = Array.isArray(raw[key]) ? raw[key] : raw[key] === undefined ? [] : [raw[key]];
    for (const value of values) if (value !== undefined) current.append(key, value);
  }
  current.sort();
  const canonical = catalogQueryToSearchParams(query);
  canonical.sort();
  return current.toString() === canonical.toString();
}

export function categoryProductsRequest(query: CatalogQuery) {
  return {
    page: query.page,
    limit: CATALOG_PAGE_SIZE,
    ...(query.q ? { search: query.q } : {}),
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
