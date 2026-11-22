"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsFormSelect } from "@/cms/components/ui/select/select";
import type { ProductFormValues } from "../../types";
import styles from "./product-variants-editor.module.css";

export function ProductVariantsEditor({ form, disabled = false }: { form: UseFormReturn<ProductFormValues>; disabled?: boolean }) {
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "variants" });
  const errors = form.formState.errors.variants;
  return (
    <div className={styles.root}>
      {disabled ? <p className={styles.notice}>Chưa thể chỉnh sửa các biến thể hiện có. Thông tin hiện tại vẫn được giữ nguyên.</p> : <CmsButton type="button" variant="outline" size="sm" onClick={() => append({ sku: "", size: "", style: "", price: "", salePrice: "", status: "ACTIVE", sortOrder: fields.length })}><Plus aria-hidden="true" size={15} /> Thêm biến thể</CmsButton>}
      {fields.length ? <div className={styles.list}>{fields.map((field, index) => {
        const prefix = `product-variant-${field.id}`;
        const fieldErrors = errors?.[index];
        return <article className={styles.card} key={field.id}>
          <header><strong>Biến thể {index + 1}</strong><div>
            <CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === 0} onClick={() => move(index, index - 1)} aria-label={`Đưa biến thể ${index + 1} lên`}><ArrowUp aria-hidden="true" /></CmsButton>
            <CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === fields.length - 1} onClick={() => move(index, index + 1)} aria-label={`Đưa biến thể ${index + 1} xuống`}><ArrowDown aria-hidden="true" /></CmsButton>
            <CmsButton type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => remove(index)} aria-label={`Xóa biến thể ${index + 1}`}><Trash2 aria-hidden="true" /></CmsButton>
          </div></header>
          <div className={styles.grid}>
            <CmsFormField htmlFor={`${prefix}-sku`} label="SKU" required error={fieldErrors?.sku?.message}><CmsInput id={`${prefix}-sku`} disabled={disabled} {...form.register(`variants.${index}.sku`)} /></CmsFormField>
            <CmsFormField htmlFor={`${prefix}-size`} label="Kích thước" required error={fieldErrors?.size?.message}><CmsInput id={`${prefix}-size`} disabled={disabled} {...form.register(`variants.${index}.size`)} /></CmsFormField>
            <CmsFormField htmlFor={`${prefix}-style`} label="Kiểu" required error={fieldErrors?.style?.message}><CmsInput id={`${prefix}-style`} disabled={disabled} {...form.register(`variants.${index}.style`)} /></CmsFormField>
            <CmsFormField htmlFor={`${prefix}-price`} label="Giá" required error={fieldErrors?.price?.message}><CmsInput id={`${prefix}-price`} disabled={disabled} inputMode="decimal" {...form.register(`variants.${index}.price`)} /></CmsFormField>
            <CmsFormField htmlFor={`${prefix}-sale-price`} label="Giá khuyến mại" error={fieldErrors?.salePrice?.message}><CmsInput id={`${prefix}-sale-price`} disabled={disabled} inputMode="decimal" {...form.register(`variants.${index}.salePrice`)} /></CmsFormField>
            <CmsFormField htmlFor={`${prefix}-status`} label="Trạng thái" error={fieldErrors?.status?.message}><CmsFormSelect id={`${prefix}-status`} disabled={disabled} options={[{ value: "ACTIVE", label: "Hoạt động" }, { value: "INACTIVE", label: "Ngừng hoạt động" }]} control={form.control} name={`variants.${index}.status`} /></CmsFormField>
          </div>
        </article>;
      })}</div> : <p className={styles.empty}>Sản phẩm chưa có biến thể.</p>}
    </div>
  );
}
