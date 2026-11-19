"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type OnChangeFn,
  type Row,
} from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";

import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { CollectionPagination } from "@/cms/components/pagination/collection-pagination";
import { backendPageToPageIndex, type CmsPaginationConfig } from "@/cms/components/pagination/types";
import { cn } from "@/cms/lib/cn";

import styles from "./data-table.module.css";

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => string;
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
  onRowClick?: (row: TData) => void;
  getRowLabel?: (row: TData) => string;
  className?: string;
};

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  getSubRows,
  expanded,
  onExpandedChange,
  pagination,
  loading = false,
  error,
  emptyState,
  filteredEmptyState,
  isFiltered = false,
  onRetry,
  onRowClick,
  getRowLabel,
  className,
}: DataTableProps<TData>) {
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const resolvedExpanded = expanded ?? internalExpanded;
  const changeExpanded = onExpandedChange ?? setInternalExpanded;

  const resolvedColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!getSubRows) return columns;
    const expansionColumn: ColumnDef<TData, unknown> = {
      id: "__cms_expansion",
      header: () => <span className={styles.srOnly}>Mở rộng</span>,
      size: 48,
      cell: ({ row }) => row.getCanExpand() ? (
        <button
          type="button"
          className={styles.expandButton}
          aria-label={row.getIsExpanded() ? "Thu gọn hàng" : "Mở rộng hàng"}
          aria-expanded={row.getIsExpanded()}
          onClick={(event) => {
            event.stopPropagation();
            row.toggleExpanded();
          }}
        >
          {row.getIsExpanded() ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </button>
      ) : null,
    };
    return [expansionColumn, ...columns];
  }, [columns, getSubRows]);

  // TanStack Table exposes mutable table methods by design; consumers receive
  // rendered rows rather than the table instance, so compiler memoization is unnecessary here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getSubRows ? getExpandedRowModel() : undefined,
    getRowId,
    getSubRows,
    onExpandedChange: changeExpanded,
    state: {
      expanded: resolvedExpanded,
      ...(pagination ? {
        pagination: {
          pageIndex: backendPageToPageIndex(pagination.meta.page),
          pageSize: pagination.meta.limit,
        },
      } : {}),
    },
    manualPagination: Boolean(pagination),
    pageCount: pagination?.meta.totalPages,
    rowCount: pagination?.meta.total,
  });

  const activateRow = (event: KeyboardEvent<HTMLTableRowElement>, row: TData) => {
    if (!onRowClick || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onRowClick(row);
  };

  const stateKind = error ? "error" : loading ? "loading" : data.length === 0 ? (isFiltered ? "filtered-empty" : "empty") : null;
  const stateContent = error || (stateKind === "filtered-empty" ? filteredEmptyState : stateKind === "empty" ? emptyState : undefined);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col" style={header.getSize() !== 150 ? { width: header.getSize() } : undefined}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {stateKind ? (
              <tr><td colSpan={resolvedColumns.length}><CollectionState kind={stateKind} onRetry={onRetry}>{stateContent}</CollectionState></td></tr>
            ) : table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={onRowClick ? styles.clickableRow : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={getRowLabel?.(row.original)}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                onKeyDown={(event) => activateRow(event, row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={cell.column.id === "__cms_expansion" ? { paddingInlineStart: `${0.75 + row.depth * 1.25}rem` } : undefined}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination ? <CollectionPagination pagination={pagination} /> : null}
    </div>
  );
}
