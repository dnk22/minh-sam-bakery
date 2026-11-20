"use client";

import type { UseFormReturn } from "react-hook-form";

import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import type { ProductFormValues } from "../../types";
import { ProductImageEditor } from "../product-image-editor/product-image-editor";
import { ProductVariantsEditor } from "../product-variants-editor/product-variants-editor";
import styles from "./product-fields.module.css";

export function ProductFields({ form, categoryOptions, categoryDisabled, onSlugManual, collectionEditingDisabled, onUploadPendingChange }: { form: UseFormReturn<ProductFormValues>; categoryOptions: Array<{ value: string; label: string }>; categoryDisabled: boolean; onSlugManual: () => void; collectionEditingDisabled: boolean; onUploadPendingChange?: (pending: boolean) => void }) {
  const errors = form.formState.errors;
  return <div className={styles.sections}>
    <Section title="Thông tin cơ bản"><div className={styles.grid}>
      <CmsFormField label="Danh mục" required error={errors.categoryId?.message}><CmsSelect disabled={categoryDisabled} options={categoryOptions} {...form.register("categoryId")} /></CmsFormField>
      <CmsFormField label="Tên sản phẩm" required error={errors.name?.message}><CmsInput {...form.register("name")} /></CmsFormField>
      <CmsFormField label="SKU" required error={errors.sku?.message}><CmsInput {...form.register("sku")} /></CmsFormField>
      <CmsFormField label="Slug" error={errors.slug?.message}><CmsInput {...form.register("slug", { onChange: onSlugManual })} /></CmsFormField>
    </div><CmsFormField label="Mô tả ngắn" error={errors.shortDescription?.message}><CmsTextarea rows={3} {...form.register("shortDescription")} /></CmsFormField><CmsFormField label="Mô tả đầy đủ" error={errors.description?.message}><CmsTextarea rows={6} {...form.register("description")} /></CmsFormField></Section>
    <Section title="Giá và xuất bản"><div className={styles.grid}>
      <CmsFormField label="Giá" required error={errors.price?.message}><CmsInput inputMode="decimal" placeholder="250000" {...form.register("price")} /></CmsFormField>
      <CmsFormField label="Giá khuyến mại" error={errors.salePrice?.message}><CmsInput inputMode="decimal" placeholder="Để trống nếu không có" {...form.register("salePrice")} /></CmsFormField>
      <CmsFormField label="Trạng thái"><CmsSelect options={[{ value: "DRAFT", label: "Bản nháp" }, { value: "PUBLISHED", label: "Đã xuất bản" }, { value: "HIDDEN", label: "Đã ẩn" }]} {...form.register("status")} /></CmsFormField>
    </div><div className={styles.checks}><label><input type="checkbox" {...form.register("isFeatured")} /> Sản phẩm nổi bật</label><label><input type="checkbox" {...form.register("isBestSeller")} /> Sản phẩm bán chạy</label></div><p className={styles.hint}>Giá được gửi dưới dạng decimal string. Backend quyết định các giới hạn nghiệp vụ và quan hệ giữa giá bán/khuyến mại.</p></Section>
    <Section title="Hình ảnh"><ProductImageEditor form={form} disabled={collectionEditingDisabled} onPendingChange={onUploadPendingChange} />{errors.images?.message ? <p className={styles.error}>{errors.images.message}</p> : null}</Section>
    <Section title="Biến thể"><ProductVariantsEditor form={form} disabled={collectionEditingDisabled} /></Section>
    <Section title="SEO"><div className={styles.grid}><CmsFormField label="Tiêu đề SEO" error={errors.seoTitle?.message}><CmsInput {...form.register("seoTitle")} /></CmsFormField><CmsFormField label="Mô tả SEO" error={errors.seoDescription?.message}><CmsTextarea rows={3} {...form.register("seoDescription")} /></CmsFormField></div></Section>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className={styles.section}><h3>{title}</h3>{children}</section>; }
