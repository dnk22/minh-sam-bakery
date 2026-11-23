"use client";

import { Copy, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { useFormValidationFeedback, focusCmsFormIssue } from "@/cms/hooks/use-form-validation-feedback";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { CmsApiError } from "@/cms/lib/api/errors";
import { notify } from "@/cms/lib/notifications";

import { useThemeDetail } from "../../hooks/use-themes";
import { useThemeForm } from "../../hooks/use-theme-form";
import { useThemeMutations } from "../../hooks/use-theme-mutations";
import { themeConfigStatus } from "../../lib/theme-format";
import { formToThemeCreate, formToThemePatch } from "../../schemas/theme.schema";
import type { CmsTheme, ThemeFormValues, ThemeModalState } from "../../types";
import { ThemeDetail } from "../theme-detail/theme-detail";
import { ThemeFields } from "../theme-fields/theme-fields";
import styles from "../theme-ui.module.css";

const FORM_ID = "theme-form";

export function ThemeModal({ state, onStateChange, onDelete }: {
  state: ThemeModalState;
  onStateChange: (state: ThemeModalState) => void;
  onDelete: (theme: CmsTheme) => void;
}) {
  const mode = state?.mode;
  const id = state && "id" in state ? state.id : undefined;
  const detail = useThemeDetail(id);
  const theme = detail.data;
  const { form, markCodeManual } = useThemeForm({ state, theme });
  const mutations = useThemeMutations();
  const [failure, setFailure] = useState<string | null>(null);
  const isEditing = mode === "create" || mode === "edit" || mode === "duplicate";
  const pending = mutations.create.isPending || mutations.update.isPending;
  const onInvalid = useFormValidationFeedback<ThemeFormValues>({ formId: FORM_ID });
  useUnsavedChangesWarning(Boolean(state && isEditing && form.formState.isDirty));
  const confirmDiscard = () => !isEditing || !form.formState.isDirty || window.confirm("Bỏ các thay đổi chưa lưu?");
  const close = () => { setFailure(null); onStateChange(null); };

  const handleBackendError = (error: unknown) => {
    const message = error instanceof CmsApiError ? error.message : "Không thể lưu giao diện lúc này.";
    if (error instanceof CmsApiError) {
      const fields = Object.entries(error.fields ?? {}).filter(([name]) =>
        name === "name" || name === "code" || name === "description" || name.startsWith("config."),
      );
      for (const [name, text] of fields) {
        form.setError(name as FieldPath<ThemeFormValues>, { message: text });
      }
      if (fields[0]) focusCmsFormIssue(FORM_ID, fields[0][0]);
    }
    form.setError("root.server", { message });
    setFailure(message);
  };

  const submit = form.handleSubmit(async (values) => {
    if (pending) return;
    setFailure(null);
    try {
      let saved: CmsTheme | null = null;
      if (mode === "create" || mode === "duplicate") {
        if (mode === "duplicate" && (!theme || !themeConfigStatus(theme).valid)) return;
        saved = await mutations.create.mutateAsync(formToThemeCreate(values));
      } else if (mode === "edit" && theme && !theme.isActive) {
        const input = formToThemePatch(values, theme);
        if (!Object.keys(input).length) { notify.info("Không có thay đổi để lưu."); return; }
        saved = await mutations.update.mutateAsync({ id: theme.id, input });
      }
      if (saved) onStateChange({ mode: "detail", id: saved.id });
    } catch (error) {
      handleBackendError(error);
    }
  }, onInvalid);

  const title = mode === "create" ? "Tạo giao diện mới"
    : mode === "duplicate" ? "Nhân bản giao diện"
    : mode === "edit" ? "Chỉnh sửa giao diện" : "Chi tiết giao diện";
  const configValid = theme ? themeConfigStatus(theme).valid : false;
  const protectedEdit = mode === "edit" && theme?.isActive;
  const unsupported = (mode === "edit" || mode === "duplicate") && theme && !configValid;
  const canEdit = theme && !theme.isActive && configValid;
  const canDuplicate = theme && configValid;

  return (
    <ResponsiveModal
      open={Boolean(state)}
      onOpenChange={(open) => { if (!open && !pending) close(); }}
      onBeforeClose={() => !pending && confirmDiscard()}
      className={styles.modal}
      title={title}
      description={isEditing ? "Tùy chỉnh 14 màu nền tảng và 2 font chữ; chỉ lưu theme chưa kích hoạt." : "Thông tin theme hiện tại từ Backend."}
      footer={!state ? null : isEditing ? <>
        <CmsButton type="button" variant="outline" disabled={pending} onClick={() => { if (confirmDiscard()) close(); }}>Hủy</CmsButton>
        <CmsButton type="submit" form={FORM_ID} disabled={pending || Boolean(protectedEdit || unsupported || (id && !theme))}>
          {pending ? <LoaderCircle aria-hidden="true" size={16} className={styles.spin} /> : null}
          Lưu theme nháp
        </CmsButton>
      </> : theme ? <>
        {canDuplicate ? <CmsButton type="button" variant="outline" onClick={() => onStateChange({ mode: "duplicate", id: theme.id })}>
          <Copy size={16} aria-hidden="true" /> Nhân bản
        </CmsButton> : null}
        {canEdit ? <CmsButton type="button" onClick={() => onStateChange({ mode: "edit", id: theme.id })}>
          <Pencil size={16} aria-hidden="true" /> Chỉnh sửa
        </CmsButton> : null}
        {!theme.isActive ? <CmsButton type="button" variant="destructive" onClick={() => onDelete(theme)}>
          <Trash2 size={16} aria-hidden="true" /> Xóa
        </CmsButton> : null}
      </> : null}
    >
      {!state ? null : id && detail.isLoading ? <p className={styles.state}>Đang tải chi tiết theme…</p>
        : id && detail.error ? <div className={styles.state} role="alert">
          <p>{detail.error.message}</p>
          <CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton>
        </div>
        : mode === "detail" && theme ? <ThemeDetail theme={theme} />
        : protectedEdit ? <p className={styles.alert} role="alert">Theme đang hoạt động không thể chỉnh sửa trực tiếp. Hãy nhân bản để tạo một theme mới.</p>
        : unsupported ? <p className={styles.alert} role="alert">Config legacy hoặc lỗi không thể chỉnh sửa/nhân bản tự động. Vui lòng tạo theme V1 mới.</p>
        : isEditing && (mode === "create" || theme) ? (
          <form id={FORM_ID} className={styles.form} noValidate onSubmit={submit} onChange={() => { form.clearErrors("root.server"); setFailure(null); }}>
            <ThemeFields form={form} onCodeManual={markCodeManual} />
            {failure || form.formState.errors.root?.server?.message ?
              <p className={styles.alert} role="alert">{failure || form.formState.errors.root?.server?.message}</p> : null}
            <p className={styles.note}>Theme chưa kích hoạt sẽ không làm thay đổi Landing. Không hỗ trợ chỉnh layout, spacing hoặc các derived tokens.</p>
          </form>
        ) : <p className={styles.state}>Không tìm thấy theme.</p>}
    </ResponsiveModal>
  );
}
