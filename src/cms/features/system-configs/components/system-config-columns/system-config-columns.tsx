import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";

import type { SystemConfig } from "../../types";
import styles from "./system-config-columns.module.css";

export type SystemConfigActionHandlers = { onDetail: (config: SystemConfig) => void; onDelete: (config: SystemConfig) => void };
export function createSystemConfigColumns(actions: SystemConfigActionHandlers): ColumnDef<SystemConfig, unknown>[] {
  return [
    { accessorKey: "key", header: "Khóa", size: 210, cell: ({ row }) => <strong className={`${styles.truncated} ${styles.key}`} title={row.original.key}>{row.original.key}</strong> },
    { accessorKey: "value", header: "Giá trị", size: 280, cell: ({ row }) => <span className={styles.truncated} title={row.original.value}>{row.original.value}</span> },
    { accessorKey: "description", header: "Mô tả", size: 260, cell: ({ row }) => <span className={styles.truncated} title={row.original.description ?? undefined}>{row.original.description || "—"}</span> },
    { id: "actions", header: "Thao tác", size: 82, cell: ({ row }) => <CmsRowActions actions={[{ key: "delete", label: "Xóa cấu hình", icon: <Trash2 aria-hidden="true" size={15} />, destructive: true, onSelect: () => actions.onDelete(row.original) }]}
      moreLabel={`Mở thao tác cho ${row.original.key}`} onView={() => actions.onDetail(row.original)} viewLabel={`Xem chi tiết ${row.original.key}`} /> },
  ];
}
