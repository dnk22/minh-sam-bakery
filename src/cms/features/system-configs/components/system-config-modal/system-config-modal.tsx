"use client";
import { useCmsConfirm } from "@/cms/context/cms-confirm";


import { LoaderCircle, Pencil, Trash2 } from "lucide-react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import { focusCmsFormIssue, useFormValidationFeedback } from "@/cms/hooks/use-form-validation-feedback";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { CmsApiError } from "@/cms/lib/api/errors";
import { notify } from "@/cms/lib/notifications";

import { useSystemConfigForm } from "../../hooks/use-system-config-form";
import { useSystemConfigMutations } from "../../hooks/use-system-config-mutations";
import { useSystemConfigDetail } from "../../hooks/use-system-configs";
import { formToSystemConfigCreate, formToSystemConfigPatch } from "../../schemas/system-config.schema";
import type { SystemConfig, SystemConfigFormValues, SystemConfigModalState } from "../../types";
import styles from "./system-config-modal.module.css";

const FORM_ID = "system-config-form";

export function SystemConfigModal({ state, onStateChange, onDelete }: { state: SystemConfigModalState; onStateChange: (state: SystemConfigModalState) => void; onDelete: (config: SystemConfig) => void }) {
  const askConfirm = useCmsConfirm();
  const mode = state?.mode ?? "detail";
  const detail = useSystemConfigDetail(state && "id" in state ? state.id : undefined);
  const config = detail.data;
  const form = useSystemConfigForm({ state, config });
  const mutations = useSystemConfigMutations();
  const isEditing = mode === "create" || mode === "edit";
  const onInvalid = useFormValidationFeedback<SystemConfigFormValues>({ formId: FORM_ID });
  const pending = mutations.create.isPending || mutations.update.isPending;
  useUnsavedChangesWarning(isEditing && form.formState.isDirty);

  const close = () => onStateChange(null);
  const confirmDiscard = async () => !pending && (!isEditing || !form.formState.isDirty || await askConfirm({ title: "Bỏ thay đổi?", message: "Bỏ các thay đổi chưa lưu?", confirmLabel: "Bỏ thay đổi", destructive: true }));
  const setBackendError = (error: unknown) => {
    if (error instanceof CmsApiError) {
      const fields = Object.entries(error.fields ?? {}).filter(([field]) => field in form.getValues());
      fields.forEach(([field, message], index) => form.setError(field as keyof SystemConfigFormValues, { message }, { shouldFocus: index === 0 }));
      form.setError("root.server", { message: error.message });
      if (fields[0]) focusCmsFormIssue(FORM_ID, fields[0][0]);
    } else form.setError("root.server", { message: "Không thể lưu cấu hình lúc này." });
  };
  const submit = form.handleSubmit(async (values) => {
    try {
      let saved: SystemConfig | null = null;
      if (mode === "create") saved = await mutations.create.mutateAsync(formToSystemConfigCreate(values));
      else if (config) {
        const patch = formToSystemConfigPatch(values, config);
        if (!Object.keys(patch).length) { notify.info("Không có thay đổi để lưu.", "system-config-no-changes"); return; }
        saved = await mutations.update.mutateAsync({ id: config.id, input: patch });
      }
      if (saved) onStateChange({ mode: "detail", id: saved.id });
    } catch (error) { setBackendError(error); }
  }, onInvalid);

  const title = mode === "create" ? "Thêm cấu hình" : mode === "edit" ? "Chỉnh sửa cấu hình" : "Chi tiết cấu hình";
  return <ResponsiveModal open={Boolean(state)} onOpenChange={(open) => { if (!open) close(); }} onBeforeClose={confirmDiscard} title={title}
    description={mode === "detail" ? "Giá trị đầy đủ đang lưu trên hệ thống." : "Nhập giá trị cấu hình dưới dạng văn bản."} className={styles.modal}
    footer={state ? isEditing ? <><CmsButton type="button" variant="outline" disabled={pending} onClick={async () => { if (await confirmDiscard()) close(); }}>Hủy</CmsButton>
      <CmsButton type="submit" form={FORM_ID} disabled={pending}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Lưu cấu hình</CmsButton></>
      : config ? <><CmsButton type="button" variant="outline" onClick={() => onDelete(config)}><Trash2 aria-hidden="true" size={16} /> Xóa</CmsButton>
        <CmsButton type="button" onClick={() => onStateChange({ mode: "edit", id: config.id })}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</CmsButton></> : null : null}>
    {!state ? null : (mode === "edit" || mode === "detail") && detail.isLoading ? <p className={styles.state}>Đang tải chi tiết…</p>
      : detail.error ? <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải chi tiết."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div>
      : mode === "detail" && config ? <SystemConfigDetail config={config} />
      : isEditing ? <form id={FORM_ID} className={styles.form} noValidate onChange={() => form.clearErrors("root.server")} onSubmit={submit}>
        <CmsFormField fieldName="key" htmlFor="system-config-key" label="Khóa cấu hình" required error={form.formState.errors.key?.message}
          description={mode === "edit" ? "Khóa cấu hình không thể thay đổi sau khi tạo." : undefined}>
          <CmsInput id="system-config-key" autoComplete="off" readOnly={mode === "edit"} {...form.register("key")} />
        </CmsFormField>
        <CmsFormField fieldName="value" htmlFor="system-config-value" label="Giá trị" required error={form.formState.errors.value?.message}>
          <CmsTextarea id="system-config-value" rows={8} {...form.register("value")} />
        </CmsFormField>
        <CmsFormField fieldName="description" htmlFor="system-config-description" label="Mô tả" error={form.formState.errors.description?.message}>
          <CmsTextarea id="system-config-description" rows={3} {...form.register("description")} />
        </CmsFormField>
        {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
      </form> : <p className={styles.state}>Không tìm thấy cấu hình.</p>}
  </ResponsiveModal>;
}

function SystemConfigDetail({ config }: { config: SystemConfig }) {
  const entries = [["Khóa", config.key], ["Mô tả", config.description || "—"], ["Ngày tạo", formatDate(config.createdAt)], ["Cập nhật", formatDate(config.updatedAt)]];
  return <div className={styles.detail}><dl>{entries.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    <div><dt>Giá trị</dt><dd><pre>{config.value}</pre></dd></div></dl></div>;
}
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date); }
