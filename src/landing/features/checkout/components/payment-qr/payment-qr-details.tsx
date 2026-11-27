"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { QrPaymentConfig } from "@/lib/contracts/qr-payment/qr-payment.types";

function PaymentDetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
      <dt className="min-w-0 text-on-surface-variant">{label}</dt>
      <dd className="min-w-0 text-right font-semibold [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

function CopyAccountNumber({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyAccountNumber() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const copied = status === "copied";

  return (
    <>
      <div className="flex min-w-0 items-center justify-end gap-1">
        <span className="min-w-0 select-text [overflow-wrap:anywhere]">{value}</span>
        <button
          type="button"
          aria-label="Sao chép số tài khoản"
          title={copied ? "Đã sao chép" : "Sao chép số tài khoản"}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-secondary hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => void copyAccountNumber()}
        >
          {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
        </button>
      </div>
      <span role="status" className={status === "failed" ? "block text-body-sm font-normal text-error" : "sr-only"}>
        {copied ? "Đã sao chép số tài khoản." : status === "failed" ? "Không thể sao chép. Vui lòng chọn và sao chép số tài khoản thủ công." : ""}
      </span>
    </>
  );
}

export function PaymentQrDetails({ config }: { config: QrPaymentConfig }) {
  return (
    <dl className="space-y-2 font-body-md text-body-md">
      <PaymentDetailRow label="Ngân hàng">{config.bankName}</PaymentDetailRow>
      <PaymentDetailRow label="Chủ tài khoản">{config.accountHolder}</PaymentDetailRow>
      <PaymentDetailRow label="Số tài khoản">
        <CopyAccountNumber key={config.accountNumber} value={config.accountNumber} />
      </PaymentDetailRow>
      {config.bankBranch ? <PaymentDetailRow label="Chi nhánh">{config.bankBranch}</PaymentDetailRow> : null}
    </dl>
  );
}
