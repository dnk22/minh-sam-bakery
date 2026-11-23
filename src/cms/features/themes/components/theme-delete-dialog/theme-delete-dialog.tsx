"use client";

import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useThemeMutations } from "../../hooks/use-theme-mutations";
import type { CmsTheme } from "../../types";
import styles from "../theme-ui.module.css";

export function ThemeDeleteDialog({ theme, onClose, onDeleted }: {
  theme: CmsTheme | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { remove } = useThemeMutations();
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (!theme || theme.isActive || remove.isPending) return;
    setError(null);
    try {
      await remove.mutateAsync(theme.id);
      onDeleted();
    } catch (caught) {
      setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa theme lúc này.");
    }
  };

  return (
    <ResponsiveModal open={Boolean(theme)} variant="confirm" title="Xóa giao diện website"
      onOpenChange={(open) => { if (!open && !remove.isPending) onClose(); }}
      onBeforeClose={() => !remove.isPending}
      footer={<>
        <CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton>
        <CmsButton type="button" variant="destructive" disabled={remove.isPending || theme?.isActive} onClick={confirm}>Xóa theme</CmsButton>
      </>}>
      <p>Bạn có chắc muốn xóa giao diện <strong>“{theme?.name}”</strong>? Thao tác này không thể hoàn tác.</p>
      {theme?.isActive ? <p className={styles.alert} role="alert">Không thể xóa theme đang hoạt động.</p> : null}
      {error ? <p className={styles.alert} role="alert">{error}</p> : null}
    </ResponsiveModal>
  );
}
