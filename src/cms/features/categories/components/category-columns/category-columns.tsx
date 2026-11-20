import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getCategoryStatusPresentation } from "../../constants";
import type { Category, CategoryTreeNode } from "../../types";
import styles from "./category-columns.module.css";

export type CategoryActionHandlers = {
  onDetail: (category: Category) => void;
  onAddChild: (category: Category) => void;
  onDelete: (category: Category) => void;
};

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
      cell: ({ row }) => {
        const status = getCategoryStatusPresentation(row.original.status);
        return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>;
      },
    },
    { accessorKey: "sortOrder", header: "Thứ tự", size: 60 },
    {
      id: "actions",
      header: "Thao tác",
      size: 82,
      cell: ({ row }) => (
        <CmsRowActions
          actions={[
            {
              key: "add-child",
              label: "Thêm danh mục con",
              icon: <Plus aria-hidden="true" size={15} />,
              onSelect: () => actions.onAddChild(row.original),
            },
            {
              key: "delete",
              label: "Xóa danh mục",
              icon: <Trash2 aria-hidden="true" size={15} />,
              destructive: true,
              separatorBefore: true,
              onSelect: () => actions.onDelete(row.original),
            },
          ]}
          moreLabel={`Mở thao tác cho ${row.original.name}`}
          onView={() => actions.onDetail(row.original)}
          viewLabel={`Xem chi tiết ${row.original.name}`}
        />
      ),
    },
  ];
}
