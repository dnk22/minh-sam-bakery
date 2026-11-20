import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import type { Role } from "../types";
import styles from "./roles-collection/roles-collection.module.css";

export type RoleActionHandlers = { onDetail: (role: Role) => void; onDelete: (role: Role) => void };

export function createRoleColumns(actions: RoleActionHandlers): ColumnDef<Role, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Vai trò",
      size: 180,
      cell: ({ row }) => <strong className={styles.truncated} title={row.original.name}>{row.original.name}</strong>,
    },
    {
      accessorKey: "code",
      header: "Mã",
      size: 145,
      cell: ({ row }) => <code className={styles.truncated} title={row.original.code}>{row.original.code}</code>,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      size: 235,
      cell: ({ row }) => <span className={styles.truncated} title={row.original.description ?? undefined}>{row.original.description || "—"}</span>,
    },
    {
      accessorKey: "isSystem",
      header: "Loại",
      size: 92,
      cell: ({ row }) => <CmsBadge variant={row.original.isSystem ? "secondary" : "default"}>{row.original.isSystem ? "Hệ thống" : "Tùy chỉnh"}</CmsBadge>,
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
      size: 118,
      cell: ({ row }) => <span className={styles.date}>{formatDate(row.original.updatedAt)}</span>,
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 82,
      cell: ({ row }) => (
        <CmsRowActions
          actions={[{
            key: "delete",
            label: "Xóa vai trò",
            icon: <Trash2 aria-hidden="true" size={15} />,
            destructive: true,
            onSelect: () => actions.onDelete(row.original),
          }]}
          moreLabel={`Mở thao tác cho ${row.original.name}`}
          onView={() => actions.onDetail(row.original)}
          viewLabel={`Xem chi tiết ${row.original.name}`}
        />
      ),
    },
  ];
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(date);
}
