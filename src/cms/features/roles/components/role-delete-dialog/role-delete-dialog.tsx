"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";

import { useRoleMutations } from "../../hooks/use-role-mutations";
import type { Role } from "../../types";
import styles from "./role-delete-dialog.module.css";

export function RoleDeleteDialog({ role, onClose, onDeleted }: {
  role: Role | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { remove } = useRoleMutations();
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (!role || remove.isPending) return;
    setError(null);
    try { await remove.mutateAsync(role.id); onDeleted(); }
    catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa vai trò lúc này."); }
  };
  return (
    <ResponsiveModal
      description="Thao tác này không thể hoàn tác. Backend sẽ kiểm tra mọi ràng buộc liên quan."
      footer={<><CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={remove.isPending} onClick={confirm}>{remove.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xác nhận xóa</CmsButton></>}
      onBeforeClose={() => !remove.isPending}
      onOpenChange={(open) => { if (!open && !remove.isPending) onClose(); }}
      open={Boolean(role)}
      title="Xóa vai trò"
    >
      <div className={styles.body}>
        <p>Bạn có chắc muốn xóa <strong>{role?.name}</strong>?</p>
        {role?.isSystem ? <p className={styles.warning}>Đây là vai trò hệ thống. Backend có thể từ chối thao tác này theo chính sách bảo vệ.</p> : null}
        {error ? <p className={styles.alert} role="alert">{error}</p> : null}
      </div>
    </ResponsiveModal>
  );
}
