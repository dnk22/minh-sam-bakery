"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import type { RoleFilters } from "../../hooks/use-role-filters";
import type { Role, RoleList } from "../../types";
import { createRoleColumns, type RoleActionHandlers } from "../role-columns";
import { RoleListItem } from "../role-list-item";
import styles from "./roles-collection.module.css";

export function RolesCollection({ filters, listQuery, onDetail, onDelete }: RoleActionHandlers & {
  filters: RoleFilters;
  listQuery: UseQueryResult<RoleList, Error>;
}) {
  const actions = useMemo(() => ({ onDetail, onDelete }), [onDelete, onDetail]);
  const columns = useMemo(() => createRoleColumns(actions), [actions]);
  const list = listQuery.data;
  return (
    <ResponsiveCollection<Role>
      className={styles.table}
      columns={columns}
      data={list?.items ?? []}
      emptyState="Chưa có vai trò nào."
      error={listQuery.error instanceof Error ? listQuery.error.message : undefined}
      filteredEmptyState="Không có vai trò phù hợp."
      getItemKey={(item) => item.id}
      getItemLabel={(item) => `Xem vai trò ${item.name}`}
      getRowId={(item) => item.id}
      isFiltered={filters.isFiltered}
      loading={listQuery.isLoading || (listQuery.isFetching && listQuery.isPlaceholderData)}
      onItemClick={onDetail}
      onRetry={() => listQuery.refetch()}
      pagination={list && !listQuery.isPlaceholderData ? { meta: list.pagination, onPageChange: filters.setPage } : undefined}
      renderAccessory={(item) => <CmsBadge variant={item.isSystem ? "secondary" : "default"}>{item.isSystem ? "Hệ thống" : "Tùy chỉnh"}</CmsBadge>}
      renderItem={(item) => <RoleListItem role={item} />}
    />
  );
}
