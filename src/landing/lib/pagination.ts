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
