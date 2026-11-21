import type { JournalArticle, JournalListQuery } from "./types.ts";

export const JOURNAL_PAGE_LIMIT = 9;
const MAX_PAGE = 10_000;
const MAX_SEARCH_LENGTH = 100;

type SearchValue = string | string[] | undefined;

function first(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseJournalSearchParams(params: Record<string, SearchValue>): JournalListQuery {
  const rawPage = first(params.page);
  const numericPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const search = (first(params.search) ?? "").trim().slice(0, MAX_SEARCH_LENGTH);
  return {
    page: Number.isSafeInteger(numericPage) ? Math.min(Math.max(numericPage, 1), MAX_PAGE) : 1,
    limit: JOURNAL_PAGE_LIMIT,
    ...(search ? { search } : {}),
    sortCreated: "desc",
    landing: false,
  };
}

export function buildPublicPostsPath(query: JournalListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sortCreated: query.sortCreated,
    landing: String(query.landing),
  });
  if (query.search) params.set("search", query.search);
  return `/api/v1/public/posts?${params}`;
}

export function buildRelatedPostsPath(slug: string, page = 1, limit = 3) {
  const params = new URLSearchParams({ page: String(Math.max(1, page)), limit: String(Math.min(10, Math.max(1, limit))) });
  return `/api/v1/public/posts/${encodeURIComponent(slug)}/related?${params}`;
}

export function buildJournalPageHref(page: number, search?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (search) params.set("search", search);
  return `/tin-tuc${params.size ? `?${params}` : ""}`;
}

export function selectFeaturedArticles(items: JournalArticle[], limit = 4) {
  return items.slice(0, Math.max(0, limit));
}

export function isSafeJournalSlug(slug: string) {
  return slug.length > 0 && slug.length <= 500 && !/[\\/\0]/.test(slug);
}

export function isJournalNotFoundStatus(status?: number) {
  return status === 404;
}
