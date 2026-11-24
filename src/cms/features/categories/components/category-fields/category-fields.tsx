"use client";

import type { UseFormReturn } from "react-hook-form";

import { ImageUpload } from "@/cms/components/image-upload/image-upload";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsFormSelect } from "@/cms/components/ui/select/select";
import { CmsFormCombobox } from "@/cms/components/ui/combobox/combobox";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";

import { CATEGORY_STATUS_OPTIONS } from "../../constants";
import type { CategoryFormValues } from "../../types";
import styles from "./category-fields.module.css";

export function CategoryFields({ form, parentOptions, parentDisabled, onSlugManual, onUploadPending, saving = false }: {
  form: UseFormReturn<CategoryFormValues>;
  parentOptions: Array<{ id: string; label: string }>;
  parentDisabled: boolean;
  onSlugManual: () => void;
  onUploadPending: (pending: boolean) => void;
  saving?: boolean;
}) {
  const { register, formState: { errors }, setValue, watch } = form;
  const parentSelectOptions = [
    { value: "", label: "Danh mục gốc" },
    ...parentOptions.map((option) => ({ value: option.id, label: option.label })),
  ];

  return (
    <div className={styles.formGrid}>
      <CmsFormField
        error={errors.name?.message}
        htmlFor="category-name"
        label="Tên danh mục"
        required
      >
        <CmsInput id="category-name" required {...register("name")} />
      </CmsFormField>
      <CmsFormField
        error={errors.slug?.message}
        htmlFor="category-slug"
        label="Slug"
      >
        <CmsInput
          id="category-slug"
          {...register("slug", { onChange: onSlugManual })}
        />
      </CmsFormField>
      <CmsFormField
        description={
          parentDisabled
            ? "Không thể chọn cha khi dữ liệu cây chưa được xác minh đầy đủ."
            : undefined
        }
        error={errors.parentId?.message}
        htmlFor="category-parent"
        label="Danh mục cha"
      >
        <CmsFormCombobox
          disabled={parentDisabled}
          id="category-parent"
          options={parentSelectOptions}
          control={form.control} name="parentId"
        />
      </CmsFormField>
      <div className={styles.twoColumns}>
        <CmsFormField
          error={errors.status?.message}
          htmlFor="category-status"
          label="Hiển thị"
        >
          <CmsFormSelect
            id="category-status"
            options={CATEGORY_STATUS_OPTIONS}
            control={form.control} name="status"
          />
        </CmsFormField>
        <CmsFormField
          error={errors.sortOrder?.message}
          htmlFor="category-sort-order"
          label="Thứ tự"
        >
          <CmsInput
            id="category-sort-order"
            min={0}
            step={1}
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </CmsFormField>
      </div>
      <CmsFormField
        error={errors.description?.message}
        htmlFor="category-description"
        label="Mô tả"
      >
        <CmsTextarea
          id="category-description"
          rows={4}
          {...register("description")}
        />
      </CmsFormField>
      <CmsFormField fieldName="imageUrl" label="Ảnh đại diện" error={errors.imageUrl?.message}>
        <ImageUpload disabled={saving} folder="categories" value={watch("imageUrl")} onPendingChange={onUploadPending} onChange={(url) => setValue("imageUrl", url, { shouldDirty: true, shouldValidate: true })} />
      </CmsFormField>
      <CmsFormField
        error={errors.seoTitle?.message}
        htmlFor="category-seo-title"
        label="Tiêu đề SEO"
      >
        <CmsInput id="category-seo-title" {...register("seoTitle")} />
      </CmsFormField>
      <CmsFormField
        error={errors.seoDescription?.message}
        htmlFor="category-seo-description"
        label="Mô tả SEO"
      >
        <CmsTextarea
          id="category-seo-description"
          rows={3}
          {...register("seoDescription")}
        />
      </CmsFormField>
    </div>
  );
}
