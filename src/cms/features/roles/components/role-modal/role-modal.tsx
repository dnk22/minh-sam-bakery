"use client";

import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";

import { useRoleForm } from "../../hooks/use-role-form";
import { useRoleMutations } from "../../hooks/use-role-mutations";
import { usePermissionCatalog, useRoleDetail, useRolePermissions } from "../../hooks/use-roles";
import { commitPermissionSelection, editPermissionSelection, newPermissionEditorSession, permissionSelectionDirty, reconcilePermissionEditorSession, reloadPermissionSelection } from "../../lib/permission-editor-session";
import { formToCreate, formToPatch } from "../../schemas/role.schema";
import type { Role, RoleDetail as RoleDetailData, RoleFormValues, RoleModalState } from "../../types";
import { RolePermissionsEditor } from "../role-permissions-editor/role-permissions-editor";
import styles from "./role-modal.module.css";

type RoleSection = "info" | "permissions";

export function RoleModal({ state, onStateChange, onDelete }: {
  state: RoleModalState;
  onStateChange: (state: RoleModalState) => void;
  onDelete: (role: Role) => void;
}) {
  const mode = state?.mode ?? "detail";
  const roleId = state?.id;
  const detail = useRoleDetail(roleId);
  const assigned = useRolePermissions(mode === "edit" ? roleId : undefined);
  const catalog = usePermissionCatalog(Boolean(state) && mode !== "detail");
  const mutations = useRoleMutations();
  const form = useRoleForm({ state, role: detail.data });
  const sessionKey = state ? `${mode}:${roleId ?? "new"}` : "closed";
  const remotePermissionIds = mode === "create" ? [] : assigned.data?.permissions.map((item) => item.id);
  const [permissionState, setPermissionState] = useState(() => newPermissionEditorSession("closed"));
  const [sectionState, setSectionState] = useState<{ sessionKey: string; value: RoleSection }>({ sessionKey: "closed", value: "info" });
  const activeSection = sectionState.sessionKey === sessionKey ? sectionState.value : "info";
  if (sectionState.sessionKey !== sessionKey) setSectionState({ sessionKey, value: "info" });
  const reconciledPermissionState = reconcilePermissionEditorSession(permissionState, sessionKey, remotePermissionIds);
  if (reconciledPermissionState !== permissionState) setPermissionState(reconciledPermissionState);
  const selectedIds = reconciledPermissionState.selectedIds;
  const originalPermissionIds = reconciledPermissionState.baselineIds;
  const permissionsDirty = permissionSelectionDirty(reconciledPermissionState);
  useUnsavedChangesWarning((mode === "create" || mode === "edit") && (form.formState.isDirty || permissionsDirty));
  const setSelectedIds = (ids: string[]) => setPermissionState((current) => editPermissionSelection(current, ids));
  const selectSection = (section: RoleSection, focus = false) => {
    setSectionState({ sessionKey, value: section });
    if (focus) window.requestAnimationFrame(() => document.getElementById(`role-tab-${section}`)?.focus());
  };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    selectSection(event.key === "ArrowLeft" || event.key === "Home" ? "info" : "permissions", true);
  };

  const isEditing = mode === "create" || mode === "edit";
  const close = () => onStateChange(null);
  const confirmDiscard = () => !isEditing || (!form.formState.isDirty && !permissionsDirty) || window.confirm("Bỏ các thay đổi chưa lưu?");
  const setFormError = (error: unknown, fallback: string) => {
    if (error instanceof CmsApiError) {
      Object.entries(error.fields ?? {}).forEach(([field, message]) => {
        if (field in form.getValues()) form.setError(field as keyof RoleFormValues, { message });
      });
      form.setError("root.server", { message: error.message });
    } else form.setError("root.server", { message: fallback });
  };

  const submitCreate = form.handleSubmit(async (values) => {
    try {
      const saved = await mutations.create.mutateAsync(formToCreate(values, selectedIds));
      onStateChange({ mode: "detail", id: saved.id });
    } catch (error) { setFormError(error, "Không thể tạo vai trò lúc này."); }
  });

  const submitInfo = form.handleSubmit(async (values) => {
    if (!detail.data) return;
    const patch = formToPatch(values, detail.data);
    if (!Object.keys(patch).length) return;
    try {
      await mutations.update.mutateAsync({ id: detail.data.id, input: patch });
      form.reset(values);
    } catch (error) { setFormError(error, "Không thể cập nhật thông tin vai trò."); }
  });

  const submitPermissions = async () => {
    if (!roleId || !assigned.isSuccess || !catalog.isSuccess || !permissionsDirty || reconciledPermissionState.conflict || mutations.permissions.isPending) return;
    if (selectedIds.length === 0 && originalPermissionIds.length > 0 && !window.confirm("Thu hồi toàn bộ quyền của vai trò này?")) return;
    try {
      await mutations.permissions.mutateAsync({ id: roleId, permissionIds: selectedIds });
      setPermissionState((current) => commitPermissionSelection(current));
    } catch {
      // Mutation state exposes the error while the local selection is retained.
    }
  };

  const role = detail.data;
  const pending = mutations.create.isPending || mutations.update.isPending;
  const title = mode === "create" ? "Thêm vai trò" : mode === "edit" ? "Chỉnh sửa vai trò" : "Chi tiết vai trò";
  return (
    <ResponsiveModal
      className={styles.modal}
      description={mode === "detail" ? "Thông tin và quyền hiện tại của vai trò." : "Cập nhật thông tin và quyền truy cập của vai trò."}
      footer={state ? mode === "detail" && role ? <>
        <CmsButton type="button" variant="outline" onClick={() => onDelete(role)}><Trash2 aria-hidden="true" size={16} /> Xóa</CmsButton>
        <CmsButton type="button" onClick={() => onStateChange({ mode: "edit", id: role.id })}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</CmsButton>
      </> : <CmsButton type="button" variant="outline" disabled={pending || mutations.permissions.isPending} onClick={() => { if (confirmDiscard()) close(); }}>Đóng</CmsButton> : null}
      onBeforeClose={confirmDiscard}
      onOpenChange={(open) => { if (!open) close(); }}
      open={Boolean(state)}
      title={title}
    >
      {!state ? null : (mode === "edit" || mode === "detail") && detail.isLoading ? <p className={styles.state}>Đang tải chi tiết vai trò…</p>
        : detail.error ? <ErrorState message={detail.error instanceof Error ? detail.error.message : "Không thể tải vai trò."} onRetry={() => detail.refetch()} />
        : mode === "detail" && role ? <RoleDetail role={role} />
        : mode === "create" ? <form className={styles.form} noValidate onSubmit={submitCreate}>
          <RoleFields form={form} />
          <section className={styles.section}><div className={styles.sectionHeading}><h2>Phân quyền ban đầu</h2><p>Có thể bỏ qua và gán quyền sau.</p></div>
            <RolePermissionsEditor catalog={catalog.data} selectedIds={selectedIds} onChange={setSelectedIds} loading={catalog.isLoading} error={catalog.error instanceof Error ? catalog.error.message : undefined} onRetry={() => catalog.refetch()} />
          </section>
          {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
          <CmsButton type="submit" disabled={mutations.create.isPending}>{mutations.create.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Tạo vai trò</CmsButton>
        </form>
        : mode === "edit" && role ? <div className={styles.edit}>
          <div className={styles.tabs} role="tablist" aria-label="Nội dung chỉnh sửa">
            <button aria-controls="role-panel-info" aria-selected={activeSection === "info"} id="role-tab-info" onClick={() => selectSection("info")} onKeyDown={handleTabKey} role="tab" tabIndex={activeSection === "info" ? 0 : -1} type="button">Thông tin</button>
            <button aria-controls="role-panel-permissions" aria-selected={activeSection === "permissions"} id="role-tab-permissions" onClick={() => selectSection("permissions")} onKeyDown={handleTabKey} role="tab" tabIndex={activeSection === "permissions" ? 0 : -1} type="button">Phân quyền</button>
          </div>
          {activeSection === "info" ? <form aria-labelledby="role-tab-info" className={styles.form} id="role-panel-info" noValidate onSubmit={submitInfo} role="tabpanel">
            <RoleFields form={form} />
            {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
            <CmsButton type="submit" disabled={!form.formState.isDirty || mutations.update.isPending}>{mutations.update.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Lưu thông tin</CmsButton>
          </form> : <section aria-labelledby="role-tab-permissions" className={styles.section} id="role-panel-permissions" role="tabpanel">
            <RolePermissionsEditor
              catalog={catalog.data}
              selectedIds={selectedIds}
              onChange={setSelectedIds}
              disabled={!assigned.isSuccess || !catalog.isSuccess || mutations.permissions.isPending}
              loading={catalog.isLoading || assigned.isLoading}
              error={(catalog.error instanceof Error ? catalog.error.message : null) ?? (assigned.error instanceof Error ? assigned.error.message : undefined)}
              onRetry={() => { catalog.refetch(); assigned.refetch(); }}
            />
            {mutations.permissions.error ? <p className={styles.alert} role="alert">{mutations.permissions.error instanceof Error ? mutations.permissions.error.message : "Không thể cập nhật phân quyền."}</p> : null}
            {reconciledPermissionState.conflict ? <div className={styles.alert} role="alert"><p>Phân quyền trên máy chủ đã thay đổi trong khi bạn đang chỉnh sửa. Tải lại để tránh ghi đè thay đổi của quản trị viên khác.</p><CmsButton type="button" variant="outline" size="sm" onClick={() => setPermissionState((current) => reloadPermissionSelection(current))}>Tải thay đổi mới</CmsButton></div> : null}
            <CmsButton type="button" disabled={!permissionsDirty || reconciledPermissionState.conflict || !assigned.isSuccess || !catalog.isSuccess || mutations.permissions.isPending} onClick={submitPermissions}>{mutations.permissions.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Lưu phân quyền</CmsButton>
          </section>}
        </div> : <p className={styles.state}>Không tìm thấy vai trò.</p>}
    </ResponsiveModal>
  );
}

function RoleFields({ form }: { form: UseFormReturn<RoleFormValues> }) {
  const { register, formState: { errors } } = form;
  return <div className={styles.fields}>
    <CmsFormField error={errors.code?.message} htmlFor="role-code" label="Mã vai trò" required><CmsInput id="role-code" required {...register("code")} /></CmsFormField>
    <CmsFormField error={errors.name?.message} htmlFor="role-name" label="Tên vai trò" required><CmsInput id="role-name" required {...register("name")} /></CmsFormField>
    <CmsFormField error={errors.description?.message} htmlFor="role-description" label="Mô tả"><CmsTextarea id="role-description" rows={4} {...register("description")} /></CmsFormField>
  </div>;
}

function RoleDetail({ role }: { role: RoleDetailData }) {
  const permissionIds = role.permissions.map((permission) => permission.id);
  const entries = [["Tên", role.name], ["Mã", role.code], ["Loại", role.isSystem ? "Hệ thống" : "Tùy chỉnh"], ["Mô tả", role.description || "—"], ["Ngày tạo", formatDate(role.createdAt)], ["Cập nhật", formatDate(role.updatedAt)]];
  return <div className={styles.detail}>
    <CmsBadge variant={role.isSystem ? "secondary" : "default"}>{role.isSystem ? "Vai trò hệ thống" : "Vai trò tùy chỉnh"}</CmsBadge>
    <dl>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <section className={styles.section}><div className={styles.sectionHeading}><h2>Quyền đã gán</h2><p>{permissionIds.length} quyền</p></div><RolePermissionsEditor catalog={role.permissions} selectedIds={permissionIds} readOnly /></section>
  </div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className={styles.state} role="alert"><p>{message}</p><CmsButton type="button" variant="outline" onClick={onRetry}>Thử lại</CmsButton></div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
