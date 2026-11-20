"use client";

import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";

import { descendantIds, flattenTreeOptions } from "../../lib/category-tree";
import { formToCreate, formToPatch } from "../../schemas/category.schema";
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
  const isEditing = mode === "create" || mode === "edit";
  const category = detail.data;
  const { form, uploadPending, setUploadPending, markSlugManual } =
    useCategoryForm({ state, category });
  useUnsavedChangesWarning(isEditing && (form.formState.isDirty || uploadPending));

  const parentOptions = useMemo(() => {
    const tree = treeQuery.data?.tree;
    if (!tree) return [];
    return flattenTreeOptions(tree.forest, state?.id ? descendantIds(tree, state.id) : new Set());
  }, [state, treeQuery.data]);

  const close = () => onStateChange(null);
  const confirmDiscard = () => !isEditing || !form.formState.isDirty || window.confirm("Bỏ các thay đổi chưa lưu?");
  const setBackendError = (error: unknown) => {
    if (error instanceof CmsApiError) {
      Object.entries(error.fields ?? {}).forEach(([field, message]) => {
        if (field in form.getValues()) form.setError(field as keyof CategoryFormValues, { message });
      });
      form.setError("root.server", { message: error.message });
    } else form.setError("root.server", { message: "Không thể lưu danh mục lúc này." });
  };

  const submit = form.handleSubmit(async (values) => {
    if (uploadPending) {
      form.setError("root.server", { message: "Hãy tải ảnh đã chọn lên trước khi lưu." });
      return;
    }
    try {
      let saved: Category | null = null;
      if (mode === "create") saved = await mutations.create.mutateAsync(formToCreate(values));
      else if (category) {
        const patch = formToPatch(values, category);
        saved = Object.keys(patch).length ? await mutations.update.mutateAsync({ id: category.id, input: patch }) : category;
      }
      if (saved) onStateChange({ mode: "detail", id: saved.id });
    } catch (error) { setBackendError(error); }
  });

  const pending = mutations.create.isPending || mutations.update.isPending;
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
        : isEditing ? <form id="category-form" className={styles.form} noValidate onSubmit={submit}>
          <CategoryFields key={`${mode}:${state.id ?? ""}:${state.parentId ?? ""}`} form={form} parentOptions={parentOptions} parentDisabled={!treeQuery.data?.tree} onSlugManual={markSlugManual} onUploadPending={setUploadPending} />
          {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
          <p className={styles.orphanNote}>Ảnh đã upload có thể còn trên máy chủ nếu đóng form hoặc lưu danh mục thất bại; Backend chưa có API xóa media.</p>
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
    {category.imageUrl ? <Image className={styles.detailImage} src={cmsAssetUrl(category.imageUrl)} alt={`Ảnh ${category.name}`} width={640} height={320} unoptimized /> : null}
    <dl>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
