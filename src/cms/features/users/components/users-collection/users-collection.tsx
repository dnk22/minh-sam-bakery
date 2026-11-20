"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getUserStatusPresentation } from "../../constants";
import type { UserFilters } from "../../hooks/use-user-filters";
import type { CmsUser, UserList } from "../../types";
import { createUserColumns, type UserActionHandlers } from "../user-columns";
import { UserListItem } from "../user-list-item";
import styles from "./users-collection.module.css";

export function UsersCollection({ filters, listQuery, ...actions }: UserActionHandlers & { filters: UserFilters; listQuery: UseQueryResult<UserList, Error> }) {
  const columns = useMemo(() => createUserColumns(actions), [actions]);
  const list = listQuery.data;
  return <ResponsiveCollection<CmsUser>
    className={styles.table}
    columns={columns}
    data={list?.items ?? []}
    emptyState="Chưa có tài khoản nào."
    error={listQuery.error instanceof Error ? listQuery.error.message : undefined}
    filteredEmptyState="Không có tài khoản phù hợp."
    getItemKey={(item) => item.id}
    getItemLabel={(item) => `Xem tài khoản ${item.fullName}`}
    getRowId={(item) => item.id}
    isFiltered={filters.isFiltered}
    loading={listQuery.isLoading}
    onItemClick={actions.onDetail}
    onRetry={() => listQuery.refetch()}
    pagination={list ? { meta: list.pagination, onPageChange: filters.setPage } : undefined}
    renderAccessory={(item) => { const status = getUserStatusPresentation(item.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; }}
    renderItem={(item) => <UserListItem user={item} />}
  />;
}
