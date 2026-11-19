"use client";

import type { UseFormReturn } from "react-hook-form";

import { ImageUpload } from "@/cms/components/image-upload/image-upload";

import type { CategoryFormValues } from "../types";
import styles from "./categories.module.css";

export function CategoryFields({ form, parentOptions, parentDisabled, onSlugManual, onUploadPending }: {
  form: UseFormReturn<CategoryFormValues>;
  parentOptions: Array<{ id: string; label: string }>;
  parentDisabled: boolean;
  onSlugManual: () => void;
  onUploadPending: (pending: boolean) => void;
}) {
  const { register, formState: { errors }, setValue, watch } = form;
  return (
    <div className={styles.formGrid}>
      <Field label="Tên danh mục" error={errors.name?.message}><input {...register("name")} aria-invalid={Boolean(errors.name)} /></Field>
      <Field label="Slug" error={errors.slug?.message}><input {...register("slug", { onChange: onSlugManual })} aria-invalid={Boolean(errors.slug)} /></Field>
      <Field label="Danh mục cha" error={errors.parentId?.message}>
        <select {...register("parentId")} disabled={parentDisabled}>
          <option value="">Danh mục gốc</option>
          {parentOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
        {parentDisabled ? <small>Không thể chọn cha khi dữ liệu cây chưa được xác minh đầy đủ.</small> : null}
      </Field>
      <div className={styles.twoColumns}>
        <Field label="Hiển thị" error={errors.status?.message}><select {...register("status")}><option value="VISIBLE">Hiển thị</option><option value="HIDDEN">Ẩn</option></select></Field>
        <Field label="Thứ tự" error={errors.sortOrder?.message}><input type="number" min="0" step="1" {...register("sortOrder", { valueAsNumber: true })} /></Field>
      </div>
      <Field label="Mô tả" error={errors.description?.message}><textarea rows={4} {...register("description")} /></Field>
      <Field label="Ảnh đại diện" error={errors.imageUrl?.message}>
        <ImageUpload folder="categories" value={watch("imageUrl")} onPendingChange={onUploadPending} onChange={(url) => setValue("imageUrl", url, { shouldDirty: true })} />
      </Field>
      <Field label="Tiêu đề SEO" error={errors.seoTitle?.message}><input {...register("seoTitle")} /></Field>
      <Field label="Mô tả SEO" error={errors.seoDescription?.message}><textarea rows={3} {...register("seoDescription")} /></Field>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className={styles.field}><span>{label}</span>{children}{error ? <small className={styles.fieldError}>{error}</small> : null}</label>;
}
