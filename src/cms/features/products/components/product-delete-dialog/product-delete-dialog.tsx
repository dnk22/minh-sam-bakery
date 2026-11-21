"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useProductMutations } from "../../hooks/use-product-mutations";
import type { Product } from "../../types";
import styles from "./product-delete-dialog.module.css";

export function ProductDeleteDialog({ product, onClose, onDeleted }: { product: Product | null; onClose: () => void; onDeleted: () => void }) {
  const { remove } = useProductMutations();
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => { if (!product || remove.isPending) return; setError(null); try { await remove.mutateAsync(product.id); onDeleted(); } catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa sản phẩm lúc này."); } };
  return <ResponsiveModal open={Boolean(product)} onOpenChange={(open) => { if (!open && !remove.isPending) onClose(); }} onBeforeClose={() => !remove.isPending} title="Xóa sản phẩm" variant="confirm" footer={<><CmsButton type="button" variant="outline" disabled={remove.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={remove.isPending} onClick={confirm}>{remove.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xóa</CmsButton></>}><div className={styles.body}><p>Bạn có chắc muốn xóa sản phẩm <strong>“{product?.name}”</strong> ({product?.sku})?</p>{error ? <p className={styles.alert} role="alert">{error}</p> : null}</div></ResponsiveModal>;
}
