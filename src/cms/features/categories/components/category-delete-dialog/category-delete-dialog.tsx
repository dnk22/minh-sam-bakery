"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";

import { useCategoryMutations } from "../../hooks/use-category-mutations";
import type { Category } from "../../types";
import styles from "./category-delete-dialog.module.css";

export function CategoryDeleteDialog({ category, onClose, onDeleted }: { category: Category | null; onClose: () => void; onDeleted: () => void }) {
  const { remove } = useCategoryMutations();
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (!category || remove.isPending) return;
    setError(null);
    try { await remove.mutateAsync(category.id); onDeleted(); }
    catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa danh mục lúc này."); }
  };
  return <ResponsiveModal open={Boolean(category)} onOpenChange={(open) => { if (!open && !remove.isPending) onClose(); }} onBeforeClose={() => !remove.isPending}
    title="Xóa danh mục" description="Thao tác này không thể hoàn tác."
    footer={<><CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={remove.isPending} onClick={confirm}>{remove.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xác nhận xóa</CmsButton></>}
  >
    <div className={styles.body}><p>Bạn có chắc muốn xóa <strong>{category?.name}</strong>?</p><p>Backend sẽ từ chối nếu danh mục còn danh mục con hoặc sản phẩm tham chiếu.</p>{error ? <p className={styles.alert} role="alert">{error}</p> : null}</div>
  </ResponsiveModal>;
}
