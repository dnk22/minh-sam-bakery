"use client";
import { CheckCircle2 } from "lucide-react";
import { formatVnd } from "@/landing/features/catalog/pricing";
import { CheckoutDialog } from "./checkout-dialog";

export function CheckoutTransferModal({ total, pending, blocked, error, onClose, onConfirm }: {
  total: number; pending: boolean; blocked: boolean; error: string; onClose: () => void; onConfirm: () => void;
}) {
  return <CheckoutDialog title="Thanh toán chuyển khoản" description="Xác nhận thông tin chuyển khoản để gửi đơn đặt bánh." onClose={onClose} busy={pending}>
    <section className="mt-space-md space-y-3 rounded-xl bg-surface-container-low p-4">
      <div className="flex justify-between gap-3"><span>Tạm tính tiền bánh</span><strong className="font-price-serif text-primary">{formatVnd(total)}</strong></div>
      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-3"><IllustrativeQr />
      <p className="text-center font-body-sm text-error">QR minh họa — không dùng để thanh toán.</p></div>
      <dl className="space-y-2 font-body-sm text-body-sm"><div className="flex justify-between"><dt>Ngân hàng</dt><dd>Chưa cấu hình</dd></div><div className="flex justify-between"><dt>Chủ tài khoản</dt><dd>Chưa cấu hình</dd></div><div className="flex justify-between"><dt>Số tài khoản</dt><dd>Chưa cấu hình</dd></div></dl>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Chế độ thử nghiệm: chưa có giao dịch thực tế, chưa xác minh thanh toán. Phí giao hàng (nếu có) sẽ được cửa hàng xác nhận.</p>
    </section>
    {error && <p role="alert" className="mt-3 font-body-sm text-error">{error}</p>}
    <button type="button" disabled={pending || blocked} onClick={onConfirm} className="mt-space-md flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-ui font-semibold text-on-primary disabled:opacity-50"><CheckCircle2 className="size-5" />{pending ? "Đang gửi đơn..." : "Xác nhận thanh toán (thử nghiệm)"}</button>
    <button type="button" disabled={pending} onClick={onClose} className="mt-3 w-full text-secondary underline">Xem lại thông tin đơn hàng</button>
  </CheckoutDialog>;
}
function IllustrativeQr() {
  return <div className="relative flex size-48 items-center justify-center rounded-lg bg-surface-container-lowest p-2 text-primary"><svg aria-label="Mã QR minh họa" className="h-full w-full" fill="none" role="img" viewBox="0 0 160 160"><g stroke="currentColor" strokeWidth="4"><rect height="40" rx="4" width="40" x="8" y="8" /><rect height="40" rx="4" width="40" x="112" y="8" /><rect height="40" rx="4" width="40" x="8" y="112" /></g><g fill="currentColor"><rect height="20" rx="2" width="20" x="18" y="18" /><rect height="20" rx="2" width="20" x="122" y="18" /><rect height="20" rx="2" width="20" x="18" y="122" /><rect height="16" width="8" x="56" y="12" /><rect height="8" width="12" x="72" y="8" /><rect height="10" width="10" x="92" y="16" /><rect height="10" width="10" x="12" y="56" /><rect height="6" width="14" x="30" y="60" /><rect height="16" width="8" x="16" y="80" /><rect height="12" width="12" x="36" y="78" /><rect height="20" width="8" x="116" y="60" /><rect height="8" width="14" x="132" y="72" /><rect height="12" width="18" x="120" y="90" /><rect height="12" width="12" x="56" y="116" /><rect height="18" width="8" x="76" y="124" /><rect height="8" width="12" x="92" y="112" /><rect height="8" width="22" x="112" y="136" /><rect height="14" width="10" x="140" y="120" /><rect height="8" width="8" x="52" y="52" /><rect height="8" width="8" x="100" y="52" /><rect height="8" width="8" x="52" y="100" /><rect height="8" width="8" x="100" y="100" /></g></svg><div className="absolute flex size-14 flex-col items-center justify-center rounded-full bg-primary-container text-center shadow-md"><span className="text-[7px] leading-none tracking-widest text-secondary-fixed">SINCE 1932</span><span className="font-headline-sm text-[12px] font-bold text-surface">M.S</span><span className="text-[6px] uppercase tracking-wider text-secondary-fixed">Hà Nội</span></div></div>;
}
