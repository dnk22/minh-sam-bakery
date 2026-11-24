"use client";

import { Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { CmsButton } from "@/cms/components/ui/button";
import { useProductVariants } from "../../hooks/use-product-variants";
import type { ProductFormValues } from "../../types";
import { ProductVariantCard } from "./product-variant-card";
import styles from "./product-variants-editor.module.css";

export function ProductVariantsEditor({ form, disabled = false }: { form: UseFormReturn<ProductFormValues>; disabled?: boolean }) {
  const editor = useProductVariants(form);
  return <div className={styles.root}>
    <CmsButton type="button" variant="outline" size="sm" disabled={disabled || editor.atLimit} onClick={editor.add}><Plus aria-hidden="true" size={15} /> Thêm biến thể</CmsButton>
    {editor.publishedWithoutActive ? <p className={styles.notice} role="status">Sản phẩm đã xuất bản nhưng chưa có biến thể hoạt động. Khách hàng sẽ không thể đặt hàng online.</p> : null}
    {editor.atLimit ? <p className={styles.notice}>Đã đạt giới hạn 100 biến thể.</p> : null}
    {editor.fields.length ? <div className={styles.list}>{editor.fields.map((field, index) =>
      <ProductVariantCard key={field.id} fieldKey={field.id} form={form} index={index} count={editor.fields.length} disabled={disabled} onMove={direction => editor.move(index, index + direction)} onRemove={() => editor.remove(index)} />
    )}</div> : <p className={styles.empty}>Sản phẩm chưa có biến thể.</p>}
  </div>;
}
