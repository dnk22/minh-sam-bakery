"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import type { ProductFormValues } from "../../types";
import styles from "./product-variants-editor.module.css";

export function ProductVariantsEditor({ form, disabled = false }: { form: UseFormReturn<ProductFormValues>; disabled?: boolean }) {
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "variants" });
  const errors = form.formState.errors.variants;
  return <div className={styles.root}>
    {disabled ? <p className={styles.notice}>Chỉnh sửa biến thể đang khóa an toàn vì Backend chưa xác nhận PATCH mảng là replace hay merge. Các biến thể hiện có được bảo toàn.</p> : <CmsButton type="button" variant="outline" size="sm" onClick={() => append({ sku: "", size: "", style: "", price: "", salePrice: "", status: "ACTIVE", sortOrder: fields.length })}><Plus aria-hidden="true" size={15} /> Thêm biến thể</CmsButton>}
    {fields.length ? <div className={styles.list}>{fields.map((field, index) => <article className={styles.card} key={field.id}><header><strong>Biến thể {index + 1}</strong><div><CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === 0} onClick={() => move(index, index - 1)} aria-label="Đưa biến thể lên"><ArrowUp aria-hidden="true" /></CmsButton><CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === fields.length - 1} onClick={() => move(index, index + 1)} aria-label="Đưa biến thể xuống"><ArrowDown aria-hidden="true" /></CmsButton><CmsButton type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => remove(index)} aria-label="Xóa biến thể"><Trash2 aria-hidden="true" /></CmsButton></div></header><div className={styles.grid}>
      <CmsFormField label="SKU" required error={errors?.[index]?.sku?.message}><CmsInput disabled={disabled} {...form.register(`variants.${index}.sku`)} /></CmsFormField>
      <CmsFormField label="Kích thước" required error={errors?.[index]?.size?.message}><CmsInput disabled={disabled} {...form.register(`variants.${index}.size`)} /></CmsFormField>
      <CmsFormField label="Kiểu" required error={errors?.[index]?.style?.message}><CmsInput disabled={disabled} {...form.register(`variants.${index}.style`)} /></CmsFormField>
      <CmsFormField label="Giá" required error={errors?.[index]?.price?.message}><CmsInput disabled={disabled} inputMode="decimal" {...form.register(`variants.${index}.price`)} /></CmsFormField>
      <CmsFormField label="Giá khuyến mại" error={errors?.[index]?.salePrice?.message}><CmsInput disabled={disabled} inputMode="decimal" {...form.register(`variants.${index}.salePrice`)} /></CmsFormField>
      <CmsFormField label="Trạng thái"><CmsSelect disabled={disabled} options={[{ value: "ACTIVE", label: "Hoạt động" }, { value: "INACTIVE", label: "Ngừng hoạt động" }]} {...form.register(`variants.${index}.status`)} /></CmsFormField>
    </div></article>)}</div> : <p className={styles.empty}>Sản phẩm chưa có biến thể.</p>}
  </div>;
}
