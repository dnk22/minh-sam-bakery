"use client";

import { CmsButton } from "@/cms/components/ui/button";
import { cn } from "@/cms/lib/cn";

import styles from "./collection-pagination.module.css";
import { normalizePaginationMeta, type CmsPaginationConfig } from "./types";

export function CollectionPagination({
  pagination,
  compact = false,
  className,
}: {
  pagination: CmsPaginationConfig;
  compact?: boolean;
  className?: string;
}) {
  const meta = normalizePaginationMeta(pagination.meta);
  const canGoBack = meta.page > 1;
  const canGoForward = meta.totalPages > 0 && meta.page < meta.totalPages;
  const pageSizeOptions = pagination.pageSizeOptions ?? [10, 20, 50];

  const changePage = (page: number) => {
    if (page !== meta.page && page >= 1 && page <= Math.max(1, meta.totalPages)) {
      pagination.onPageChange(page);
    }
  };

  return (
    <nav className={cn(styles.root, compact && styles.compact, className)} aria-label="Phân trang">
      <div className={styles.summary} aria-live="polite">
        <span>{meta.total.toLocaleString("vi-VN")} mục</span>
        <span>
          Trang {meta.page}/{Math.max(1, meta.totalPages)}
        </span>
      </div>

      <div className={styles.controls}>
        {pagination.onPageSizeChange ? (
          <label className={styles.pageSize}>
            <span className={styles.pageSizeLabel}>Số mục</span>
            <select
              aria-label="Số mục mỗi trang"
              value={meta.limit}
              onChange={(event) => {
                const nextLimit = Number(event.target.value);
                if (nextLimit !== meta.limit) pagination.onPageSizeChange?.(nextLimit);
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
        ) : null}
        <CmsButton type="button" variant="outline" size="sm" disabled={!canGoBack} onClick={() => changePage(meta.page - 1)}>
          Trước
        </CmsButton>
        <CmsButton type="button" variant="outline" size="sm" disabled={!canGoForward} onClick={() => changePage(meta.page + 1)}>
          Tiếp
        </CmsButton>
      </div>
    </nav>
  );
}
