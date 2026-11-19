"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { CollectionState } from "@/cms/components/collection-state/collection-state";
import { CollectionPagination } from "@/cms/components/pagination/collection-pagination";
import type { CmsPaginationConfig } from "@/cms/components/pagination/types";
import { cn } from "@/cms/lib/cn";

import styles from "./data-list.module.css";

export type DataListProps<TData> = {
  data: TData[];
  getItemKey: (item: TData, index: number) => string;
  renderItem: (item: TData, index: number) => ReactNode;
  renderAccessory?: (item: TData, index: number) => ReactNode;
  onItemClick?: (item: TData) => void;
  getItemLabel?: (item: TData) => string;
  pagination?: CmsPaginationConfig;
  loading?: boolean;
  error?: ReactNode;
  emptyState?: ReactNode;
  filteredEmptyState?: ReactNode;
  isFiltered?: boolean;
  onRetry?: () => void;
  className?: string;
};

export function DataList<TData>({
  data,
  getItemKey,
  renderItem,
  renderAccessory,
  onItemClick,
  getItemLabel,
  pagination,
  loading = false,
  error,
  emptyState,
  filteredEmptyState,
  isFiltered = false,
  onRetry,
  className,
}: DataListProps<TData>) {
  const activateItem = (event: KeyboardEvent<HTMLLIElement>, item: TData) => {
    if (!onItemClick || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onItemClick(item);
  };
  const stateKind = error ? "error" : loading ? "loading" : data.length === 0 ? (isFiltered ? "filtered-empty" : "empty") : null;
  const stateContent = error || (stateKind === "filtered-empty" ? filteredEmptyState : stateKind === "empty" ? emptyState : undefined);

  return (
    <div className={cn(styles.root, className)}>
      {stateKind ? <CollectionState kind={stateKind} onRetry={onRetry}>{stateContent}</CollectionState> : (
        <ul className={styles.list}>
          {data.map((item, index) => (
            <li
              key={getItemKey(item, index)}
              className={cn(styles.item, onItemClick && styles.clickable)}
              tabIndex={onItemClick ? 0 : undefined}
              aria-label={getItemLabel?.(item)}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              onKeyDown={(event) => activateItem(event, item)}
            >
              <div className={styles.content}>{renderItem(item, index)}</div>
              {renderAccessory ? <div className={styles.accessory}>{renderAccessory(item, index)}</div> : null}
            </li>
          ))}
        </ul>
      )}
      {pagination ? <CollectionPagination pagination={pagination} compact /> : null}
    </div>
  );
}
