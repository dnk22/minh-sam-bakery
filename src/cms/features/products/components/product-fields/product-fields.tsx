"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import type { ProductFormValues } from "../../types";
import { ProductImageEditor } from "../product-image-editor/product-image-editor";
import { ProductVariantsEditor } from "../product-variants-editor/product-variants-editor";
import styles from "./product-fields.module.css";

type ProductFieldsProps = {
  form: UseFormReturn<ProductFormValues>;
  categoryOptions: Array<{ value: string; label: string }>;
  categoryDisabled: boolean;
  onSlugManual: () => void;
  collectionEditingDisabled: boolean;
  onUploadPendingChange?: (pending: boolean) => void;
};

export function ProductFields({ form, categoryOptions, categoryDisabled, onSlugManual, collectionEditingDisabled, onUploadPendingChange }: ProductFieldsProps) {
  const errors = form.formState.errors;
  return (
    <div className={styles.sections}>
      <Section title="Thông tin cơ bản">
        <div className={styles.grid}>
          <CmsFormField htmlFor="product-category" label="Danh mục" required error={errors.categoryId?.message}><CmsSelect id="product-category" disabled={categoryDisabled} options={categoryOptions} {...form.register("categoryId")} /></CmsFormField>
          <CmsFormField htmlFor="product-name" label="Tên sản phẩm" required error={errors.name?.message}><CmsInput id="product-name" {...form.register("name")} /></CmsFormField>
          <CmsFormField htmlFor="product-sku" label="SKU" required error={errors.sku?.message}><CmsInput id="product-sku" {...form.register("sku")} /></CmsFormField>
          <CmsFormField htmlFor="product-slug" label="Slug" error={errors.slug?.message}><CmsInput id="product-slug" {...form.register("slug", { onChange: onSlugManual })} /></CmsFormField>
        </div>
        <CmsFormField htmlFor="product-short-description" label="Mô tả ngắn" error={errors.shortDescription?.message}><CmsTextarea id="product-short-description" rows={3} {...form.register("shortDescription")} /></CmsFormField>
        <CmsFormField htmlFor="product-description" label="Mô tả đầy đủ" error={errors.description?.message}><CmsTextarea id="product-description" rows={6} {...form.register("description")} /></CmsFormField>
      </Section>
      <Section title="Giá và xuất bản">
        <div className={styles.grid}>
          <CmsFormField htmlFor="product-price" label="Giá" required error={errors.price?.message}><CmsInput id="product-price" inputMode="decimal" placeholder="250000" {...form.register("price")} /></CmsFormField>
          <CmsFormField htmlFor="product-sale-price" label="Giá khuyến mại" error={errors.salePrice?.message}><CmsInput id="product-sale-price" inputMode="decimal" placeholder="Để trống nếu không có" {...form.register("salePrice")} /></CmsFormField>
          <CmsFormField htmlFor="product-status" label="Trạng thái" error={errors.status?.message}><CmsSelect id="product-status" options={[{ value: "DRAFT", label: "Bản nháp" }, { value: "PUBLISHED", label: "Đã xuất bản" }, { value: "HIDDEN", label: "Đã ẩn" }]} {...form.register("status")} /></CmsFormField>
        </div>
        <div className={styles.checks} role="group" aria-label="Nhãn sản phẩm">
          <label htmlFor="product-featured"><input id="product-featured" type="checkbox" {...form.register("isFeatured")} /> Sản phẩm nổi bật</label>
          <label htmlFor="product-best-seller"><input id="product-best-seller" type="checkbox" {...form.register("isBestSeller")} /> Sản phẩm bán chạy</label>
        </div>
        <p className={styles.hint}>Nhập giá bán và giá khuyến mại hợp lệ cho sản phẩm.</p>
      </Section>
      <Section title="Hình ảnh">
        <CmsFormField fieldName="images" label="Bộ ảnh sản phẩm" error={errors.images?.message}>
          <ProductImageEditor form={form} disabled={collectionEditingDisabled} onPendingChange={onUploadPendingChange} />
        </CmsFormField>
      </Section>
      <Section title="Biến thể"><ProductVariantsEditor form={form} disabled={collectionEditingDisabled} /></Section>
      <Section title="SEO">
        <div className={styles.grid}>
          <CmsFormField htmlFor="product-seo-title" label="Tiêu đề SEO" error={errors.seoTitle?.message}><CmsInput id="product-seo-title" {...form.register("seoTitle")} /></CmsFormField>
          <CmsFormField htmlFor="product-seo-description" label="Mô tả SEO" error={errors.seoDescription?.message}><CmsTextarea id="product-seo-description" rows={3} {...form.register("seoDescription")} /></CmsFormField>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className={styles.section}><h3>{title}</h3>{children}</section>;
}
