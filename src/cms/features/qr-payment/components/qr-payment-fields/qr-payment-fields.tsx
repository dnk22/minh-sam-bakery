"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/cms/components/image-upload/image-upload";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { QR_PAYMENT_UPLOAD_FOLDER } from "../../constants";
import type { QrPaymentConfig } from "../../types";

const fields = [
  { name: "bankName", label: "Ngân hàng", required: true, maxLength: 200 },
  { name: "accountNumber", label: "Số tài khoản", required: true, maxLength: 100 },
  { name: "accountHolder", label: "Chủ tài khoản", required: true, maxLength: 200 },
  { name: "bankBranch", label: "Chi nhánh ngân hàng", required: false, maxLength: 200 },
] as const;

export function QrPaymentFields({ form, saving, onUploadPending }: { form: UseFormReturn<QrPaymentConfig>; saving: boolean; onUploadPending: (pending: boolean) => void }) {
  return <>
    {fields.map(({ name, label, required, maxLength }) => <CmsFormField key={name} fieldName={name} htmlFor={`qr-payment-${name}`} label={label} required={required} error={form.formState.errors[name]?.message}>
      <CmsInput id={`qr-payment-${name}`} autoComplete="off" disabled={saving} maxLength={maxLength} {...form.register(name)} />
    </CmsFormField>)}
    <CmsFormField fieldName="qrImageUrl" label="Mã QR thanh toán" required error={form.formState.errors.qrImageUrl?.message}>
      <Controller control={form.control} name="qrImageUrl" render={({ field }) => <ImageUpload
        folder={QR_PAYMENT_UPLOAD_FOLDER} disabled={saving} altText="Mã QR thanh toán"
        value={field.value || null} onChange={url => field.onChange(url ?? "")} onPendingChange={onUploadPending}
      />} />
    </CmsFormField>
  </>;
}
