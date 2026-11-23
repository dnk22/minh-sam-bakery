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
