import type { ColumnDef } from "@tanstack/react-table";

import type { Category, CategoryTreeNode } from "../../types";
import { CategoryRowActions, type CategoryActionHandlers } from "../category-row-actions";
import { CategoryStatusBadge } from "../category-status-badge";
import styles from "./category-columns.module.css";

export type CategoryColumnConfig = CategoryActionHandlers & {
  parentNames?: Map<string, CategoryTreeNode>;
};

export function createCategoryColumns<T extends Category>({
  parentNames,
  ...actions
}: CategoryColumnConfig): ColumnDef<T, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Danh mục",
      size: 180,
      cell: ({ row }) => (
        <div className={styles.name} title={row.original.name}>
          <strong>{row.original.name}</strong>
          {"contextOnly" in row.original && row.original.contextOnly ? (
            <small className={styles.context}>Ngữ cảnh</small>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      size: 165,
      cell: ({ row }) => (
        <span className={styles.truncated} title={row.original.slug}>
          {row.original.slug}
        </span>
      ),
    },
    {
      id: "parent",
      header: "Danh mục cha",
      size: 158,
      cell: ({ row }) => {
        const parent = row.original.parentId
          ? (parentNames?.get(row.original.parentId)?.name ?? "Không xác định")
          : "Danh mục gốc";
        return (
          <span className={styles.truncated} title={parent}>
            {parent}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      size: 86,
      cell: ({ row }) => <CategoryStatusBadge status={row.original.status} />,
    },
    { accessorKey: "sortOrder", header: "Thứ tự", size: 60 },
    {
      id: "actions",
      header: "Thao tác",
      size: 82,
      cell: ({ row }) => (
        <CategoryRowActions category={row.original} {...actions} />
      ),
    },
  ];
}
