"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";

import { useSystemConfigMutations } from "../../hooks/use-system-config-mutations";
import type { SystemConfig } from "../../types";
import styles from "./system-config-delete-dialog.module.css";

export function SystemConfigDeleteDialog({ config, onClose, onDeleted }: { config: SystemConfig | null; onClose: () => void; onDeleted: () => void }) {
  const { remove } = useSystemConfigMutations();
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (!config || remove.isPending) return;
    setError(null);
    try { await remove.mutateAsync(config.id); onDeleted(); }
    catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa cấu hình lúc này."); }
  };
  return <ResponsiveModal footer={<><CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={remove.isPending} onClick={confirm}>{remove.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xóa</CmsButton></>}
    onBeforeClose={() => !remove.isPending} onOpenChange={(open) => { if (!open && !remove.isPending) { setError(null); onClose(); } }} open={Boolean(config)} title="Xóa cấu hình" variant="confirm">
    <div className={styles.body}><p>Bạn có chắc muốn xóa cấu hình <strong>“{config?.key}”</strong>?</p><p className={styles.warning}>Thao tác này có thể ảnh hưởng đến chức năng đang sử dụng cấu hình.</p>{error ? <p className={styles.alert} role="alert">{error}</p> : null}</div>
  </ResponsiveModal>;
}
