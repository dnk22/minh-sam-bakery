"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";

import type { SystemConfigFilters } from "../../hooks/use-system-config-filters";
import type { SystemConfig, SystemConfigList } from "../../types";
import { createSystemConfigColumns, type SystemConfigActionHandlers } from "../system-config-columns/system-config-columns";
import { SystemConfigListItem } from "../system-config-list-item/system-config-list-item";
import styles from "./system-configs-collection.module.css";

export function SystemConfigsCollection({ filters, listQuery, onDetail, onDelete }: SystemConfigActionHandlers & { filters: SystemConfigFilters; listQuery: UseQueryResult<SystemConfigList, Error> }) {
  const actions = useMemo(() => ({ onDetail, onDelete }), [onDelete, onDetail]);
  const columns = useMemo(() => createSystemConfigColumns(actions), [actions]);
  const list = listQuery.data;
  return <ResponsiveCollection<SystemConfig> className={styles.table} columns={columns} data={list?.items ?? []}
    emptyState="Chưa có cấu hình hệ thống nào." error={listQuery.error instanceof Error ? listQuery.error.message : undefined}
    filteredEmptyState="Không có cấu hình phù hợp." getItemKey={(item) => item.id} getItemLabel={(item) => `Xem cấu hình ${item.key}`}
    getRowId={(item) => item.id} isFiltered={filters.isFiltered} loading={listQuery.isLoading || (listQuery.isFetching && listQuery.isPlaceholderData)} onItemClick={onDetail}
    onRetry={() => listQuery.refetch()} pagination={list && !listQuery.isPlaceholderData ? { meta: list.pagination, onPageChange: filters.setPage } : undefined}
    renderItem={(item) => <SystemConfigListItem config={item} />} />;
}
