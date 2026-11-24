"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { useThemeFilters } from "../../hooks/use-theme-filters";
import { useThemes } from "../../hooks/use-themes";
import type { CmsTheme, ThemeModalState } from "../../types";
import { ThemesCollection } from "../themes-collection/themes-collection";
import { ThemesToolbar } from "../themes-toolbar/themes-toolbar";
import { ThemeModal } from "../theme-modal/theme-modal";
import { ThemeDeleteDialog } from "../theme-delete-dialog/theme-delete-dialog";
import { ThemeActivateDialog } from "../theme-activate-dialog/theme-activate-dialog";
import styles from "../theme-ui.module.css";

const PAGE_SIZE = 20;

export function ThemesPage() {
  const filters = useThemeFilters();
  const query = useThemes({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined, isActive: filters.isActive });
  const [modal, setModal] = useState<ThemeModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsTheme | null>(null);
  const [activateTarget, setActivateTarget] = useState<CmsTheme | null>(null);

  const onDetail = useCallback((theme: CmsTheme) => setModal({ mode: "detail", id: theme.id }), []);
  const onDuplicate = useCallback((theme: CmsTheme) => setModal({ mode: "duplicate", id: theme.id }), []);
  const onActivate = useCallback((theme: CmsTheme) => { setModal(null); setActivateTarget(theme); }, []);
  const deleted = () => {
    setDeleteTarget(null);
    setModal(null);
    if ((query.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1);
  };

  return (
    <CmsMain className={styles.main}>
      <header className={styles.heading}>
        <div>
          <h1>Giao diện website</h1>
          <p>Quản lý bộ màu sắc và font chữ của Landing. Theme mới được lưu ở trạng thái chưa kích hoạt.</p>
        </div>
        <CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}>
          <Plus aria-hidden="true" size={17} /> Thêm theme
        </CmsButton>
      </header>
      <ThemesToolbar filters={filters} />
      <ThemesCollection filters={filters} listQuery={query} onDetail={onDetail} onDuplicate={onDuplicate} onDelete={setDeleteTarget} onActivate={onActivate} />
      <p className={styles.note}>Có thể xem trước Landing và kích hoạt theme tại đây. Theme đang hoạt động không thể chỉnh sửa trực tiếp.</p>
      <ThemeModal state={modal} onStateChange={setModal} onDelete={setDeleteTarget} onActivate={onActivate} />
      <ThemeDeleteDialog key={deleteTarget?.id ?? "closed"} theme={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={deleted} />
      <ThemeActivateDialog key={activateTarget?.id ?? "closed"} theme={activateTarget} onClose={() => setActivateTarget(null)} onActivated={() => { setActivateTarget(null); setModal(null); }} />
    </CmsMain>
  );
}
