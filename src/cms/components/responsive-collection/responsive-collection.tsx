"use client";

import type { ColumnDef, ExpandedState, OnChangeFn, Row } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { DataList } from "@/cms/components/data-list/data-list";
import { DataTable } from "@/cms/components/data-table/data-table";
import type { CmsPaginationConfig } from "@/cms/components/pagination/types";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";

export type ResponsiveCollectionProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getItemKey: (item: TData, index: number) => string;
  getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  renderItem: (item: TData, index: number) => ReactNode;
  renderAccessory?: (item: TData, index: number) => ReactNode;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  pagination?: CmsPaginationConfig;
  loading?: boolean;
  error?: ReactNode;
  emptyState?: ReactNode;
  filteredEmptyState?: ReactNode;
  isFiltered?: boolean;
  onRetry?: () => void;
  onItemClick?: (item: TData) => void;
  getItemLabel?: (item: TData) => string;
  className?: string;
};

export function ResponsiveCollection<TData>(props: ResponsiveCollectionProps<TData>) {
  const isMobile = useCmsIsMobile();
  const common = {
    data: props.data,
    pagination: props.pagination,
    loading: props.loading,
    error: props.error,
    emptyState: props.emptyState,
    filteredEmptyState: props.filteredEmptyState,
    isFiltered: props.isFiltered,
    onRetry: props.onRetry,
    className: props.className,
  };

  // The server snapshot is desktop. This keeps SSR and hydration identical; after
  // hydration a mobile viewport swaps to the list, with only one view mounted.
  if (isMobile) {
    return (
      <DataList
        {...common}
        getItemKey={props.getItemKey}
        renderItem={props.renderItem}
        renderAccessory={props.renderAccessory}
        onItemClick={props.onItemClick}
        getItemLabel={props.getItemLabel}
      />
    );
  }

  return (
    <DataTable
      {...common}
      columns={props.columns}
      getRowId={props.getRowId}
      getSubRows={props.getSubRows}
      expanded={props.expanded}
      onExpandedChange={props.onExpandedChange}
      onRowClick={props.onItemClick}
      getRowLabel={props.getItemLabel}
    />
  );
}
