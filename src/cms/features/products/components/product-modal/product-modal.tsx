"use client";

import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Path } from "react-hook-form";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { useCategoryTree } from "@/cms/features/categories/hooks/use-categories";
import { flattenTreeOptions } from "@/cms/features/categories/lib/category-tree";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { focusCmsFormIssue, useFormValidationFeedback } from "@/cms/hooks/use-form-validation-feedback";
import { notify } from "@/cms/lib/notifications";

import { useProductForm } from "../../hooks/use-product-form";
import { useProductMutations } from "../../hooks/use-product-mutations";
import { useProductDetail } from "../../hooks/use-products";
import { formToCreate, formToPatch } from "../../lib/product-form-mapper";
import { productCategoryGuard } from "../../lib/product-category-guard";
import type { Product, ProductFormValues, ProductModalState } from "../../types";
import { ProductDetail } from "../product-detail/product-detail";
import { ProductFields } from "../product-fields/product-fields";
import styles from "./product-modal.module.css";

export function ProductModal({ state, onStateChange, onDelete }: { state: ProductModalState; onStateChange: (state: ProductModalState) => void; onDelete: (product: Product) => void }) {
  const mode = state?.mode ?? "detail";
  const id = state && "id" in state ? state.id : undefined;
  const detail = useProductDetail(id);
  const product = detail.data;
  const treeQuery = useCategoryTree(Boolean(state));
  const mutations = useProductMutations();
  const uploadSession = `${mode}:${id ?? "new"}`;
  const [uploadState, setUploadState] = useState({ session: uploadSession, pending: false });
  if (uploadState.session !== uploadSession) setUploadState({ session: uploadSession, pending: false });
  const uploadPending = uploadState.pending;
  const { form, markSlugManual } = useProductForm({ state, product });
  const onInvalid = useFormValidationFeedback<ProductFormValues>({ formId: "product-form" });
  const isEditing = mode === "create" || mode === "edit";
  const pending = mutations.create.isPending || mutations.update.isPending;
  const selectedCategoryId = form.watch("categoryId");
  const completeCategoryIds = treeQuery.data?.tree ? new Set(treeQuery.data.tree.byId.keys()) : undefined;
  const categoryGuard = isEditing ? productCategoryGuard({
    mode: mode === "create" ? "create" : "edit",
    selectedCategoryId,
    originalCategoryId: product?.categoryId,
    completeCategoryIds,
  }) : { allowed: true, reason: null };
  useUnsavedChangesWarning(isEditing && (form.formState.isDirty || uploadPending), "Bỏ các thay đổi hoặc ảnh đang chờ upload?");
  const categoryOptions = useMemo(() => {
    const options = treeQuery.data?.tree ? flattenTreeOptions(treeQuery.data.tree.forest).map((item) => ({ value: item.id, label: item.label })) : [];
    if (product && !options.some((item) => item.value === product.categoryId)) options.unshift({ value: product.categoryId, label: `${product.categoryName} (danh mục hiện tại)` });
    return [{ value: "", label: treeQuery.isLoading ? "Đang tải danh mục…" : treeQuery.error || treeQuery.data?.reason ? "Không thể tải danh mục" : "Chọn danh mục" }, ...options];
  }, [product, treeQuery.data, treeQuery.error, treeQuery.isLoading]);
  const categoryIssue = treeQuery.error instanceof Error ? treeQuery.error.message : treeQuery.data?.reason;
  const close = () => onStateChange(null);
  const confirmDiscard = () => !pending && (!isEditing || (!form.formState.isDirty && !uploadPending) || window.confirm("Bỏ các thay đổi hoặc ảnh đang chờ upload?"));
  const setBackendError = (error: unknown) => {
    if (error instanceof CmsApiError) {
      const fields = Object.entries(error.fields ?? {});
      fields.forEach(([field, message], index) => form.setError(field as Path<ProductFormValues>, { message }, { shouldFocus: index === 0 }));
      form.setError("root.server", { message: error.message });
      if (fields[0]) focusCmsFormIssue("product-form", fields[0][0]);
    } else form.setError("root.server", { message: "Không thể lưu sản phẩm lúc này." });
  };
  const submit = form.handleSubmit(async (values) => {
    if (pending) return;
    if (uploadPending) {
      const message = "Hãy tải xong các ảnh đã chọn trước khi lưu.";
      form.setError("root.server", { message });
      notify.error(message, "validation:product-form");
      focusCmsFormIssue("product-form", "__upload__");
      return;
    }
    if (!categoryGuard.allowed) {
      form.setError("categoryId", { message: categoryGuard.reason ?? undefined });
      notify.error("Vui lòng kiểm tra lại danh mục sản phẩm.", "validation:product-form");
      focusCmsFormIssue("product-form", "categoryId");
      return;
    }
    try {
      let saved: Product | null = null;
      if (mode === "create") saved = await mutations.create.mutateAsync(formToCreate(values));
      else if (mode === "edit" && product) {
        const patch = formToPatch(values, product);
        if (!Object.keys(patch).length) {
          notify.info("Không có thay đổi để lưu.", "product-no-changes");
          return;
        }
        saved = await mutations.update.mutateAsync({ id: product.id, input: patch });
      }
      if (saved) onStateChange({ mode: "detail", id: saved.id });
    } catch (error) { setBackendError(error); }
  }, onInvalid);
  const title = mode === "create" ? "Thêm sản phẩm" : mode === "edit" ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm";
  const footer = !state ? null : isEditing ? <>
    <CmsButton type="button" variant="outline" disabled={pending} onClick={() => { if (confirmDiscard()) close(); }}>Hủy</CmsButton>
    <CmsButton type="submit" form="product-form" disabled={pending || uploadPending}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Lưu sản phẩm</CmsButton>
  </> : product ? <>
    <CmsButton type="button" variant="outline" onClick={() => onDelete(product)}><Trash2 aria-hidden="true" size={16} /> Xóa</CmsButton>
    <CmsButton type="button" onClick={() => onStateChange({ mode: "edit", id: product.id })}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</CmsButton>
  </> : null;

  let content = <p className={styles.state}>Không tìm thấy sản phẩm.</p>;
  if (!state) content = <></>;
  else if ((mode === "edit" || mode === "detail") && detail.isLoading) content = <p className={styles.state}>Đang tải sản phẩm…</p>;
  else if (detail.error) content = <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải sản phẩm."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div>;
  else if (mode === "detail" && product) content = <ProductDetail product={product} />;
  else if (isEditing) content = <form id="product-form" className={styles.form} noValidate onChange={() => form.clearErrors("root.server")} onSubmit={submit}>
    <ProductFields key={uploadSession} form={form} categoryOptions={categoryOptions} categoryDisabled={!treeQuery.data?.tree} onSlugManual={markSlugManual} collectionEditingDisabled={pending} onUploadPendingChange={(nextPending) => { setUploadState({ session: uploadSession, pending: nextPending }); if (!nextPending) form.clearErrors("root.server"); }} />
    {categoryIssue ? <div className={styles.alert} role="alert"><p>{categoryIssue}</p><CmsButton type="button" variant="outline" size="sm" onClick={() => treeQuery.refetch()}>Tải lại danh mục</CmsButton></div> : null}
    {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
    {isEditing ? <p className={styles.orphan}>Ảnh đã tải lên có thể vẫn được lưu nếu bạn đóng biểu mẫu hoặc lưu thất bại.</p> : null}
  </form>;

  return <ResponsiveModal className={styles.modal} open={Boolean(state)} onOpenChange={(open) => { if (!open) close(); }} onBeforeClose={confirmDiscard} title={title} description={mode === "detail" ? "Thông tin mới nhất được tải từ hệ thống." : "Các trường bắt buộc phải hợp lệ trước khi lưu."} footer={footer}>{content}</ResponsiveModal>;
}
