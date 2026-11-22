import type { PaginationMetaDto } from "../../../lib/api/types.ts";

type Slugged = { slug: string };
type LookupPage<T> = { items: T[]; pagination: PaginationMetaDto };

export async function findExactSlugAcrossSearchPages<T extends Slugged>(
  slug: string,
  loadPage: (page: number) => Promise<LookupPage<T>>,
) {
  const first = await loadPage(1);
  const firstMatch = first.items.find((item) => item.slug === slug);
  if (firstMatch) return firstMatch;

  for (let page = 2; page <= first.pagination.totalPages; page += 1) {
    const result = await loadPage(page);
    const match = result.items.find((item) => item.slug === slug);
    if (match) return match;
  }
  return undefined;
}
