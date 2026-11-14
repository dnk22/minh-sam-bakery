"use client";

import { Check, CheckCircle2, Clock3, Copy, Download, ReceiptText, X } from "lucide-react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import type { CheckoutDraft, CheckoutLineItem, CheckoutReceipt } from "../types";
import { formatVnd } from "./checkout-product-summary";

export function CheckoutTransferDrawer({ dialogRef, draft, item, onBack, onClose, receipt }: { dialogRef: RefObject<HTMLElement | null>; draft: CheckoutDraft; item: CheckoutLineItem; onBack: () => void; onClose: () => void; receipt: CheckoutReceipt }) {
  const total = item.unitPrice * item.quantity;
  const [toast, setToast] = useState<string>();
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  async function copyText(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(message);
    } catch {
      showToast("Không thể sao chép tự động");
    }
  }

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(undefined), 2400);
  }

  return (
    <aside aria-labelledby="transfer-title" aria-modal="true" className="fixed top-0 right-0 bottom-0 z-[71] flex h-dvh w-full max-w-[520px] flex-col overflow-hidden border-l border-outline-variant/30 bg-surface text-on-surface shadow-2xl" ref={dialogRef} role="dialog">
      <header className="flex shrink-0 items-start justify-between border-b border-outline-variant/30 px-5 pt-5 pb-4 md:px-7 md:pt-7"><div><span className="font-label-eyebrow text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Minh Sâm Bakery</span><h2 className="mt-1 font-headline-md text-[28px] leading-9 font-medium text-primary" id="transfer-title">Thanh toán chuyển khoản</h2></div><button aria-label="Đóng bảng hướng dẫn" className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary" data-autofocus onClick={onClose} type="button"><X className="size-5" /></button></header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-7">
        <section className="flex items-center justify-between rounded-lg bg-surface-container p-4"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 font-label-eyebrow text-[10px] font-semibold uppercase tracking-wider text-on-secondary-fixed"><span className="size-1.5 rounded-full bg-secondary" />Chờ thanh toán</span><p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Vui lòng chuyển khoản theo thông tin bên dưới.</p></div><span className="flex size-10 items-center justify-center rounded-full bg-surface text-secondary shadow-sm"><ReceiptText className="size-5" /></span></section>

        <section className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container-low p-4"><div><span className="block font-label-eyebrow text-[10px] uppercase tracking-wider text-on-surface-variant">Mã đơn hàng</span><span className="mt-1 flex items-center gap-1 font-label-ui text-label-ui font-semibold tracking-wide text-primary">{receipt.orderCode}<button aria-label="Sao chép mã đơn hàng" className="p-1 text-on-surface-variant hover:text-secondary" onClick={() => copyText(receipt.orderCode, "Đã sao chép mã đơn hàng")} type="button"><Copy className="size-4" /></button></span></div><div className="text-right"><span className="block font-label-eyebrow text-[10px] uppercase tracking-wider text-on-surface-variant">Số tiền cần chuyển</span><strong className="font-price-serif text-[20px] text-primary-container">{formatVnd(total)}</strong></div></section>

        <section className="flex flex-col items-center gap-4">
          <div className="flex w-full max-w-[280px] flex-col items-center rounded-xl bg-surface-container-lowest p-4 shadow-md"><IllustrativeQr /><div className="mt-3 rounded bg-error-container px-2 py-1 text-center font-label-eyebrow text-[10px] font-medium uppercase tracking-wide text-on-error-container">QR minh họa — không dùng để thanh toán</div></div>
          <p className="max-w-xs text-center font-body-sm text-body-sm text-on-surface-variant">Mã QR thực tế sẽ hiển thị sau khi thông tin tài khoản nhận thanh toán được cấu hình.</p>
          <div className="grid w-full grid-cols-2 gap-2"><button className="flex items-center justify-center gap-2 rounded-lg bg-surface-container px-3 py-2 font-label-ui text-label-ui font-medium text-on-surface transition-colors hover:bg-surface-container-high" onClick={() => showToast("QR hiện tại chỉ là hình minh họa")} type="button"><Download className="size-[17px] text-secondary" />Lưu mã QR</button><button className="flex items-center justify-center gap-2 rounded-lg bg-surface-container px-3 py-2 font-label-ui text-label-ui font-medium text-on-surface transition-colors hover:bg-surface-container-high" onClick={() => copyText(`Mã đơn: ${receipt.orderCode}\nSố tiền: ${formatVnd(total)}\nNội dung CK: ${receipt.orderCode}`, "Đã sao chép thông tin đơn hàng")} type="button"><Copy className="size-[17px] text-secondary" />Sao chép thông tin</button></div>
        </section>

        <section className="space-y-2 rounded-xl bg-surface-container-low p-4"><h3 className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-widest text-secondary">Thông tin chuyển khoản chỉ định</h3><BankDetail label="Ngân hàng" value="Thông tin sẽ được cấu hình" /><BankDetail label="Chủ tài khoản" value="Chưa cấu hình" /><BankDetail label="Số tài khoản" value="Chưa cấu hình" /><div className="flex items-center justify-between gap-3 rounded bg-surface-container/60 px-2 py-2 font-body-sm text-body-sm"><span className="font-medium text-primary">Nội dung chuyển khoản</span><span className="flex items-center gap-1 font-label-ui text-label-ui font-bold tracking-wider text-primary-container">{receipt.orderCode}<button aria-label="Sao chép nội dung chuyển khoản" className="p-1 text-primary hover:text-secondary" onClick={() => copyText(receipt.orderCode, "Đã sao chép nội dung chuyển khoản")} type="button"><Copy className="size-4" /></button></span></div></section>

        <section className="flex items-start gap-3 rounded-lg bg-surface-container p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed"><Clock3 className="size-[18px]" /></span><div><h4 className="font-headline-sm text-[16px] leading-6 font-semibold text-primary">Đang chờ xác nhận thanh toán</h4><p className="font-body-sm text-body-sm text-on-surface-variant">Đơn giao đến <span className="font-medium text-on-surface">{draft.deliveryAddress}</span> sẽ được xử lý sau khi thông tin thanh toán được xác nhận.</p></div></section>
      </div>

      <footer className="shrink-0 space-y-2 border-t border-outline-variant/30 bg-surface px-5 py-4 md:px-7"><button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3 font-label-ui text-label-ui font-semibold uppercase tracking-widest text-on-primary shadow-sm transition-colors hover:bg-primary" onClick={onClose} type="button">Hoàn tất &amp; quay lại <CheckCircle2 className="size-[18px]" /></button><button className="w-full font-label-ui text-label-ui text-secondary underline decoration-secondary-fixed-dim underline-offset-4 transition-colors hover:text-primary" onClick={onBack} type="button">Xem lại thông tin đơn hàng</button></footer>

      <div aria-live="polite" className={`pointer-events-none fixed right-5 bottom-5 z-[80] flex items-center gap-2 rounded-lg bg-inverse-surface px-4 py-2.5 font-label-ui text-label-ui text-inverse-on-surface shadow-xl transition-all ${toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}><Check className="size-[18px] text-secondary-fixed" />{toast ?? "Đã sao chép"}</div>
    </aside>
  );
}

function BankDetail({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 py-1 font-body-sm text-body-sm"><span className="text-on-surface-variant">{label}</span><span className="text-right font-medium italic text-outline">{value}</span></div>;
}

function IllustrativeQr() {
  return <div className="relative flex size-48 items-center justify-center rounded-lg bg-surface-container-lowest p-2 text-primary"><svg aria-label="Mã QR minh họa" className="h-full w-full" fill="none" role="img" viewBox="0 0 160 160"><g stroke="currentColor" strokeWidth="4"><rect height="40" rx="4" width="40" x="8" y="8" /><rect height="40" rx="4" width="40" x="112" y="8" /><rect height="40" rx="4" width="40" x="8" y="112" /></g><g fill="currentColor"><rect height="20" rx="2" width="20" x="18" y="18" /><rect height="20" rx="2" width="20" x="122" y="18" /><rect height="20" rx="2" width="20" x="18" y="122" /><rect height="16" width="8" x="56" y="12" /><rect height="8" width="12" x="72" y="8" /><rect height="10" width="10" x="92" y="16" /><rect height="10" width="10" x="12" y="56" /><rect height="6" width="14" x="30" y="60" /><rect height="16" width="8" x="16" y="80" /><rect height="12" width="12" x="36" y="78" /><rect height="20" width="8" x="116" y="60" /><rect height="8" width="14" x="132" y="72" /><rect height="12" width="18" x="120" y="90" /><rect height="12" width="12" x="56" y="116" /><rect height="18" width="8" x="76" y="124" /><rect height="8" width="12" x="92" y="112" /><rect height="8" width="22" x="112" y="136" /><rect height="14" width="10" x="140" y="120" /><rect height="8" width="8" x="52" y="52" /><rect height="8" width="8" x="100" y="52" /><rect height="8" width="8" x="52" y="100" /><rect height="8" width="8" x="100" y="100" /></g></svg><div className="absolute flex size-14 flex-col items-center justify-center rounded-full bg-primary-container text-center shadow-md"><span className="text-[7px] leading-none tracking-widest text-secondary-fixed">SINCE 1932</span><span className="font-headline-sm text-[12px] font-bold text-surface">M.S</span><span className="text-[6px] uppercase tracking-wider text-secondary-fixed">Hà Nội</span></div></div>;
}
