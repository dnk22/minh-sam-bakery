"use client";

import { useRef, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { useFormValidationFeedback, focusCmsFormIssue } from "@/cms/hooks/use-form-validation-feedback";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useSystemConfigMutations } from "@/cms/features/system-configs/hooks/use-system-config-mutations";
import type { SystemConfig } from "@/cms/features/system-configs/types";
import { fetchQrPayment } from "../../hooks/use-qr-payment";
import { useQrPaymentForm } from "../../hooks/use-qr-payment-form";
import { qrPaymentSchema } from "../../schemas/qr-payment.schema";
import { createQrPaymentInput, updateQrPaymentInput, readQrPaymentValue } from "../../utils/qr-payment-data";
import type { QrPaymentConfig } from "../../types";
import { QrPaymentFields } from "../qr-payment-fields/qr-payment-fields";
import styles from "./qr-payment-modal.module.css";

const FORM_ID = "qr-payment-form";

export function QrPaymentModal({ config, onClose, onSaved, onConflict }: {
  config?: SystemConfig; onClose: () => void; onSaved: () => void; onConflict: () => void;
}) {
  const { form, uploadPending, setUploadPending } = useQrPaymentForm(config);
  const mutations = useSystemConfigMutations();
  const submitting = useRef(false);
  const [checking, setChecking] = useState(false);
  const pending = checking || mutations.create.isPending || mutations.update.isPending;
  const onInvalid = useFormValidationFeedback<QrPaymentConfig>({ formId: FORM_ID });
  useUnsavedChangesWarning(form.formState.isDirty || uploadPending);
  const invalidStored = config && !qrPaymentSchema.safeParse(readQrPaymentValue(config.value)).success;
  const confirmDiscard = () => !pending && !submitting.current && ((!form.formState.isDirty && !uploadPending) || window.confirm("Bỏ các thay đổi hoặc ảnh đang chờ upload?"));

  const save = async (values: QrPaymentConfig) => {
    if (submitting.current || pending) return;
    if (uploadPending) {
      form.setError("root.server", { message: "Hãy tải ảnh đã chọn lên trước khi lưu." });
      focusCmsFormIssue(FORM_ID, "__upload__");
      return;
    }
    submitting.current = true;
    setChecking(true);
    try {
      const matches = await fetchQrPayment();
      if ((!config && matches.length !== 0) || (config && (matches.length !== 1 || matches[0].id !== config.id || matches[0].updatedAt !== config.updatedAt || matches[0].value !== config.value))) {
        form.setError("root.server", { message: "Cấu hình đã thay đổi. Hãy đóng biểu mẫu và mở lại để cập nhật dữ liệu mới nhất." });
        onConflict();
        return;
      }
      if (config) await mutations.update.mutateAsync({ id: config.id, input: updateQrPaymentInput(values) });
      else await mutations.create.mutateAsync(createQrPaymentInput(values));
      form.reset(values);
      onSaved();
    } catch (error) {
      if (error instanceof CmsApiError && error.status === 409) {
        onConflict();
        form.setError("root.server", { message: "Cấu hình đã tồn tại hoặc vừa thay đổi. Hãy mở lại biểu mẫu." });
      } else form.setError("root.server", { message: error instanceof Error ? error.message : "Không thể lưu thông tin QR." });
    } finally { submitting.current = false; setChecking(false); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { void form.handleSubmit(save, onInvalid)(event); };

  return <ResponsiveModal open onOpenChange={open => { if (!open) onClose(); }} onBeforeClose={confirmDiscard}
    title={config ? "Chỉnh sửa QR thanh toán" : "Thêm QR thanh toán"}
    description="Thông tin chuyển khoản sẽ được sử dụng trên storefront."
    footer={<><CmsButton type="button" variant="outline" disabled={pending} onClick={() => { if (confirmDiscard()) onClose(); }}>Hủy</CmsButton>
      <CmsButton type="submit" form={FORM_ID} disabled={pending || uploadPending}>{pending ? <LoaderCircle aria-hidden="true" size={16} className={styles.spin} /> : null}Lưu thông tin</CmsButton></>}>
    <form id={FORM_ID} className={styles.form} noValidate onSubmit={submit} onChange={() => form.clearErrors("root.server")}>
      {invalidStored ? <p className={styles.alert} role="alert">Dữ liệu hiện tại không hợp lệ. Kiểm tra và nhập lại thông tin trước khi lưu.</p> : null}
      <QrPaymentFields form={form} saving={pending} onUploadPending={setUploadPending} />
      {form.formState.errors.root?.server?.message ? <p className={styles.alert} role="alert">{form.formState.errors.root.server.message}</p> : null}
    </form>
  </ResponsiveModal>;
}
