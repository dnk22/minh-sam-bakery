"use client";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { useProductDetail } from "../../hooks/use-products";
import type { ProductModalState } from "../../types";
import { ProductDetail } from "../product-detail/product-detail";
import styles from "./product-modal.module.css";

export function ProductModal({ state, onStateChange }: { state: ProductModalState; onStateChange: (state: ProductModalState) => void }) {
  const detail = useProductDetail(state?.id);
  return <ResponsiveModal className={styles.modal} description="Thông tin mới nhất được tải từ hệ thống." footer={state ? <CmsButton type="button" variant="outline" onClick={() => onStateChange(null)}>Đóng</CmsButton> : null} onOpenChange={(open) => { if (!open) onStateChange(null); }} open={Boolean(state)} title="Chi tiết sản phẩm">{!state ? null : detail.isLoading ? <p className={styles.state}>Đang tải sản phẩm…</p> : detail.error ? <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải sản phẩm."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div> : detail.data ? <ProductDetail product={detail.data} /> : <p className={styles.state}>Không tìm thấy sản phẩm.</p>}</ResponsiveModal>;
}
