"use client";

import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUploadPreview } from "@/cms/components/image-upload/image-upload-preview";
import { useMemo, useRef } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { focusCmsFormIssue, useFormValidationFeedback } from "@/cms/hooks/use-form-validation-feedback";
import { notify } from "@/cms/lib/notifications";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";

import { descendantIds, flattenTreeOptions } from "../../lib/category-tree";
import { categoryToForm, formToCreate, formToPatch } from "../../schemas/category.schema";
import { useCategoryForm } from "../../hooks/use-category-form";
import { useCategoryDetail, useCategoryMutations } from "../../hooks/use-category-mutations";
import { useCategoryTree } from "../../hooks/use-categories";
import type { Category, CategoryFormValues, CategoryModalState } from "../../types";
import { CategoryFields } from "../category-fields/category-fields";
import styles from "./category-modal.module.css";

export function CategoryModal({ state, onStateChange, onDelete }: {
  state: CategoryModalState;
  onStateChange: (state: CategoryModalState) => void;
  onDelete: (category: Category) => void;
}) {
  const mode = state?.mode ?? "detail";
  const detail = useCategoryDetail(state?.id);
  const treeQuery = useCategoryTree(Boolean(state));
  const mutations = useCategoryMutations();
  const submitting = useRef(false);
  const pending = mutations.create.isPending || mutations.update.isPending;
  const isEditing = mode === "create" || mode === "edit";
  const category = detail.data;
  const { form, uploadPending, setUploadPending, markSlugManual } =
    useCategoryForm({ state, category });
  const onInvalid = useFormValidationFeedback<CategoryFormValues>({ formId: "category-form" });
  useUnsavedChangesWarning(isEditing && (form.formState.isDirty || uploadPending));

  const parentOptions = useMemo(() => {
    const tree = treeQuery.data?.tree;
    if (!tree) return [];
    return flattenTreeOptions(tree.forest, state?.id ? descendantIds(tree, state.id) : new Set());
  }, [state, treeQuery.data]);

  const close = () => onStateChange(null);
  const confirmDiscard = () => !pending && !submitting.current && (!isEditing || (!form.formState.isDirty && !uploadPending) || window.confirm("Bỏ các thay đổi hoặc ảnh đang chờ upload?"));
  const setBackendError = (error: unknown) => {
    if (error instanceof CmsApiError) {
      const fields = Object.entries(error.fields ?? {}).filter(([field]) => field in form.getValues());
      fields.forEach(([field, message], index) => {
        form.setError(field as keyof CategoryFormValues, { message }, { shouldFocus: index === 0 });
      });
      form.setError("root.server", { message: error.message });
      if (fields[0]) focusCmsFormIssue("category-form", fields[0][0]);
    } else form.setError("root.server", { message: "Không thể lưu danh mục lúc này." });
  };

  const submit = form.handleSubmit(async (values) => {
    if (pending || submitting.current) return;
    if (uploadPending) {
      const message = "Hãy tải ảnh đã chọn lên trước khi lưu.";
      form.setError("root.server", { message });
      notify.error(message, "validation:category-form");
      focusCmsFormIssue("category-form", "__upload__");
      return;
    }
    submitting.current = true;
    try {
      let saved: Category | null = null;
      if (mode === "create") saved = await mutations.create.mutateAsync(formToCreate(values));
      else if (category) {
        const patch = formToPatch(values, category);
        if (!Object.keys(patch).length) {
          notify.info("Không có thay đổi để lưu.", "category-no-changes");
          return;
        }
        saved = await mutations.update.mutateAsync({ id: category.id, input: patch });
      }
      if (saved) { form.reset(categoryToForm(saved)); onStateChange({ mode: "detail", id: saved.id }); }
    } catch (error) { setBackendError(error); } finally { submitting.current = false; }
  }, onInvalid);

  const title = mode === "create" ? "Thêm danh mục" : mode === "edit" ? "Chỉnh sửa danh mục" : "Chi tiết danh mục";
  return (
    <ResponsiveModal open={Boolean(state)} onOpenChange={(open) => { if (!open) close(); }} onBeforeClose={confirmDiscard} title={title}
      description={mode === "detail" ? "Thông tin hiện tại từ hệ thống." : "Các trường có dấu yêu cầu phải hợp lệ trước khi lưu."}
      footer={state ? isEditing ? <>
        <CmsButton type="button" variant="outline" disabled={pending} onClick={() => { if (confirmDiscard()) close(); }}>Hủy</CmsButton>
        <CmsButton type="submit" form="category-form" disabled={pending || uploadPending}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Lưu danh mục</CmsButton>
      </> : category ? <>
        <CmsButton type="button" variant="outline" onClick={() => onDelete(category)}><Trash2 aria-hidden="true" size={16} /> Xóa</CmsButton>
        <CmsButton type="button" variant="outline" onClick={() => onStateChange({ mode: "create", parentId: category.id })}><Plus aria-hidden="true" size={16} /> Thêm danh mục con</CmsButton>
        <CmsButton type="button" onClick={() => onStateChange({ mode: "edit", id: category.id })}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</CmsButton>
      </> : null : null}
    >
      {!state ? null : (mode === "edit" || mode === "detail") && detail.isLoading ? <p className={styles.state}>Đang tải chi tiết…</p>
        : detail.error ? <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải chi tiết."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div>
        : mode === "detail" && category ? <CategoryDetail category={category} parentName={treeQuery.data?.tree?.byId.get(category.parentId ?? "")?.name} />
        : isEditing ? <form id="category-form" className={styles.form} noValidate onChange={() => form.clearErrors("root.server")} onSubmit={submit}>
          <CategoryFields key={`${mode}:${state.id ?? ""}:${state.parentId ?? ""}`} form={form} saving={pending} parentOptions={parentOptions} parentDisabled={!treeQuery.data?.tree} onSlugManual={markSlugManual} onUploadPending={(nextPending) => { setUploadPending(nextPending); if (!nextPending) form.clearErrors("root.server"); }} />
          {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
          <p className={styles.orphanNote}>Ảnh đã tải lên có thể vẫn được lưu nếu bạn đóng biểu mẫu hoặc lưu danh mục thất bại.</p>
        </form> : <p className={styles.state}>Không tìm thấy danh mục.</p>}
    </ResponsiveModal>
  );
}

function CategoryDetail({ category, parentName }: { category: Category; parentName?: string }) {
  const entries = [
    ["Tên", category.name], ["Slug", category.slug], ["Danh mục cha", parentName ?? (category.parentId ? "Không xác định" : "Danh mục gốc")],
    ["Trạng thái", category.status === "VISIBLE" ? "Hiển thị" : "Ẩn"], ["Thứ tự", String(category.sortOrder)],
    ["Mô tả", category.description || "—"], ["Tiêu đề SEO", category.seoTitle || "—"], ["Mô tả SEO", category.seoDescription || "—"],
    ["Ngày tạo", formatDate(category.createdAt)], ["Cập nhật", formatDate(category.updatedAt)],
  ];
  return <div className={styles.detail}>
    {category.imageUrl ? <ImageUploadPreview value={category.imageUrl} altText={`Ảnh ${category.name}`} /> : null}
    <dl>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
