export type CmsPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CmsPaginationConfig = {
  meta: CmsPaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  pageSizeOptions?: readonly number[];
};

export function backendPageToPageIndex(page: number) {
  return Math.max(0, Math.trunc(page) - 1);
}

export function pageIndexToBackendPage(pageIndex: number) {
  return Math.max(0, Math.trunc(pageIndex)) + 1;
}

export function normalizePaginationMeta(meta: CmsPaginationMeta): CmsPaginationMeta {
  const total = Math.max(0, Math.trunc(meta.total));
  const limit = Math.max(1, Math.trunc(meta.limit));
  const totalPages = Math.max(0, Math.trunc(meta.totalPages));
  const lastPage = Math.max(1, totalPages);

  return {
    page: Math.min(Math.max(1, Math.trunc(meta.page)), lastPage),
    limit,
    total,
    totalPages,
  };
}
