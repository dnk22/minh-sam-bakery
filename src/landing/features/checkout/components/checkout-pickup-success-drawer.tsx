"use client";

import { CalendarDays, Check, CheckCircle2, CircleHelp, MapPin, ReceiptText, Store, WalletCards, X } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";

import { routes } from "@/landing/lib/routes";

import type { CheckoutDraft, CheckoutLineItem, CheckoutReceipt } from "../types";
import { CheckoutProductSummary, formatVnd } from "./checkout-product-summary";

export function CheckoutPickupSuccessDrawer({ dialogRef, draft, item, onClose, receipt }: { dialogRef: RefObject<HTMLElement | null>; draft: CheckoutDraft; item: CheckoutLineItem; onClose: () => void; receipt: CheckoutReceipt }) {
  const total = item.unitPrice * item.quantity;

  return (
    <aside aria-labelledby="pickup-success-title" aria-modal="true" className="fixed top-0 right-0 bottom-0 z-[71] flex h-dvh w-full max-w-[520px] flex-col overflow-hidden border-l border-outline-variant/30 bg-surface-container-lowest text-on-surface shadow-2xl" ref={dialogRef} role="dialog">
      <header className="flex shrink-0 items-center justify-between px-5 pt-5 pb-4 md:px-7 md:pt-7"><div><span className="font-label-eyebrow text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Minh Sâm Bakery • 1932</span><h2 className="mt-1 font-headline-sm text-headline-sm font-semibold text-primary" id="pickup-success-title">Xác nhận đặt bánh</h2></div><button aria-label="Đóng ngăn xác nhận" className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary" data-autofocus onClick={onClose} type="button"><X className="size-5" /></button></header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-6 md:px-7">
        <section className="flex flex-col items-center pt-2 pb-1 text-center">
          <div className="relative mb-4 flex size-24 items-center justify-center"><div className="absolute inset-0 rounded-full bg-secondary-fixed/30" /><div className="absolute inset-2 rounded-full border border-dashed border-secondary" /><div className="relative flex size-12 items-center justify-center rounded-full bg-secondary-container shadow-sm"><Check className="size-7 text-secondary" /></div></div>
          <h3 className="max-w-sm font-headline-sm text-headline-sm font-semibold text-primary">Đơn đặt bánh đã được ghi nhận</h3>
          <p className="mt-1 max-w-sm font-body-md text-body-md text-on-surface-variant">Thông tin đơn hàng đã được ghi nhận. Vui lòng kiểm tra chi tiết nhận bánh bên dưới.</p>
        </section>

        <section className="space-y-4 rounded-xl bg-surface-container-low p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface"><ReceiptText className="size-[18px] text-secondary" />Mã đơn hàng</span><span className="rounded bg-surface-container px-2 py-1 font-price-serif text-price-serif font-bold tracking-wider text-primary">{receipt.orderCode}</span></div>
          <CheckoutProductSummary item={item} />
          <dl className="space-y-2 pt-1 font-body-sm text-body-sm"><OrderDetail Icon={Store} label="Hình thức nhận" value="Tại cửa hàng" /><OrderDetail Icon={CalendarDays} label="Ngày nhận" value={formatDate(draft.receiveDate)} /><OrderDetail Icon={WalletCards} label="Thanh toán" value="Tại cửa hàng" /></dl>
        </section>

        <section className="space-y-3 rounded-xl bg-surface-container p-4 shadow-sm"><div className="flex items-start justify-between gap-4"><div><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase text-secondary">Trạng thái thanh toán</span><span className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-secondary-fixed"><span className="size-1.5 rounded-full bg-secondary" />Chưa thanh toán</span></div><div className="text-right"><span className="font-label-eyebrow text-[10px] uppercase text-on-surface-variant">Tổng tiền cần thu</span><p className="font-headline-md text-[26px] font-bold text-primary">{formatVnd(total)}</p></div></div><p className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant"><CircleHelp className="mt-0.5 size-[18px] shrink-0 text-secondary" />Quý khách vui lòng thanh toán trực tiếp khi đến nhận bánh tại quầy trà viện.</p></section>

        <section className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/40 text-secondary"><MapPin className="size-5" /></span><div><h4 className="font-headline-sm text-[16px] leading-[22px] font-semibold text-primary">Thông tin nhận bánh</h4><p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Bánh tươi sẽ được chuẩn bị sẵn sàng và bảo quản tiêu chuẩn tại:</p><p className="mt-1 font-body-sm text-body-sm font-medium text-primary">Trà Viện Minh Sâm — 12 Hàng Than, Ba Đình, Hà Nội</p></div></section>
      </div>

      <footer className="shrink-0 space-y-2 border-t border-outline-variant/30 bg-surface-container-lowest/95 px-5 py-4 shadow-[0_-8px_24px_rgba(46,2,8,0.06)] backdrop-blur-md md:px-7"><button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-container font-label-ui text-label-ui font-semibold uppercase tracking-widest text-on-primary shadow-md transition-colors hover:bg-primary" onClick={onClose} type="button">Hoàn tất &amp; quay lại <CheckCircle2 className="size-[18px]" /></button><Link className="flex h-11 w-full items-center justify-center rounded-lg bg-surface-container-high font-label-ui text-label-ui font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-secondary-fixed" href={routes.products} onClick={onClose}>Tiếp tục khám phá bánh</Link></footer>
    </aside>
  );
}

function OrderDetail({ Icon, label, value }: { Icon: typeof Store; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-on-surface-variant"><Icon className="size-4 text-secondary" />{label}</dt><dd className="text-right font-medium text-on-surface">{value}</dd></div>;
}

function formatDate(value: string) {
  if (!value) return "Theo thời gian đã lựa chọn";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}
