"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatVnd } from "@/landing/features/catalog/pricing";
import type { PaymentQrState } from "../hooks/use-payment-qr";
import { CheckoutDialog } from "./checkout-dialog";
import { PaymentQrLoading } from "./payment-qr/payment-qr-loading";
import { PaymentQrUnavailable } from "./payment-qr/payment-qr-unavailable";
import { PaymentQrImage } from "./payment-qr/payment-qr-image";
import { PaymentQrDetails } from "./payment-qr/payment-qr-details";

export function CheckoutTransferModal({ qr, onQrUnavailable, total, pending, blocked, error, onClose, onConfirm }: {
  qr: PaymentQrState; onQrUnavailable: () => void;
  total: number; pending: boolean; blocked: boolean; error: string; onClose: () => void; onConfirm: () => void;
}) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "failed">("loading");
  const unavailable = qr.status === "unavailable" || imageState === "failed";
  const canConfirm = qr.status === "ready" && imageState === "loaded" && !pending && !blocked;
  return <CheckoutDialog title="Thanh toán chuyển khoản" description="Kiểm tra thông tin chuyển khoản trước khi gửi đơn đặt bánh." onClose={onClose} busy={pending}>
    {unavailable ? <PaymentQrUnavailable onClose={onClose} /> : <>
      {qr.status === "loading" ? <PaymentQrLoading /> : qr.status === "ready" ? <section className="mt-space-md space-y-3 rounded-xl bg-surface-container-low p-4">
        <div className="flex justify-between gap-3"><span>Tạm tính tiền bánh</span><strong className="font-price-serif text-primary">{formatVnd(total)}</strong></div>
        <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-3">
          <PaymentQrImage url={qr.config.qrImageUrl} loaded={imageState === "loaded"} onLoad={() => setImageState("loaded")} onError={() => { setImageState("failed"); onQrUnavailable(); }} />
          <p className="text-center font-body-sm text-on-surface-variant">Quét mã QR bằng ứng dụng ngân hàng.</p>
        </div>
        <PaymentQrDetails config={qr.config} />
        <p className="font-body-sm text-body-sm text-on-surface-variant">Vui lòng đối chiếu thông tin người nhận trước khi chuyển khoản. Phí giao hàng (nếu có) sẽ được cửa hàng xác nhận. Cửa hàng sẽ kiểm tra giao dịch sau khi nhận đơn.</p>
      </section> : null}
      {error && <p role="alert" className="mt-3 font-body-sm text-error">{error}</p>}
      <button type="button" disabled={!canConfirm} onClick={() => { if (canConfirm) onConfirm(); }} className="mt-space-md flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-ui font-semibold text-on-primary disabled:opacity-50"><CheckCircle2 className="size-5" />{pending ? "Đang gửi đơn..." : "Xác nhận đặt hàng"}</button>
      <button type="button" disabled={pending} onClick={onClose} className="mt-3 min-h-11 w-full text-secondary underline">Xem lại thông tin đơn hàng</button>
    </>}
  </CheckoutDialog>;
}
