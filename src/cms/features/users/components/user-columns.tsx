import type { ColumnDef } from "@tanstack/react-table";
import { KeyRound, Lock, Trash2, Unlock } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getUserStatusPresentation, statusAction } from "../constants";
import type { CmsUser, UserAction } from "../types";
import styles from "./users-collection/users-collection.module.css";

export type UserActionHandlers = {
  currentUserId: string;
  onDetail: (user: CmsUser) => void;
  onAssignRole: (user: CmsUser) => void;
  onAction: (user: CmsUser, action: UserAction) => void;
};

export function createUserColumns(actions: UserActionHandlers): ColumnDef<CmsUser, unknown>[] {
  return [
    { accessorKey: "fullName", header: "Họ tên", size: 170, cell: ({ row }) => <strong className={styles.truncated} title={row.original.fullName}>{row.original.fullName}</strong> },
    { accessorKey: "email", header: "Email", size: 205, cell: ({ row }) => <span className={styles.truncated} title={row.original.email}>{row.original.email}</span> },
    { id: "role", header: "Vai trò", size: 150, cell: ({ row }) => <span className={styles.truncated} title={`${row.original.role.name} (${row.original.role.code})`}>{row.original.role.name}</span> },
    { accessorKey: "status", header: "Trạng thái", size: 110, cell: ({ row }) => { const status = getUserStatusPresentation(row.original.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; } },
    { accessorKey: "updatedAt", header: "Cập nhật", size: 112, cell: ({ row }) => <span className={styles.date}>{formatDate(row.original.updatedAt)}</span> },
    {
      id: "actions", header: "Thao tác", size: 82,
      cell: ({ row }) => {
        const user = row.original;
        const lockAction = statusAction(user.status);
        const self = user.id === actions.currentUserId;
        return <CmsRowActions
          actions={[
            { key: "assign-role", label: "Gán vai trò", icon: <KeyRound aria-hidden="true" size={15} />, onSelect: () => actions.onAssignRole(user) },
            { key: lockAction, label: lockAction === "lock" ? "Khóa tài khoản" : "Mở khóa tài khoản", icon: lockAction === "lock" ? <Lock aria-hidden="true" size={15} /> : <Unlock aria-hidden="true" size={15} />, disabled: self && lockAction === "lock", onSelect: () => actions.onAction(user, lockAction) },
            { key: "delete", label: "Xóa mềm tài khoản", icon: <Trash2 aria-hidden="true" size={15} />, destructive: true, disabled: self, separatorBefore: true, onSelect: () => actions.onAction(user, "delete") },
          ]}
          moreLabel={`Mở thao tác cho ${user.fullName}`}
          onView={() => actions.onDetail(user)}
          viewLabel={`Xem chi tiết ${user.fullName}`}
        />;
      },
    },
  ];
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(date);
}
