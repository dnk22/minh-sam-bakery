import type { PaginationMetaDto } from "../../../lib/api/types.ts";

export function catalogRedirectPage(
  requestedPage: number,
  pagination: PaginationMetaDto,
) {
  if (pagination.totalPages === 0) return requestedPage === 1 ? null : 1;
  const backendPage = Math.min(
    Math.max(pagination.page, 1),
    pagination.totalPages,
  );
  return backendPage === requestedPage ? null : backendPage;
}

export async function loadCatalogPageOnce<T>(
  load: () => Promise<T>,
  onError: (error: unknown) => void,
) {
  try {
    return await load();
  } catch (error) {
    onError(error);
    return null;
  }
}
