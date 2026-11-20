"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { DataTable } from "@/cms/components/data-table/data-table";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsButton } from "@/cms/components/ui/button";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";

import type { CategoryFilters } from "../../hooks/use-category-filters";
import { filterCategoryForest } from "../../lib/category-tree";
import type { Category, CategoryList, CategoryTreeNode } from "../../types";
import { createCategoryColumns } from "../category-columns";
import { CategoryListItem } from "../category-list-item";
import type { CategoryActionHandlers } from "../category-row-actions";
import { CategoryStatusBadge } from "../category-status-badge";
import styles from "./categories-collection.module.css";

type CategoryTreeData = {
  tree: import("../../lib/category-tree").CategoryTreeResult | null;
  reason: string | null;
};

type CategoriesCollectionProps = CategoryActionHandlers & {
  filters: CategoryFilters;
  listQuery: UseQueryResult<CategoryList, Error>;
  treeQuery: UseQueryResult<CategoryTreeData, Error>;
};

export function CategoriesCollection({
  filters,
  listQuery,
  treeQuery,
  onDetail,
  onAddChild,
  onDelete,
}: CategoriesCollectionProps) {
  const isMobile = useCmsIsMobile();
  const parentNames = treeQuery.data?.tree?.byId;
  const actions = useMemo(
    () => ({ onDetail, onAddChild, onDelete }),
    [onAddChild, onDelete, onDetail],
  );
  const columns = useMemo(
    () => createCategoryColumns<Category>({ parentNames, ...actions }),
    [actions, parentNames],
  );
  const treeColumns = useMemo(
    () => createCategoryColumns<CategoryTreeNode>({ parentNames, ...actions }),
    [actions, parentNames],
  );
  const treeRows = useMemo(
    () =>
      treeQuery.data?.tree
        ? filterCategoryForest(
            treeQuery.data.tree.forest,
            filters.search,
            filters.status,
          )
        : [],
    [filters.search, filters.status, treeQuery.data],
  );
  const list = listQuery.data;
  const listItems = list?.items ?? [];
  const pagination = list
    ? { meta: list.pagination, onPageChange: filters.setPage }
    : undefined;
  const errorMessage =
    listQuery.error instanceof Error ? listQuery.error.message : undefined;

  if (filters.view === "tree" && !isMobile) {
    if (treeQuery.isLoading) {
      return <div className={styles.state}>Đang tải toàn bộ cấu trúc danh mục…</div>;
    }
    if (treeQuery.error || !treeQuery.data?.tree) {
      return (
        <div className={styles.treeError} role="alert">
          <p>
            {treeQuery.data?.reason ?? "Không thể xác minh dữ liệu cây đầy đủ."}
          </p>
          <CmsButton
            type="button"
            variant="outline"
            onClick={() => filters.setView("flat")}
          >
            Chuyển sang dạng phẳng
          </CmsButton>
        </div>
      );
    }
    return (
      <DataTable<CategoryTreeNode>
        className={styles.table}
        data={treeRows}
        columns={treeColumns}
        getRowId={(row) => row.id}
        getSubRows={(row) => row.children}
        onRowClick={onDetail}
        getRowLabel={(row) => `Xem danh mục ${row.name}`}
        isFiltered={filters.isFiltered}
        filteredEmptyState="Không có danh mục phù hợp trong cây."
      />
    );
  }

  return (
    <ResponsiveCollection<Category>
      data={listItems}
      columns={columns}
      getItemKey={(item) => item.id}
      getRowId={(item) => item.id}
      renderItem={(item) => (
        <CategoryListItem
          category={item}
          parentName={
            item.parentId ? parentNames?.get(item.parentId)?.name : undefined
          }
        />
      )}
      renderAccessory={(item) => (
        <CategoryStatusBadge status={item.status} />
      )}
      onItemClick={onDetail}
      getItemLabel={(item) => `Xem danh mục ${item.name}`}
      pagination={pagination}
      loading={listQuery.isLoading}
      error={errorMessage}
      onRetry={() => listQuery.refetch()}
      isFiltered={filters.isFiltered}
      className={styles.table}
      emptyState="Chưa có danh mục nào."
      filteredEmptyState="Không có danh mục phù hợp."
    />
  );
}
