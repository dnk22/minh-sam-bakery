"use client";

import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { themeConfigStatus } from "../../lib/theme-format";
import type { CmsTheme, ThemeList } from "../../types";
import type { ThemeFilters } from "../../hooks/use-theme-filters";
import { createThemeColumns, type ThemeActions } from "../theme-columns/theme-columns";
import { ThemePalette } from "../theme-palette/theme-palette";
import styles from "../theme-ui.module.css";

type Props = ThemeActions & {
  filters: ThemeFilters;
  listQuery: UseQueryResult<ThemeList, Error>;
};

export function ThemesCollection({ filters, listQuery, onDetail, onDuplicate, onDelete, onActivate }: Props) {
  const columns = useMemo(
    () => createThemeColumns({ onDetail, onDuplicate, onDelete, onActivate }),
    [onDetail, onDuplicate, onDelete, onActivate],
  );
  const data = listQuery.data;
  return (
    <ResponsiveCollection<CmsTheme>
      className={styles.table}
      data={data?.items ?? []}
      columns={columns}
      getItemKey={(item) => item.id}
      getRowId={(item) => item.id}
      getItemLabel={(item) => "Xem theme " + item.name}
      onItemClick={onDetail}
      renderItem={(item) =>
        <span className={styles.name}>
          <ThemePalette theme={item} />
          <span className={styles.nameText}><strong>{item.name}</strong><small>{item.code}</small></span>
        </span>}
      renderAccessory={(item) =>
        <span>
          <CmsBadge variant={item.isActive ? "success" : themeConfigStatus(item).valid ? "secondary" : "warning"}>
            {item.isActive ? "Đang hoạt động" : themeConfigStatus(item).valid ? "Nháp" : "Legacy / lỗi"}
          </CmsBadge>
        </span>}
      loading={listQuery.isLoading || (listQuery.isFetching && listQuery.isPlaceholderData)}
      error={listQuery.error?.message}
      onRetry={() => listQuery.refetch()}
      isFiltered={filters.isFiltered}
      emptyState="Chưa có theme. Hãy tạo một giao diện nháp đầu tiên."
      filteredEmptyState="Không tìm thấy giao diện phù hợp."
      pagination={data && !listQuery.isPlaceholderData ? { meta: data.pagination, onPageChange: filters.setPage } : undefined}
    />
  );
}
