"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { PAYMENT_PROOF_ACCEPT } from "@/lib/contracts/order/payment-proof";
import type { PaymentUpload } from "../../hooks/use-payment-upload";

function LocalPreview({ file }: { file: File }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    const url = URL.createObjectURL(file);
    image.src = url;
    return () => { image.removeAttribute("src"); URL.revokeObjectURL(url); };
  }, [file]);
  return <img ref={ref} alt="Ảnh chứng từ đã chọn" className="max-h-44 w-full rounded-lg object-contain" />;
}

export function PaymentProofUpload({ upload, disabled }: { upload: PaymentUpload; disabled: boolean }) {
  return <section aria-labelledby="payment-proof-title" className="mt-space-md space-y-2">
    <h3 id="payment-proof-title" className="font-label-ui font-semibold text-primary">Ảnh chứng từ chuyển khoản <span className="text-error">*</span></h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant">Tải ảnh giao dịch thành công để cửa hàng đối soát. Chỉ gửi thông tin liên quan đến giao dịch này.</p>
    {upload.file ? <div className="space-y-2 rounded-lg border border-outline-variant p-3">
      <LocalPreview file={upload.file} />
      <p className="break-all font-body-sm text-body-sm">{upload.file.name}</p>
      {upload.status === "uploading" ? <p role="status" className="flex items-center gap-2 text-secondary"><LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />Đang tải ảnh...</p> : null}
      {upload.status === "ready" ? <p role="status" className="flex items-center gap-2 font-body-sm text-primary"><CheckCircle2 className="size-4" aria-hidden="true" />Đã tải ảnh chứng từ.</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        {upload.status === "failed" ? <button type="button" disabled={disabled} onClick={upload.retry} className="min-h-10 text-primary underline disabled:opacity-50">Thử lại</button> : null}
        <button type="button" disabled={disabled} onClick={upload.clear} className="flex min-h-10 items-center gap-1 text-error disabled:opacity-50"><Trash2 className="size-4" aria-hidden="true" />Xóa ảnh</button>
      </div>
    </div> : null}
    <label className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-outline-variant p-3 text-center text-primary focus-within:ring-2 focus-within:ring-primary ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <ImagePlus aria-hidden="true" className="size-5" />
      <span className="font-label-ui font-semibold">{upload.file ? "Thay ảnh" : "Chọn ảnh chứng từ"}</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">JPG, PNG, WebP · tối đa 4 MB</span>
      <input type="file" accept={PAYMENT_PROOF_ACCEPT} disabled={disabled} className="sr-only" onChange={event => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (file) void upload.select(file);
      }} />
    </label>
    {upload.error ? <p role="alert" className="font-body-sm text-body-sm text-error">{upload.error}</p> : null}
  </section>;
}
