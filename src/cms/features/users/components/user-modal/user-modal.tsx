"use client";
import { useCmsConfirm } from "@/cms/context/cms-confirm";


import { KeyRound, LoaderCircle, Lock, Pencil, Trash2, Unlock } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { useRoleSelector } from "@/cms/features/roles/hooks/use-roles";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { focusCmsFormIssue, useFormValidationFeedback } from "@/cms/hooks/use-form-validation-feedback";
import { notify } from "@/cms/lib/notifications";

import { getUserStatusPresentation, statusAction } from "../../constants";
import { useUserForm } from "../../hooks/use-user-form";
import { useUserMutations } from "../../hooks/use-user-mutations";
import { useUserDetail } from "../../hooks/use-users";
import { formToCreate, formToPatch } from "../../schemas/user.schema";
import type { CmsUser, UserAction, UserFormValues, UserModalState } from "../../types";
import { UserFields } from "../user-fields/user-fields";
import styles from "./user-modal.module.css";

export function UserModal({ state, currentUserId, onStateChange, onAction }: {
  state: UserModalState;
  currentUserId: string;
  onStateChange: (state: UserModalState) => void;
  onAction: (user: CmsUser, action: UserAction) => void;
}) {
  const askConfirm = useCmsConfirm();
  const mode = state?.mode ?? "detail";
  const detail = useUserDetail(state?.id);
  const user = detail.data;
  const form = useUserForm({ state, user });
  const onInvalid = useFormValidationFeedback<UserFormValues>({ formId: "user-form" });
  const mutations = useUserMutations(currentUserId);
  const manageRole = mode === "detail" && state?.section === "role";
  const roles = useRoleSelector(Boolean(state) && (mode === "create" || manageRole));
  const roleSession = manageRole ? `${state?.id ?? ""}:${user?.role.id ?? "pending"}` : "closed";
  const [roleState, setRoleState] = useState({ session: "closed", value: "" });
  if (roleState.session !== roleSession) setRoleState({ session: roleSession, value: manageRole && user ? user.role.id : "" });
  const selectedRole = roles.data?.find((role) => role.id === roleState.value);
  const roleDirty = Boolean(manageRole && user && roleState.value && roleState.value !== user.role.id);
  const isEditing = mode === "create" || mode === "edit";
  useUnsavedChangesWarning((isEditing && form.formState.isDirty) || roleDirty);
  const pending = mutations.create.isPending || mutations.update.isPending;

  const confirmDiscard = async () => !pending && !mutations.assignRole.isPending && (((!isEditing || !form.formState.isDirty) && !roleDirty) || await askConfirm({ title: "Bỏ thay đổi?", message: "Bỏ các thay đổi chưa lưu?", confirmLabel: "Bỏ thay đổi", destructive: true }));
  const close = () => onStateChange(null);
  const setFormError = (error: unknown, fallback: string) => {
    if (error instanceof CmsApiError) {
      const fields = Object.entries(error.fields ?? {}).filter(([field]) => field in form.getValues());
      fields.forEach(([field, message], index) => {
        form.setError(field as keyof UserFormValues, { message }, { shouldFocus: index === 0 });
      });
      form.setError("root.server", { message: error.message });
      if (fields[0]) focusCmsFormIssue("user-form", fields[0][0]);
    } else form.setError("root.server", { message: fallback });
  };
  const submit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const saved = await mutations.create.mutateAsync(formToCreate(values));
        onStateChange({ mode: "detail", id: saved.id });
      } else if (mode === "edit" && user) {
        const patch = formToPatch(values, user);
        if (!Object.keys(patch).length) {
          notify.info("Không có thay đổi để lưu.", "user-no-changes");
          return;
        }
        const saved = await mutations.update.mutateAsync({ id: user.id, input: patch });
        form.reset({ ...values, password: "" });
        onStateChange({ mode: "detail", id: saved.id });
      }
    } catch (error) { setFormError(error, "Không thể lưu tài khoản lúc này."); }
  }, onInvalid);
  const submitRole = async () => {
    if (!user || !selectedRole || !roleDirty || mutations.assignRole.isPending) return;
    const selfWarning = user.id === currentUserId ? " Đây là tài khoản bạn đang sử dụng; quyền truy cập hiện tại có thể thay đổi ngay." : "";
    if (!await askConfirm({ title: "Gán vai trò", message: `Gán vai trò “${selectedRole.name} (${selectedRole.code})” cho ${user.fullName}?${selfWarning}`, confirmLabel: "Gán vai trò" })) return;
    try {
      await mutations.assignRole.mutateAsync({ id: user.id, roleId: selectedRole.id });
      onStateChange({ mode: "detail", id: user.id });
    } catch {
      // Mutation error is rendered while the selected role remains available.
    }
  };

  const title = mode === "create" ? "Thêm tài khoản" : mode === "edit" ? "Chỉnh sửa tài khoản" : manageRole ? "Gán vai trò" : "Chi tiết tài khoản";
  return <ResponsiveModal
    size="lg"
    description={manageRole ? "Chọn vai trò và quyền truy cập mới cho tài khoản." : mode === "detail" ? "Thông tin hiện tại của tài khoản." : "Mật khẩu không được hiển thị lại sau khi lưu."}
    footer={state ? mode === "detail" && user && !manageRole ? <DetailActions user={user} currentUserId={currentUserId} onEdit={() => onStateChange({ mode: "edit", id: user.id })} onRole={() => onStateChange({ mode: "detail", id: user.id, section: "role" })} onAction={onAction} />
      : <CmsButton type="button" variant="outline" disabled={pending || mutations.assignRole.isPending} onClick={async () => {
        if (!await confirmDiscard()) return;
        if (manageRole && user) onStateChange({ mode: "detail", id: user.id });
        else close();
      }}>{manageRole ? "Quay lại" : "Đóng"}</CmsButton> : null}
    onBeforeClose={confirmDiscard}
    onOpenChange={(open) => { if (!open) close(); }}
    open={Boolean(state)}
    title={title}
  >
    {!state ? null : (mode === "edit" || mode === "detail") && detail.isLoading ? <p className={styles.state}>Đang tải tài khoản…</p>
      : detail.error ? <ErrorState message={detail.error instanceof Error ? detail.error.message : "Không thể tải tài khoản."} onRetry={() => detail.refetch()} />
      : manageRole && user ? <section className={styles.roleSection}>
        <div className={styles.currentRole}><span>Vai trò hiện tại</span><strong>{user.role.name}</strong><code>{user.role.code}</code></div>
        <CmsFormField
          description={roles.error ? "Không thể tải đầy đủ danh sách vai trò. Hãy thử lại trước khi lưu." : undefined}
          htmlFor="assign-user-role"
          label="Vai trò mới"
        >
          <CmsSelect
            disabled={roles.isLoading || Boolean(roles.error) || roles.data?.length === 0}
            id="assign-user-role"
            options={[{ value: "", label: roles.isLoading ? "Đang tải vai trò…" : roles.error ? "Không thể tải vai trò" : roles.data?.length ? "Chọn vai trò" : "Chưa có vai trò" }, ...(roles.data ?? []).map((role) => ({ value: role.id, label: `${role.name} (${role.code})` }))]}
            value={roleState.value}
            onChange={(event) => setRoleState((current) => ({ ...current, value: event.target.value }))}
          />
        </CmsFormField>
        {roles.error ? <CmsButton type="button" variant="outline" onClick={() => roles.refetch()}>Thử tải lại vai trò</CmsButton> : null}
        {mutations.assignRole.error ? <p className={styles.alert} role="alert">{mutations.assignRole.error instanceof Error ? mutations.assignRole.error.message : "Không thể gán vai trò."}</p> : null}
        <CmsButton type="button" disabled={!roleDirty || !selectedRole || roles.isLoading || Boolean(roles.error) || mutations.assignRole.isPending} onClick={submitRole}>{mutations.assignRole.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xác nhận gán vai trò</CmsButton>
      </section>
      : mode === "detail" && user ? <UserDetail user={user} currentUserId={currentUserId} />
      : isEditing ? <form className={styles.form} id="user-form" noValidate onChange={() => form.clearErrors("root.server")} onSubmit={submit}>
        <UserFields form={form} mode={mode} />
        {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
        <CmsButton type="submit" disabled={pending || (mode === "edit" && !form.formState.isDirty) || (mode === "create" && (!roles.isSuccess || roles.data.length === 0))}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}{mode === "create" ? "Tạo tài khoản" : "Lưu thông tin"}</CmsButton>
      </form> : <p className={styles.state}>Không tìm thấy tài khoản.</p>}
  </ResponsiveModal>;
}

function DetailActions({ user, currentUserId, onEdit, onRole, onAction }: { user: CmsUser; currentUserId: string; onEdit: () => void; onRole: () => void; onAction: (user: CmsUser, action: UserAction) => void }) {
  const action = statusAction(user.status);
  const self = user.id === currentUserId;
  return <>
    <CmsButton type="button" variant="outline" disabled={self} title={self ? "Không thể tự xóa tài khoản đang sử dụng." : undefined} onClick={() => onAction(user, "delete")}><Trash2 aria-hidden="true" size={16} /> Xóa</CmsButton>
    <CmsButton type="button" variant="outline" disabled={self && action === "lock"} title={self && action === "lock" ? "Không thể tự khóa tài khoản đang sử dụng." : undefined} onClick={() => onAction(user, action)}>{action === "lock" ? <Lock aria-hidden="true" size={16} /> : <Unlock aria-hidden="true" size={16} />}{action === "lock" ? "Khóa" : "Mở khóa"}</CmsButton>
    <CmsButton type="button" variant="outline" onClick={onRole}><KeyRound aria-hidden="true" size={16} /> Gán vai trò</CmsButton>
    <CmsButton type="button" onClick={onEdit}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</CmsButton>
  </>;
}

function UserDetail({ user, currentUserId }: { user: CmsUser; currentUserId: string }) {
  const status = getUserStatusPresentation(user.status);
  const entries = [["Họ tên", user.fullName], ["Email", user.email], ["Vai trò", `${user.role.name} (${user.role.code})`], ["Ngày tạo", formatDate(user.createdAt)], ["Cập nhật", formatDate(user.updatedAt)]];
  return <div className={styles.detail}>
    <div className={styles.badges}><CmsBadge variant={status.variant}>{status.label}</CmsBadge>{user.id === currentUserId ? <CmsBadge variant="secondary">Tài khoản hiện tại</CmsBadge> : null}</div>
    <dl>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {user.id === currentUserId ? <p className={styles.note}>Thay đổi email, mật khẩu hoặc vai trò của tài khoản hiện tại có thể yêu cầu xác thực lại.</p> : null}
  </div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className={styles.state} role="alert"><p>{message}</p><CmsButton type="button" variant="outline" onClick={onRetry}>Thử lại</CmsButton></div>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
