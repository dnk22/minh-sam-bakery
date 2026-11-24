import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye, Power, Trash2 } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { themeConfigStatus, formatThemeDate } from "../../lib/theme-format";
import type { CmsTheme } from "../../types";
import { ThemePalette } from "../theme-palette/theme-palette";
import styles from "../theme-ui.module.css";

export type ThemeActions = {
  onDetail: (theme: CmsTheme) => void;
  onDuplicate: (theme: CmsTheme) => void;
  onDelete: (theme: CmsTheme) => void;
  onActivate: (theme: CmsTheme) => void;
};

export function createThemeColumns(actions: ThemeActions): ColumnDef<CmsTheme, unknown>[] {
  return [
    { accessorKey: "name", header: "Giao diện", size: 230, cell: ({ row }) =>
      <span className={styles.nameText}><strong>{row.original.name}</strong><small>{row.original.code}</small></span> },
    { id: "palette", header: "Màu sắc", size: 165, cell: ({ row }) => <ThemePalette theme={row.original} /> },
    { id: "status", header: "Trạng thái", size: 145, cell: ({ row }) =>
      <CmsBadge variant={row.original.isActive ? "success" : "secondary"}>{row.original.isActive ? "Đang hoạt động" : "Chưa kích hoạt"}</CmsBadge> },
    { id: "schema", header: "Cấu hình", size: 135, cell: ({ row }) =>
      <CmsBadge variant={themeConfigStatus(row.original).valid ? "default" : "warning"}>{themeConfigStatus(row.original).valid ? "V1 hợp lệ" : "Legacy / lỗi"}</CmsBadge> },
    { accessorKey: "updatedAt", header: "Cập nhật", size: 170, cell: ({ row }) => formatThemeDate(row.original.updatedAt) },
    { id: "actions", header: "Thao tác", size: 80, cell: ({ row }) => {
      const theme = row.original;
      return <CmsRowActions moreLabel={"Mở thao tác " + theme.name} viewLabel={"Xem " + theme.name}
        onView={() => actions.onDetail(theme)}
        actions={[
          { key: "preview", icon: <Eye size={15} aria-hidden="true" />, label: "Xem trước Landing", disabled: !themeConfigStatus(theme).valid, onSelect: () => window.open("/theme-preview/" + encodeURIComponent(theme.id), "_blank", "noopener,noreferrer") },
          { key: "activate", icon: <Power size={15} aria-hidden="true" />, label: "Kích hoạt theme", disabled: theme.isActive || !themeConfigStatus(theme).valid, onSelect: () => actions.onActivate(theme) },
          { key: "duplicate", icon: <Copy size={15} aria-hidden="true" />, label: "Nhân bản thành theme nháp", disabled: !themeConfigStatus(theme).valid, onSelect: () => actions.onDuplicate(theme) },
          { key: "delete", icon: <Trash2 size={15} aria-hidden="true" />, label: "Xóa theme", destructive: true, disabled: theme.isActive, separatorBefore: true, onSelect: () => actions.onDelete(theme) },
        ]} />;
    } },
  ];
}
